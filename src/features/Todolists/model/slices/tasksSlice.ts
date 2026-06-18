import {taskApi} from '@/features/Todolists/api/taskApi.ts'
import {AppRootState} from '@/app/store'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RESULT_CODE, todoListsActions, todolistsThunks} from './todoListsSlice'
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {createAppAsyncThunk} from "@/utils/createAppAsyncThunk.ts";
import {thunkTryCatch} from "@/utils/thunkTryCatch.ts";
import {
    AddTaskArg,
    DeleteTaskArg,
    TaskDomainType,
    TaskType,
    UpdateTaskArg,
    UpdateTaskType
} from "@/features/Todolists/api/taskApi.types.ts";
import {Status} from "@/app/slices/appSlice.types.ts";
import {TaskPriorities, TaskStatuses} from "@/common/enums/enums.ts";
import {RejectAppError, RejectCatchError} from "@/common";

// const tasksInit: TasksType = {
//   // [todolistID_1]: [
//   //     { id: v1(), title: "HTML&CSS", status: TaskStatuses.New, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_1, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   //     { id: v1(), title: "JS", status: TaskStatuses.Completed, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_1, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   //     { id: v1(), title: "ReactJS", status: TaskStatuses.New, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_1, order: 0, addedDate: new Date(), entityStatus: 'idle'}
//   // ],
//   // [todolistID_2]: [
//   //     { id: v1(), title: "Age", status: TaskStatuses.Completed, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_2, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   //     { id: v1(), title: "Weight", status: TaskStatuses.Completed, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_2, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   //     { id: v1(), title: "Height", status: TaskStatuses.New, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_2, order: 0, addedDate: new Date(), entityStatus: 'idle'}
//   // ]
// };

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: {
        changeTasksEntityStatus(
            state,
            action: PayloadAction<{
                todolistID: string;
                taskID: string;
                entityStatus: Status;
            }>,
        ) {
            const tasks = state[action.payload.todolistID];
            const task = tasks.find((t) => t.id === action.payload.taskID);
            if (task) {
                task.entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunks.addTodoListTC.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todolistsThunks.removeTodoListTC.fulfilled, (state, action) => {
                delete state[action.payload.id];
                // // Or:
                // const {[action.payload.todolistID]: [], ...rest} = state;
                // return rest;
            })
            .addCase(todolistsThunks.fetchTodoListsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })

            .addCase(clearTasksAndTodolists, (state, _action) => {
                Object.keys(state).forEach((key) => {
                    delete state[key];
                });
                // // Or:
                // return {}; // Return a new state object
            })

            .addCase(tasksThunks.fetchTasksTC.fulfilled, (state, action: PayloadAction<{
                todolistID: string,
                tasks: TaskType[]
            }>) => {
                state[action.payload.todolistID] = action.payload.tasks.map((t) => ({
                    ...t,
                    entityStatus: 'idle',
                }));
            })

            .addCase(tasksThunks.addTaskTC.fulfilled, (state, action: PayloadAction<{ task: TaskType }>) => {
                const newTask = {
                    ...action.payload.task,
                    entityStatus: "idle" as Status,
                }

                state[action.payload.task.todoListId].unshift(newTask);
            })

            .addCase(tasksThunks.updateTaskTC.fulfilled, (state, action: PayloadAction<UpdateTaskArg>) => {
                const tasks = state[action.payload.todolistID]
                let taskToUpdateIndex = tasks.findIndex(task => task.id === action.payload.taskID)
                if (taskToUpdateIndex !== -1) {
                    tasks[taskToUpdateIndex] = {
                        ...tasks[taskToUpdateIndex],
                        ...action.payload.model
                    };
                }
            })
            .addCase(tasksThunks.removeTaskTC.fulfilled, (state, action: PayloadAction<DeleteTaskArg>) => {
                const tasks = state[action.payload.todolistID]
                let taskToDeleteIndex = tasks.findIndex(task => task.id === action.payload.taskID)
                if (taskToDeleteIndex !== -1) {
                    tasks.splice(taskToDeleteIndex, 1)
                }
            })
    },
    selectors: {
        tasksSelector: (state: TasksType): TaskDomainType[] => state.tasks,
        todolistTasksSelector: (state: TasksType, todolistId: string): TaskDomainType[] => state[todolistId],
    }
});

