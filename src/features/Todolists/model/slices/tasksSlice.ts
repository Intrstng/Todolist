import {taskApi} from '@/features/Todolists/api/taskApi.ts'
import {AppRootState} from '@/app/store'
import {current, PayloadAction} from '@reduxjs/toolkit'
import {RESULT_CODE, todoListsActions, TodolistType} from './todoListsSlice'
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
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
import {createAppSlice} from "@/common/utils";

// const tasksInit: TasksType = {
//   // [todolistID_1]: [
//   //     { id: v1(), title: "HTML&CSS", status: TaskStatuses.New, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_1, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   // ],
//   // [todolistID_2]: [
//   //     { id: v1(), title: "Age", status: TaskStatuses.Completed, description:'', priority: TaskPriorities.Low,
//   //     startDate: new Date(), deadline: new Date(), todoListId: todolistID_2, order: 0, addedDate: new Date(), entityStatus: 'idle'},
//   // ]
// };

export const tasksSlice = createAppSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: create => ({
        fetchTasks: create.asyncThunk<{ todolistID: string, tasks: TaskType[] }, string>(
            async (todolistID: string, thunkAPI) => {
                return thunkTryCatch(thunkAPI, async () => {
                    const res = await taskApi.getAllTasks(todolistID)
                    const tasks = res.data.items
                    return {tasks, todolistID}
                })
            },
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    state[action.payload.todolistID] = action.payload.tasks.map((t) => ({
                        ...t,
                        entityStatus: 'idle',
                    }));
                },
            }
        ),

        addTask: create.asyncThunk<{ task: TaskType }, AddTaskArg>(
            async ({todolistID, title}: AddTaskArg, thunkAPI) => {
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
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    const newTask = {
                        ...action.payload.task,
                        entityStatus: "idle" as Status,
                    }
                    state[action.payload.task.todoListId].unshift(newTask);
                },
            }
        ),

        removeTask: create.asyncThunk<DeleteTaskArg, DeleteTaskArg>(
            async ({todolistID, taskID}: DeleteTaskArg, thunkAPI) => {
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
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    const tasks = state[action.payload.todolistID]
                    let taskToDeleteIndex = tasks.findIndex(task => task.id === action.payload.taskID)
                    if (taskToDeleteIndex !== -1) {
                        tasks.splice(taskToDeleteIndex, 1)
                    }
                },
            }
        ),

        updateTask: create.asyncThunk<UpdateTaskArg, UpdateTaskArg>(
            async ({todolistID, taskID, model}: UpdateTaskArg, thunkAPI) => {
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
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    const tasks = state[action.payload.todolistID]
                    let taskToUpdateIndex = tasks.findIndex(task => task.id === action.payload.taskID)
                    if (taskToUpdateIndex !== -1) {
                        tasks[taskToUpdateIndex] = {
                            ...tasks[taskToUpdateIndex],
                            ...action.payload.model
                        };
                    }
                },
            }
        ),

        changeTasksEntityStatus: create.reducer<{
            todolistID: string;
            taskID: string;
            entityStatus: Status;
        }>((state, action) => {
            const tasks = state[action.payload.todolistID];
            const task = tasks.find((t) => t.id === action.payload.taskID);
            if (task) {
                task.entityStatus = action.payload.entityStatus;
            }
        }),
    }),

    extraReducers: (builder) => {
        builder
            .addCase(todoListsActions.addTodoList.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todoListsActions.removeTodoList.fulfilled, (state, action) => {
                delete state[action.payload.id];
                // // Or:
                // const {[action.payload.todolistID]: [], ...rest} = state;
                // return rest;
            })
            .addCase(todoListsActions.fetchTodolists.fulfilled, (state, action: PayloadAction<{
                todolists: TodolistType[]
            }>) => {
                action.payload.todolists.forEach((tl) => {
                    console.log(current(state))
                    console.log(tl.id)
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

        // .addCase(tasksThunks.fetchTasksTC.fulfilled, (state, action: PayloadAction<{
        //     todolistID: string,
        //     tasks: TaskType[]
        // }>) => {
        //     state[action.payload.todolistID] = action.payload.tasks.map((t) => ({
        //         ...t,
        //         entityStatus: 'idle',
        //     }));
        // })
    },
    selectors: {
        tasksSelector: (state: TasksType): TaskDomainType[] => state.tasks,
        todolistTasksSelector: (state: TasksType, todolistId: string): TaskDomainType[] => state[todolistId],
    }
});

// const fetchTasksTC = createAppAsyncThunk<{ todolistID: string, tasks: TaskType[] }, string>(
//     `${tasksSlice.name}/fetchTasks`,
//     (todolistID: string, thunkAPI) => {
//         return thunkTryCatch(thunkAPI, async () => {
//             const res = await taskApi.getAllTasks(todolistID)
//             const tasks = res.data.items
//             return {tasks, todolistID}
//         })
//     },
// )

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
export const {tasksSelector, todolistTasksSelector} = tasksSlice.selectors
