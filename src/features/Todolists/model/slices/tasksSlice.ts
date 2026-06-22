import {taskApi} from '@/features/Todolists/api/taskApi.ts'
import {AppRootState} from '@/app/store'
import {PayloadAction} from '@reduxjs/toolkit'
import {todoListsActions} from './todoListsSlice'
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {
    AddTaskArg,
    DeleteTaskArg,
    TaskDomainType,
    TaskType,
    UpdateTaskArg,
    UpdateTaskType
} from "@/features/Todolists/api/taskApi.types.ts";
import {Status} from "@/app/slices/appSlice.types.ts";
import {createAppSlice} from "@/common/utils";
import {appActions} from "@/app/slices/appSlice.ts";
import {handleServerAppError, handleServerNetworkError} from "@/utils/errorUtils.ts";
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {TasksType} from "@/features/Todolists/model/slices/tasksSlice.types.ts";
import {TodolistType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";
import {defaultResponseSchema} from "@/common/schemas/schemas.ts";
import {
    createTaskResponseSchema,
    responseGetTasksSchema,
    updateTaskResponseSchema
} from "@/features/Todolists/lib/schemas/taskApi.schema.ts";

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
                const {dispatch, rejectWithValue} = thunkAPI
                try {
                    dispatch(appActions.setAppStatus({status: "loading"}))
                    const res = await taskApi.getAllTasks(todolistID)
                    responseGetTasksSchema.parse(res.data) // 💎 ZOD

                    const tasks = res.data.items
                    dispatch(appActions.setAppStatus({status: "succeeded"}))
                    return {tasks, todolistID}
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
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
                try {
                    dispatch(appActions.setAppStatus({status: "loading"}))
                    dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID, entityStatus: 'loading'}));
                    const res = await taskApi.createTask(todolistID, {title})
                    createTaskResponseSchema.parse(res.data) // 💎 ZOD

                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        const task = res.data.data.item
                        dispatch(appActions.setAppStatus({status: "succeeded"}))
                        dispatch(
                            todoListsActions.changeTodoListsEntityStatus({
                                todolistID,
                                entityStatus: 'succeeded',
                            }))

                        return {task}
                    } else {
                        dispatch(todoListsActions.changeTodoListsEntityStatus({
                            todolistID,
                            entityStatus: 'failed'
                        }));
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    dispatch(todoListsActions.changeTodoListsEntityStatus({
                        todolistID,
                        entityStatus: 'failed'
                    }));
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
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
                try {
                    dispatch(appActions.setAppStatus({status: "loading"}))
                    dispatch(
                        tasksActions.changeTasksEntityStatus({
                            todolistID,
                            taskID,
                            entityStatus: 'loading',
                        })
                    );
                    const res = await taskApi.deleteTask(todolistID, taskID)
                    defaultResponseSchema.parse(res.data) // 💎 ZOD

                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        // Success
                        // Next line is not added because the task is already deleted after we get the success
                        // tasksActions.changeTasksEntityStatus({todolistID, taskID, entityStatus: 'succeeded'})
                        dispatch(appActions.setAppStatus({status: "succeeded"}))
                        return {todolistID, taskID}
                    } else {
                        dispatch(
                            tasksActions.changeTasksEntityStatus({
                                todolistID,
                                taskID,
                                entityStatus: 'failed',
                            }))
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    dispatch(
                        tasksActions.changeTasksEntityStatus({
                            todolistID,
                            taskID,
                            entityStatus: 'failed',
                        }))
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
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
                const {dispatch, rejectWithValue, getState} = thunkAPI;

                try {
                    dispatch(appActions.setAppStatus({status: "loading"}));
                    const state = getState() as AppRootState;
                    const currentTask = state.tasks[todolistID].find((task) => task.id === taskID);

                    if (!currentTask) {
                        // or instead of 'return'
                        return rejectWithValue(null);
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

                    const res = await taskApi.updateTask(todolistID, taskID, apiModel);
                    updateTaskResponseSchema.parse(res.data) // 💎 ZOD

                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        const task = res.data.data.item;
                        dispatch(appActions.setAppStatus({status: "succeeded"}));
                        return {
                            todolistID,
                            taskID,
                            model: task,
                        };
                    } else {
                        handleServerAppError(res.data, dispatch);
                        return rejectWithValue(null);
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch);
                    return rejectWithValue(null);
                }
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

export const tasksReducer = tasksSlice.reducer;
export const tasksActions = tasksSlice.actions;
export const {tasksSelector, todolistTasksSelector} = tasksSlice.selectors
