import {configureStore, ThunkDispatch, UnknownAction} from '@reduxjs/toolkit'
import {setupListeners} from "@reduxjs/toolkit/query"
import {appReducer, appSlice} from "./slices/appSlice"
import {baseApi} from "@/app/baseApi.ts";

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(_todolistsApi.middleware),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch) // Add for RTK query cash, invalidation, pooling, refetchOnFocus, refetchOnReconnect

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>;