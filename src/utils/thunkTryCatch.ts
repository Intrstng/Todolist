import {RejectCatchError} from "@/common";

export const thunkTryCatch = async <T>(
    // thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponse>,
    thunkAPI: any,
    logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { rejectWithValue } = thunkAPI
    try {
        return await logic()
    } catch (e) {
        return rejectWithValue({
            error: e,
            type: "catchError"
        } satisfies RejectCatchError)
    }
}