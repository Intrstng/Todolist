import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CustomThemeMode} from "@/common/types";
import {AppInitialState, Status} from "@/app/slices/appSlice.types.ts";

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
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const { themeModeSelector, isInitializedSelector, statusSelector, errorSelector, authIsLoggedInSelector } = appSlice.selectors
