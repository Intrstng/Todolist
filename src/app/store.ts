import {tasksReducer, tasksSlice, todoListsReducer, todoListsSlice} from '@/features/Todolists/model/slices'
import {TypedUseSelectorHook, useSelector} from 'react-redux'
import {configureStore, ThunkDispatch, UnknownAction} from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query"
import {appReducer, appSlice} from "./slices/appSlice"
import {authReducer, authSlice} from "@/features/auth/model/slices/authSlice.ts";
import {baseApi} from "@/app/baseApi.ts";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [todoListsSlice.name]: todoListsReducer,
    [tasksSlice.name]: tasksReducer,
    [authSlice.name]: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(_todolistsApi.middleware),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch) // Add for RTK query cash, invalidation, pooling, refetchOnFocus, refetchOnReconnect

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>;
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, UnknownAction>;

export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;