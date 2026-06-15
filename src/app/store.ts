import { tasksReducer, todoListsReducer } from '@/features/Todolists/model/slices'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authReducer } from '../features/Login/model/slices/authSlice'

import { configureStore, UnknownAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query"
import { appReducer } from "./slices/appSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    todolists: todoListsReducer,
    tasks: tasksReducer,
    auth: authReducer,
  },
});

setupListeners(store.dispatch)

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

Object.defineProperty(window, 'store', {
  value: store,
  writable: true,
});
// // @ts-ignore
// window.store = store;
