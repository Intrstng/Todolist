import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react"
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {appActions} from "@/app/slices/appSlice.ts";
import { isErrorWithMessage } from "./isErrorWithMessage"

export const handleError = (
    api: BaseQueryApi,
    result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
    let error = "Some error occurred"

    if (result.error) {
        switch (result.error.status) {
            case "FETCH_ERROR":
            case "PARSING_ERROR":
            case "CUSTOM_ERROR":
                error = result.error.error
                break
            case 403:
                error = "403 Forbidden Error. Check API-KEY"
                break
            case 400:
                if (isErrorWithMessage(result.error.data)) {
                    error = result.error.data.message
                } else {
                    error = JSON.stringify(result.error.data)
                }
                break
            default:
                if (Number(result.error.status) >= 500 && Number(result.error.status) < 600) {
                    error = "Server error occurred. Please try again later."
                } else {
                    error = JSON.stringify(result.error)
                }
                break
        }
        api.dispatch(appActions.setAppError({ error }))
    }

    if ((result.data as { resultCode: RESULT_CODE })?.resultCode === RESULT_CODE.INVALID) {
        const messages = (result.data as { messages: string[] }).messages
        error = messages.length ? messages[0] : error
        api.dispatch(appActions.setAppError({ error }))
    }
}
