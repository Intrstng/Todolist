import axios from 'axios';
import {appActions} from '@/app/slices/appSlice';
import {BaseResponse} from "@/common";
import {Dispatch} from "@reduxjs/toolkit";

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: 'Some error occurred' }));
  }
  dispatch(appActions.setAppStatus({ status: 'failed' }));
};

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(appActions.setAppStatus({ status: 'failed' }));
  dispatch(appActions.setAppError({ error: errorMessage }));
};
