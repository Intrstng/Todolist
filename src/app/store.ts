import {tasksReducer, tasksSlicePath, todolistsPath, todoListsReducer} from '@/features/Todolists/model/slices'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import {authPath, authReducer} from '../features/Login/model/slices/authSlice'

import { configureStore, UnknownAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query"
import {appPath, appReducer} from "./slices/appSlice"

export const store = configureStore({
  reducer: {
    [appPath]: appReducer,
    [todolistsPath]: todoListsReducer,
    [tasksSlicePath]: tasksReducer,
    [authPath]: authReducer,
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
