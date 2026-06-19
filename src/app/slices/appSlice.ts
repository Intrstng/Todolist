import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from '@reduxjs/toolkit';
import {CustomThemeMode, RejectActionError} from "@/common/types";
import {AppInitialState, Status} from "@/app/slices/appSlice.types.ts";
import axios from "axios";

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null,
    isInitialized: false,
    themeMode: 'light' as CustomThemeMode,
  } as AppInitialState,
  selectors: {
    themeModeSelector: (state: AppInitialState): CustomThemeMode => state.themeMode,
    statusSelector: (state: AppInitialState): Status => state.status,
    errorSelector: (state: AppInitialState): string | null => state.error,
    isInitializedSelector: (state: AppInitialState): boolean => state.isInitialized,
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
  },
  extraReducers: (builder) => {
    builder
        .addMatcher(isPending, (state) => {
          state.status = "loading"
        })
        .addMatcher(isFulfilled, (state) => {
          state.status = "succeeded"
        })
        .addMatcher(isRejected, (state) => {
          state.status = "failed"
        })
        .addMatcher(
            (action): action is PayloadAction<RejectActionError> => {
              return isRejected(action) && action.payload
            },
            (state, action: PayloadAction<RejectActionError>) => {
              const defaultMessage = "Some error occurred"

              // if (action.type === todolistsThunks.addTodolist.fulfilled.type) return

              switch (action.payload.type) {
                case "appError": {
                  const error = action.payload.error
                  state.error = error.messages.length ? error.messages[0] : defaultMessage
                  break
                }

                case "catchError": {
                  const error = action.payload.error
                  if (axios.isAxiosError(error)) {
                    state.error = error.response?.data?.message || error?.message || defaultMessage
                  } else if (error instanceof Error) {
                    state.error = `Native error: ${error.message}`
                  } else {
                    state.error = JSON.stringify(error)
                  }
                  break
                }

                default:
                  state.error = defaultMessage
              }
            },
        )
        .addDefaultCase((_state, action) => {
          console.log(action)
        })
  },
});


export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const { themeModeSelector, isInitializedSelector, statusSelector, errorSelector } = appSlice.selectors

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"