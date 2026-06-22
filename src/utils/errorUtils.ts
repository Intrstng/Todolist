import {z} from "zod/v4"
import axios from 'axios';
import {appActions} from '@/app/slices/appSlice';
import {FieldError} from "@/common";
import {Dispatch} from "@reduxjs/toolkit";

export const handleServerAppError = <D>(data: BaseResponseError<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: 'Some error occurred' }));
  }
  dispatch(appActions.setAppStatus({ status: 'failed' }));
};

// export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
//   let errorMessage
//
//   if (axios.isAxiosError(error)) {
//     errorMessage = error.response?.data?.message || error.message
//   } else if (error instanceof Error) {
//     errorMessage = `Native error: ${error.message}`
//   } else {
//     errorMessage = JSON.stringify(error)
//   }
//
//   dispatch(appActions.setAppStatus({ status: 'failed' }));
//   dispatch(appActions.setAppError({ error: errorMessage }));
// };

// With Zod error handling, you can also use handleServerNetworkError without Zod error handling
export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof z.ZodError) {
    console.table(error.issues)
    errorMessage = `Zod Error - see console`
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(appActions.setAppStatus({ status: 'failed' }));
  dispatch(appActions.setAppError({ error: errorMessage }));
};

type BaseResponseError<D = {}> = {
  resultCode: number
  messages: string[]
  data: D
  fieldsErrors: FieldError[]
}