// Before refactoring fetchTasksTC thunk to createAppAsyncThunk:
//
// export const fetchTasksTC =
//   (todolistID: string): AppThunk =>
//   async (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//     taskApi
//       .getAllTasks(todolistID)
//       .then((response) => {
//         dispatch(tasksActions.setTasks({ todolistID: todolistID, tasks: response.data.items }));
//         dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//       })
//       .catch((error: AxiosError<ErrorType>) => {
//         handleServerNetworkError(dispatch, error);
//       });
//   };

const fetchTasksTC = createAppAsyncThunk<{ todolistID: string, tasks: TaskType[] }, string>(
    `${tasksSlice.name}/fetchTasks`,
    (todolistID: string, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const res = await taskApi.getAllTasks(todolistID)
            const tasks = res.data.items
            return {tasks, todolistID}
        })
    },
)

// export const _removeTaskTC =
//   (todolistID: string, taskID: string): AppThunk =>
//   async (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//     dispatch(
//       tasksActions.changeTasksEntityStatus({
//         todolistID,
//         taskID,
//         entityStatus: 'loading',
//       }),
//     );
//     taskApi
//       .deleteTask(todolistID, taskID)
//       .then((response) => {
//         if (response.data.resultCode === RESULT_CODE.SUCCEDED) {
//           // Success
//           dispatch(tasksActions.removeTask({ todolistID, taskID }));
//           dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//           // dispatch(changeTasksEntityStatusAC(todolistID, taskID, 'succeeded'));
//         } else {
//           handleServerAppError(dispatch, response.data);
//         }
//       })
//       .catch((error: AxiosError<ErrorType>) => {
//         handleServerNetworkError(dispatch, error);
//         dispatch(
//           tasksActions.changeTasksEntityStatus({
//             todolistID,
//             taskID,
//             entityStatus: 'idle',
//           }),
//         ); // Avoid deleting task without network
//       });
//   };

const removeTaskTC = createAppAsyncThunk<DeleteTaskArg, DeleteTaskArg>(
    `${tasksSlice.name}/removeTask`,
    ({todolistID, taskID}: DeleteTaskArg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(
                tasksActions.changeTasksEntityStatus({
                    todolistID,
                    taskID,
                    entityStatus: 'loading',
                }),
            );
            try {
                const res = await taskApi.deleteTask(todolistID, taskID)
                if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                    // Success
                    // Next line is not added because the task is already deleted after we get the success
                    // tasksActions.changeTasksEntityStatus({todolistID, taskID, entityStatus: 'succeeded'})
                    return {todolistID, taskID}
                } else {
                    console.log('ss')
                    dispatch(
                        tasksActions.changeTasksEntityStatus({
                            todolistID,
                            taskID,
                            entityStatus: 'idle',
                        }))
                    return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
                }
            } catch (error) {
                dispatch(
                    tasksActions.changeTasksEntityStatus({
                        todolistID,
                        taskID,
                        entityStatus: 'idle',
                    }))
                return rejectWithValue({error: error, type: "catchError"} satisfies RejectCatchError)
            }
        })
    },
)


