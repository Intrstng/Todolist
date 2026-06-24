import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from '@reduxjs/toolkit';
import {CustomThemeMode} from "@/common/types";
import {AppInitialState, Status} from "@/app/slices/appSlice.types.ts";
import {todolistsApi} from "@/features/Todolists/api/todolistApi.ts";
import {tasksApi} from "@/features/Todolists/api/taskApi.ts";

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as Status,
    error: null,
    isInitialized: false,
    themeMode: 'light' as CustomThemeMode,
    isLoggedIn: false,
  } as AppInitialState,
  selectors: {
    themeModeSelector: (state: AppInitialState): CustomThemeMode => state.themeMode,
    statusSelector: (state: AppInitialState): Status => state.status,
    errorSelector: (state: AppInitialState): string | null => state.error,
    isInitializedSelector: (state: AppInitialState): boolean => state.isInitialized,
    authIsLoggedInSelector: (state: AppInitialState): boolean => state.isLoggedIn,
  },
  reducers: {
    changeThemeMode(state, action: PayloadAction<{ theme: CustomThemeMode }>) {
      state.themeMode = action.payload.theme;
    },
    setAppStatus(state, action: PayloadAction<{ status: Status }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },

    // From auth-slice
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {
    // Вариант 1 с функцией предикатом
    // builder.addMatcher(
    //   (action) => action.type.endsWith("/pending"),
    //   (state, action) => {
    //     state.status = "loading"
    //   },
    // )
    //
    // builder.addMatcher(
    //   (action) => action.type.endsWith("/fulfilled"),
    //   (state, action) => {
    //     state.status = "succeeded"
    //   },
    // )
    //
    // builder.addMatcher(
    //   (action) => action.type.endsWith("/rejected"),
    //   (state, action) => {
    //     state.status = "failed"
    //   },
    // ) // Теперь убрать все dispatch(setAppStatusAC({ status: "loading" }))???
    //
    //
    //
    // Вариант 2 с Matching Utilities (isPending; isFulfilled; isRejected)
    builder.addMatcher(isPending, (state, action) => {
      if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
      ) {
        return // I use Query Loading State in Todolists and Tasks with skeletons
      }
      state.status = "loading" // for global linearProgress and circular progress on authMe
    })

    builder.addMatcher(isFulfilled, (state, _action) => {
      state.status = "succeeded"
    })

    builder.addMatcher(isRejected, (state, _action) => {
      state.status = "failed"
    }) // Теперь убрать все dispatch(setAppStatusAC({ status: "loading" }))???
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const { themeModeSelector, isInitializedSelector, statusSelector, errorSelector, authIsLoggedInSelector } = appSlice.selectors
