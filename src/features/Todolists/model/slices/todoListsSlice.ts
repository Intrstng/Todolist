import {todolistApi} from '@/features/Todolists/api/todolistApi.ts';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createAppAsyncThunk} from "@/utils/createAppAsyncThunk.ts";
import {thunkTryCatch} from "@/utils/thunkTryCatch.ts";
import {AddTodolistArg, DeleteTodolistArg, UpdateTodolistArg} from "@/features/Todolists/api/todolistsApi.types.ts";
import {RejectAppError, RejectCatchError} from "@/common";
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {Status} from "@/app/slices/appSlice.types.ts";

// const initialTodoListState: TodolistDomainType[] = [
//     // {id: todolistID_1, title: 'What to do', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0},
//     // {id: todolistID_2, title: 'What to ask', filter: 'all', entityStatus: 'idle', addedDate: new Date(), order: 0}
// ];

const todoListsSlice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoListsTC.fulfilled, (_state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
            })

            .addCase(addTodoListTC.fulfilled, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
                const newTodoList: TodolistDomainType = {
                    ...action.payload.todolist,
                    filter: 'all',
                    entityStatus: 'idle',
                }
                state.unshift(newTodoList);
            })

            .addCase(changeTodoListTitleTC.fulfilled, (state, action: PayloadAction<UpdateTodolistArg>) => {
                const idx = state.findIndex((tl) => tl.id === action.payload.id);
                if (idx !== -1) {
                    state[idx].title = action.payload.title;
                }
            })

            .addCase(removeTodoListTC.fulfilled, (state, action: PayloadAction<DeleteTodolistArg>) => {
                const todoIndex = state.findIndex((tl) => tl.id === action.payload.id);
                if (todoIndex !== -1) {
                    state.splice(todoIndex, 1);
                }
            })
            .addCase(clearTasksAndTodolists, (state) => {
                state = [];
                return state;
                // // Or:
                // return [];
            })
    },
    reducers: {
        changeFilter(state, action: PayloadAction<{ todolistID: string; value: FilterValuesType }>) {
            const idx = state.findIndex((tl) => tl.id === action.payload.todolistID);
            if (idx !== -1) {
                state[idx].filter = action.payload.value;
            }
        },
        changeTodoListsEntityStatus(state, action: PayloadAction<{ todolistID: string; entityStatus: Status }>) {
            const idx = state.findIndex((tl) => tl.id === action.payload.todolistID);
            if (idx !== -1) {
                state[idx].entityStatus = action.payload.entityStatus;
            }
        },
    },
    selectors: {
        todoListsSelector: (state: TodolistDomainType[]): TodolistDomainType[] => state,
        todoListSelector: (state: TodolistDomainType[], id: number): TodolistDomainType => state[id],
    }
});

// !!! Old selector from selectors folder. Pay attention that another typisation of state: AppRootState
// export const todoListsSelector = (state: AppRootState): TodolistDomainType[] => state.todolists;

// Before refactoring fetchTodoListsTC thunk to createAppAsyncThunk:
//
// export const fetchTodoListsTC = (): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: 'loading' }));
//   todolistApi
//     .getTodolists()
//     .then((response) => {
//       dispatch(todoListsActions.setTodoLists({ todolists: response.data }));
//       // dispatch(setAppStatusAC({status: 'succeeded'})); // moved to next then
//       return response.data;
//     })
//     .then((todos) => {
//       todos.forEach((tl) => dispatch(fetchTasksTC(tl.id)));
//       dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//     })
//     .catch((error: AxiosError<ErrorType>) => {
//       handleServerNetworkError(dispatch, error);
//     });
// };

// Технические ошибки (сеть упала) → ловит функция-обёртка thunkTryCatch
// Бизнес-ошибки (resultCode !== Success) → обрабатываем вручную
// fetchTodoListsTC согласно Swagger схемы возвращает массив тудулистов, а не BaseResponse с ResultCode (0, 1, 10),
// соответственно, здесь проверять на успешный ResultCode с дополнительным rejectWithValue не надо как например в changeTodolistTitle
const fetchTodoListsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    `${todoListsSlice.name}/fetchTodolists`,
    (_, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistApi.getTodolists()
            return {todolists: res.data}
        })
    },
)

const removeTodoListTC = createAppAsyncThunk<{ id: string }, DeleteTodolistArg>(
    `${todoListsSlice.name}/removeTodolist`,
    ({id}, thunkAPI) => {
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
)

const addTodoListTC = createAppAsyncThunk<{ todolist: TodolistType }, AddTodolistArg>(
    `${todoListsSlice.name}/addTodolist`,
    (arg, thunkAPI) => {
        const {rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistApi.createTodolist({title: arg.title})
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                return {todolist: res.data.data.item}
            } else {
                return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
            }
        })
    },
)

const changeTodoListTitleTC = createAppAsyncThunk<UpdateTodolistArg, UpdateTodolistArg>(
    `${todoListsSlice.name}/changeTodolistTitle`,
    (arg, thunkAPI) => {
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
)

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
export const todolistsThunks = {fetchTodoListsTC, addTodoListTC, changeTodoListTitleTC, removeTodoListTC}
export const { todoListsSelector, todoListSelector } = todoListsSlice.selectors
export const todolistsPath = todoListsSlice.reducerPath
