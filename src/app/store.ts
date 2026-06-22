import {tasksReducer, tasksSlice, todoListsReducer, todoListsSlice} from '@/features/Todolists/model/slices'
import {TypedUseSelectorHook, useSelector} from 'react-redux'
import {configureStore, ThunkAction, ThunkDispatch, UnknownAction} from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query"
import {appReducer, appSlice} from "./slices/appSlice"
import {authReducer, authSlice} from "@/features/auth/model/slices/authSlice.ts";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [todoListsSlice.name]: todoListsReducer,
    [tasksSlice.name]: tasksReducer,
    [authSlice.name]: authReducer,
  },
});

setupListeners(store.dispatch)

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>;


export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

Object.defineProperty(window, 'store', {
  value: store,
  writable: true,
});
// // @ts-ignore
// window.store = store;
