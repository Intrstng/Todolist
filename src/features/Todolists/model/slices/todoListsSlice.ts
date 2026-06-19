import {todolistApi} from '@/features/Todolists/api/todolistApi.ts';
import {thunkTryCatch} from "@/utils/thunkTryCatch.ts";
import {AddTodolistArg, DeleteTodolistArg, UpdateTodolistArg} from "@/features/Todolists/api/todolistsApi.types.ts";
import {RejectAppError, RejectCatchError} from "@/common";
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {Status} from "@/app/slices/appSlice.types.ts";
import {createAppSlice} from "@/common/utils";

// const initialTodoListState: TodolistDomainType[] = [
//     // {id: todolistID_1, title: 'What to do', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0},
//     // {id: todolistID_2, title: 'What to ask', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0}
// ];

export const todoListsSlice = createAppSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: create => ({
        fetchTodolists: create.asyncThunk<{ todolists: TodolistType[] }, void>(
            async (_, thunkAPI) => {
                return thunkTryCatch(thunkAPI, async () => {
                    const res = await todolistApi.getTodolists()
                    return {todolists: res.data}
                })
            },
            {
                fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                    action.payload?.todolists.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
                },
            }
        ),

        addTodoList: create.asyncThunk<{ todolist: TodolistType }, AddTodolistArg>(
            async (arg, thunkAPI) => {
                return thunkTryCatch(thunkAPI, async () => {
                    const {rejectWithValue} = thunkAPI
                    return thunkTryCatch(thunkAPI, async () => {
                        const res = await todolistApi.createTodolist({title: arg.title})
                        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                            return {todolist: res.data.data.item}
                        } else {
                            return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
                        }
                    })
                })
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
                    dispatch(todoListsActions.changeTodoListsEntityStatus({todolistID: id, entityStatus: 'loading'}));
                    try {
                        const res = await todolistApi.deleteTodolist(id)
                        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                            return {id}
                        } else {
                            return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
                        }
                    } catch (error) {
                        // Reset entity status on network error - Avoid deleting Todolist without network
                        dispatch(todoListsActions.changeTodoListsEntityStatus({
                            todolistID: id,
                            entityStatus: 'idle'
                        }));
                        return rejectWithValue({error: error, type: "catchError"} satisfies RejectCatchError)
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
                const {rejectWithValue} = thunkAPI
                return thunkTryCatch(thunkAPI, async () => {
                    const res = await todolistApi.updateTodolist(arg.id, {title: arg.title})
                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        return arg
                    } else {
                        return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
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

            // .addCase(addTodoListTC.fulfilled, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            //     const newTodoList: TodolistDomainType = {
            //         ...action.payload.todolist,
            //         filter: 'all',
            //         entityStatus: 'idle',
            //     }
            //     state.unshift(newTodoList);
            // })

            // .addCase(changeTodoListTitleTC.fulfilled, (state, action: PayloadAction<UpdateTodolistArg>) => {
            //     const idx = state.findIndex((tl) => tl.id === action.payload.id);
            //     if (idx !== -1) {
            //         state[idx].title = action.payload.title;
            //     }
            // })

            // .addCase(removeTodoListTC.fulfilled, (state, action: PayloadAction<DeleteTodolistArg>) => {
            //     const todoIndex = state.findIndex((tl) => tl.id === action.payload.id);
            //     if (todoIndex !== -1) {
            //         state.splice(todoIndex, 1);
            //     }
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


// TYPES
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistType = {
    id: string;
    addedDate: Date;
    order: number;
    title: string;
};

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: Status;
};

export type ErrorType = {
    // 400 Error
    statusCode: number;
    messages: [ErrorMessageItem, string];
    error: string;
};

type ErrorMessageItem = {
    message: string;
    field: string;
};

export enum RESULT_CODE {
    SUCCEDED = 0,
    INVALID = 1,
    INVALID_CAPTCHA_REQUIRED = 10,
}

export const todoListsReducer = todoListsSlice.reducer;
export const todoListsActions = todoListsSlice.actions;
export const {todoListsSelector, todoListSelector} = todoListsSlice.selectors
