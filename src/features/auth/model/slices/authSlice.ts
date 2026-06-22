import {authApi} from '@/features/auth/api/auth-api';
import {isFulfilled, PayloadAction} from '@reduxjs/toolkit';
import {appActions} from '@/app/slices/appSlice';
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {RESULT_CODE} from "@/features/Todolists/model/slices";
import {createAppSlice} from "@/common/utils";
import {handleServerAppError, handleServerNetworkError} from "@/utils/errorUtils.ts";
import {LoginParamsType} from "@/features/auth/api/authApi.types.ts";

export const authSlice = createAppSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  } as LoginState,
    reducers: create => ({
        login: create.asyncThunk<LoginState, LoginParamsType>(
            async (params, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI;
              try {
                  dispatch(appActions.setAppStatus({status: "loading"}))
                  const res = await authApi.login(params)

                  if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                      dispatch(appActions.setAppStatus({status: "succeeded"}))
                      return { isLoggedIn: true }
                  } else {
                      handleServerAppError(res.data, dispatch)
                      return rejectWithValue(null)
                  }
              } catch (error) {
                  handleServerNetworkError(error, dispatch)
                  return rejectWithValue(null)
              }
            },
            {
                // fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                //     state.isLoggedIn = action.payload.isLoggedIn
                // },
            }
        ),

        logOut: create.asyncThunk<LoginState, void>(
            async (_, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI;
           try {
               dispatch(appActions.setAppStatus({status: "loading"}))
               const res = await authApi.logout()
               if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                   dispatch(clearTasksAndTodolists());
                   dispatch(appActions.setAppStatus({status: "succeeded"}))

                   return { isLoggedIn: false }  // logout (kill cookie)
               } else {
                   handleServerAppError(res.data, dispatch)
                   return rejectWithValue(null)
               }
           } catch (error) {
               handleServerNetworkError(error, dispatch)
               return rejectWithValue(null)
           }
            },
            {
                // fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                //     state.isLoggedIn = action.payload.isLoggedIn
                // },
            }
        ),

        initializeApp: create.asyncThunk<LoginState, void>(
            async (_, thunkAPI) => {
                const {dispatch, rejectWithValue} = thunkAPI;
                try {
                    dispatch(appActions.setAppStatus({status: "loading"}))
                    const res = await authApi.me()
                    if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                        dispatch(appActions.setAppStatus({status: "succeeded"}))

                        return {isLoggedIn: true}
                    } else {
                        handleServerAppError(res.data, dispatch)
                        return rejectWithValue(null)
                    }
                } catch (error) {
                    handleServerNetworkError(error, dispatch)
                    return rejectWithValue(null)
                } finally {
                    dispatch(appActions.setAppInitialized({isInitialized: true}))
                }
            },
            {
                // fulfilled: (state, action) => { // or action: PayloadAction<{ todolists: TodolistType[] }>
                //     state.isLoggedIn = action.payload.isLoggedIn
                // },
            }
        ),
    }),
    extraReducers: (builder) => {
        builder.addMatcher(
            isFulfilled(
                authSlice.actions.login,
                authSlice.actions.logOut,
                authSlice.actions.initializeApp
            ),
            (state, action: PayloadAction<LoginState>) => {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        )
    },
    selectors: {
        authIsLoggedInSelector: (state: LoginState): boolean => state.isLoggedIn
    }
});

// THUNKS
// const loginTC = createAppAsyncThunk<LoginState, LoginParamsType>(
//     `${authSlice.name}/login`,
//     (params, thunkAPI) => {
//         const {rejectWithValue} = thunkAPI;
//         return thunkTryCatch(thunkAPI, async () => {
//             const res = await authApi.login(params)
//             if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
//                 return { isLoggedIn: true }
//             } else {
//                 return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
//             }
//         })
//     },
// )


export type LoginState = {
  isLoggedIn: boolean;
};

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const {authIsLoggedInSelector} =  authSlice.selectors