// export const _addTaskTC =
//   (todolistID: string, title: string): AppThunk =>
//   async (dispatch) => {
//     const newTaskData = {
//       title,
//     };
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//                 dispatch(todoListsActions.changeTodoListsEntityStatus({ todolistID, entityStatus: 'loading' }));
//     taskApi
//       .createTask(todolistID, newTaskData)
//       .then((response) => {
//         if (response.data.resultCode === RESULT_CODE.SUCCEDED) {
//           // Success
//           dispatch(tasksActions.addTask({ newTaskData: response.data.data.item }));
//           dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//                                                   dispatch(
//                                                     todoListsActions.changeTodoListsEntityStatus({
//                                                       todolistID,
//                                                       entityStatus: 'succeeded',
//                                                     }),
//                                                   );
//         } else {
//           handleServerAppError<{ item: TaskType }>(dispatch, response.data);
//         }
//       })
//       .catch((error: AxiosError<ErrorType>) => {
//         handleServerNetworkError(dispatch, error);
//         dispatch(todoListsActions.changeTodoListsEntityStatus({ todolistID, entityStatus: 'idle' })); // Avoid adding task without network
//       });
//   };

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, AddTaskArg>(
    `${tasksSlice.name}/addTask`,
    ({todolistID, title}: AddTaskArg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID, entityStatus: 'loading'}));
            try {
                const res = await taskApi.createTask(todolistID, {title})
                if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                    const task = res.data.data.item
                    dispatch(
                        todoListsActions.changeTodoListsEntityStatus({
                            todolistID,
                            entityStatus: 'succeeded',
                        }))
                    return {task}
                } else {
                    dispatch(todoListsActions.changeTodoListsEntityStatus({
                        todolistID,
                        entityStatus: 'idle'
                    }));
                    return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
                }
            } catch (error) {
                // Reset entity status on network error - Avoid adding task without network
                dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID, entityStatus: 'idle'}));
                return rejectWithValue({error: error, type: "catchError"} satisfies RejectCatchError)
            }
        })
    },
)

// export const _updateTaskTC =
//   (todolistID: string, taskID: string, model: UpdateTaskDomainModelType): AppThunk =>
//   async (dispatch, getState: () => AppRootState) => {
//     const state = getState();
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//     const currentTask = state.tasks[todolistID].find((t) => t.id === taskID);
//     if (!currentTask) {
//       throw new Error('Task was not found in state');
//     }
//     const newTaskModel: UpdateTaskType = {
//       title: currentTask.title,
//       description: currentTask.description,
//       status: currentTask.status,
//       priority: currentTask.priority,
//       startDate: currentTask.startDate,
//       deadline: currentTask.deadline,
//       ...model,
//     };
//     taskApi
//       .updateTask(todolistID, taskID, newTaskModel)
//       .then((response) => {
//         if (response.data.resultCode === RESULT_CODE.SUCCEDED) {
//           // Success
//           dispatch(
//             tasksActions.updateTask({
//               todolistID,
//               taskID,
//               model: response.data.data.item,
//             }),
//           ); // or just model instead of response.data.data.item
//           dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//         } else {
//           handleServerAppError<{ item: TaskType }>(dispatch, response.data);
//         }
//       })
//       .catch((error: AxiosError<ErrorType>) => {
//         handleServerNetworkError(dispatch, error);
//       });
//   };

const updateTaskTC = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>(
    `${tasksSlice.name}/updateTask`,
    ({todolistID, taskID, model}: UpdateTaskArg, thunkAPI) => {
        const {rejectWithValue, getState} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const state = getState() as AppRootState;
            const currentTask = state.tasks[todolistID].find((task) => task.id === taskID);
            if (!currentTask) {
                // or instead of 'return' write "throw new Error('Task was not found in state')";
                return
            }
            const apiModel: UpdateTaskType = {
                title: currentTask.title,
                description: currentTask.description,
                status: currentTask.status,
                priority: currentTask.priority,
                startDate: currentTask.startDate,
                deadline: currentTask.deadline,
                ...model,
            };
            const res = await taskApi.updateTask(todolistID, taskID, apiModel)
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                const task = res.data.data.item
                return {
                    todolistID,
                    taskID,
                    model: task,
                }
            } else {
                return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
            }
        })
    },
)

// TYPES
export type TasksType = {
    [key: string]: TaskDomainType[];
};

export type UpdateTaskDomainModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: Date;
    deadline?: Date;
};


export const tasksReducer = tasksSlice.reducer;
export const tasksActions = tasksSlice.actions;
export const tasksThunks = {fetchTasksTC, addTaskTC, updateTaskTC, removeTaskTC}
export const {tasksSelector, todolistTasksSelector} = tasksSlice.selectors
export const tasksSlicePath = tasksSlice.reducerPath