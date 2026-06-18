import {authApi, LoginParamsType} from '@/api/auth-api';
import {createSlice, isFulfilled, PayloadAction} from '@reduxjs/toolkit';
import {appActions} from '@/app/slices/appSlice';
import {clearTasksAndTodolists} from "@/common/actions/common.actions.ts";
import {createAppAsyncThunk} from "@/utils/createAppAsyncThunk.ts";
import {thunkTryCatch} from "@/utils/thunkTryCatch.ts";
import {RejectAppError} from "@/common";
import {RESULT_CODE} from "@/features/Todolists/model/slices";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  } as LoginState,
  reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            isFulfilled(loginTC, logOutTC, initializeAppTC),
            // is Any Of (login.fulfilled, logout.fulfilled, initializeApp.fulfilled),
            (state, action: PayloadAction<LoginState>) => {
                state.isLoggedIn = action.payload.isLoggedIn
            },
        )
    },
    selectors: {
        authIsLoggedInSelector: (state: LoginState): boolean => state.isLoggedIn
    }
});

// THUNKS
// export const _loginTC =
//   (params: LoginParamsType): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//     authApi
//       .login(params)
//       .then((response) => {
//         if (response.data.resultCode === 0) {
//           // Success
//           dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//           dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//         } else {
//           handleServerAppError(dispatch, response.data);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(dispatch, error);
//       });
//   };

const loginTC = createAppAsyncThunk<LoginState, LoginParamsType>(
    `${authSlice.name}/login`,
    (params, thunkAPI) => {
        const {rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authApi.login(params)
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                return { isLoggedIn: true }
            } else {
                return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
            }
        })
    },
)

const logOutTC = createAppAsyncThunk<LoginState, void>(
    `${authSlice.name}/logout`,
    (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authApi.logout()
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                dispatch(clearTasksAndTodolists());
                return { isLoggedIn: false }  // logout (kill cookie)
            } else {
                return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
            }
        })
    },
)

// export const _initializeAppTC = (): AppThunk => (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }));
//     authApi
//         .me()
//         .then((response) => {
//             if (response.data.resultCode === 0) {
//                 // Success
//                 dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//                 dispatch(appActions.setAppInitialized({ isInitialized: true }));
//                 dispatch(appActions.setAppStatus({ status: 'succeeded' }));
//             } else {
//                 dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
//                 handleServerAppError(dispatch, response.data);
//             }
//             dispatch(appActions.setAppInitialized({ isInitialized: true }));
//         })
//         .catch((error) => {
//             handleServerNetworkError(dispatch, error);
//         });
// };

const initializeAppTC = createAppAsyncThunk<LoginState, void>(
    `${authSlice.name}/initializeApp`,
    (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authApi.me()
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                return { isLoggedIn: true }
            } else {
                return rejectWithValue({error: res.data, type: "appError"} satisfies RejectAppError)
            }
        }).finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        })
    },
)

export type LoginState = {
  isLoggedIn: boolean;
};

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const authThunks = {loginTC, logOutTC, initializeAppTC}
export const {authIsLoggedInSelector} =  authSlice.selectors
export const authPath = authSlice.reducerPath
