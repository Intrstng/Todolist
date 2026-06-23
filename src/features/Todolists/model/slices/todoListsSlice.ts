import {_todolistApi} from '@/features/Todolists/api/_todolistApi.ts';
import {thunkTryCatch} from "@/utils/thunkTryCatch.ts";
import {AddTodolistArg, DeleteTodolistArg, UpdateTodolistArg} from "@/features/Todolists/api/todolistApi.types.ts";
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {Status} from "@/app/slices/appSlice.types.ts";
import {createAppSlice} from "@/common/utils";
import {handleServerAppError, handleServerNetworkError} from "@/utils/errorUtils.ts";
import {appActions} from "@/app/slices/appSlice.ts";
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {
    FilterValuesType,
    TodolistDomainType,
    TodolistType
} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";
import {
    createTodolistResponseSchema,
    getTodolistsResponseSchema
} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";
import {defaultResponseSchema} from "@/common/schemas/schemas.ts";

// const initialTodoListState: TodolistDomainType[] = [
//     // {id: todolistID_1, title: 'What to do', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0},
//     // {id: todolistID_2, title: 'What to ask', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0}
// ];

export const todoListsSlice = createAppSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: create => ({
        // fetchTodolists: create.asyncThunk<{ todolists: TodolistType[] }, void>(
        //     async (_, thunkAPI) => {
        //         const {dispatch, rejectWithValue} = thunkAPI
        //         return thunkTryCatch(thunkAPI, async () => {
        //             const res = await todolistApi.getTodolists()
        //             return {todolists: res.data}
        //         })
        //     },
        //     {
        //         fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
        //             action.payload?.todolists.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
        //         },
        //     }
        // ),
        fetchTodolists: create.asyncThunk<{ todolists: TodolistType[] }, void>(
            async (_, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI
                 try {
                     dispatch(appActions.setAppStatus({ status: "loading" }))
                     const res = await _todolistApi.getTodolists()
                     // Instead of the next code we fetchTasks in useEffect in TasksList
                     // and see todoListsActions.fetchTodolists.fulfilled in tasksSlice extraReducer
                     // res.data.forEach(tl => {
                     //     dispatch(tasksActions.fetchTasks(tl.id));
                     // });

                     getTodolistsResponseSchema.parse(res.data) // 💎 ZOD

                     dispatch(appActions.setAppStatus({ status: "succeeded" }))
                     return {todolists: res.data}
                 } catch (error) {
                     handleServerNetworkError(error, dispatch)
                     return rejectWithValue(null)
                 }
            },
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    action.payload?.todolists.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
                },
            }
        ),

        addTodoList: create.asyncThunk<{ todolist: TodolistType }, AddTodolistArg>(
            async (arg, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI
                try {
                    dispatch(appActions.setAppStatus({ status: "loading" }))
                    const res = await _todolistApi.createTodolist({title: arg.title})
                    createTodolistResponseSchema.parse(res.data) // 💎 ZOD

                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        dispatch(appActions.setAppStatus({ status: "succeeded" }))
                        return {todolist: res.data.data.item}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                }
            },
            {
                fulfilled: (state, action) => {
                    const newTodoList: TodolistDomainType = {
                        ...action.payload.todolist,
                        filter: 'all',
                        entityStatus: 'idle',
                    }
                    state.unshift(newTodoList);
                },
            }
        ),

        removeTodoList: create.asyncThunk<{ id: string }, DeleteTodolistArg>(
            async ({id}, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI
                return thunkTryCatch(thunkAPI, async () => {
                    try {
                        dispatch(appActions.setAppStatus({ status: "loading" }))
                        dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID: id, entityStatus: 'loading'})); // Set entityStatus
                        const res = await _todolistApi.deleteTodolist(id)
                        defaultResponseSchema.parse(res.data) // 💎 ZOD

                        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                            dispatch(appActions.setAppStatus({ status: "succeeded" }))
                            // We do not need to add next line, because if succeeded todolist will be removed
                            // dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID: id, entityStatus: 'succeeded'}));
                            return {id}
                        } else {
                            handleServerAppError(res.data, dispatch)
                            dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID: id, entityStatus: 'failed'})); // Unset entityStatus if we will have an error during the delete process
                            return rejectWithValue(null)
                        }
                    } catch (error) {
                        handleServerNetworkError(error, dispatch)
                        dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID: id, entityStatus: 'failed'})); // Unset entityStatus if we will have an error during the delete process
                        return rejectWithValue(null)
                    }
                })
            },
            {
                fulfilled: (state, action) => {
                    const todoIndex = state.findIndex((tl) => tl.id === action.payload.id);
                    if (todoIndex !== -1) {
                        state.splice(todoIndex, 1);
                    }
                },
            }
        ),

        changeTodoListTitle: create.asyncThunk<UpdateTodolistArg, UpdateTodolistArg>(
            async (arg, thunkAPI) => {
                return thunkTryCatch(thunkAPI, async () => {
                    const {dispatch, rejectWithValue} = thunkAPI
                    try {
                        dispatch(appActions.setAppStatus({ status: "loading" }))
                        const res = await _todolistApi.updateTodolist(arg.id, {title: arg.title})
                        defaultResponseSchema.parse(res.data) // 💎 ZOD

                        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                            dispatch(appActions.setAppStatus({ status: "succeeded" }))
                            return arg
                        } else {
                            handleServerAppError(res.data, dispatch)
                            return rejectWithValue(null)
                        }
                    } catch (error) {
                        handleServerNetworkError(error, dispatch)
                        return rejectWithValue(null)
                    }
                })
            },
            {
                fulfilled: (state, action) => {
                    const idx = state.findIndex((tl) => tl.id === action.payload.id);
                    if (idx !== -1) {
                        state[idx].title = action.payload.title;
                    }
                },
            }
        ),

        changeFilter: create.reducer<{ todolistID: string; value: FilterValuesType }>((state, action) => {
            const idx = state.findIndex((tl) => tl.id === action.payload.todolistID);
            if (idx !== -1) {
                state[idx].filter = action.payload.value;
            }
        }),

        changeTodoListsEntityStatus: create.reducer<{ todolistID: string; entityStatus: Status }>((state, action) => {
            const idx = state.findIndex((tl) => tl.id === action.payload.todolistID);
            if (idx !== -1) {
                state[idx].entityStatus = action.payload.entityStatus;
            }
        }),
    }),

    extraReducers: (builder) => {
        builder
            // .addCase(fetchTodoListsTC.fulfilled, (_state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            //     return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
            // })
            .addCase(clearTasksAndTodolists, (state) => {
                state = [];
                return state;
                // // Or:
                // return [];
            })
    },
    selectors: {
        todoListsSelector: (state: TodolistDomainType[]): TodolistDomainType[] => state,
        todoListSelector: (state: TodolistDomainType[], id: number): TodolistDomainType => state[id],
    }
});

// !!! Old selector from selectors folder. Pay attention that another typisation of state: AppRootState
// export const todoListsSelector = (state: AppRootState): TodolistDomainType[] => state.todolists;

// Before refactoring fetchTodoListsTC thunk to createAppAsyncThunk:

// Технические ошибки (сеть упала) → ловит функция-обёртка thunkTryCatch
// Бизнес-ошибки (resultCode !== Success) → обрабатываем вручную
// fetchTodoListsTC согласно Swagger схемы возвращает массив тудулистов, а не BaseResponse с ResultCode (0, 1, 10),
// соответственно, здесь проверять на успешный ResultCode с дополнительным rejectWithValue не надо как например в changeTodolistTitle
// const fetchTodoListsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
//     `${todoListsSlice.name}/fetchTodolists`,
//     (_, thunkAPI) => {
//         return thunkTryCatch(thunkAPI, async () => {
//             const res = await todolistApi.getTodolists()
//             return {todolists: res.data}
//         })
//     },
// )


export const todoListsReducer = todoListsSlice.reducer;
export const todoListsActions = todoListsSlice.actions;
export const {todoListsSelector, todoListSelector} = todoListsSlice.selectors
