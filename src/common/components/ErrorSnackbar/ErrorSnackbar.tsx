import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppSelector } from '@/app/store';
import {appActions, errorSelector} from '@/app/slices/appSlice';
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

export const ErrorSnackbar = () => {
  const error = useAppSelector<string | null>(errorSelector);
  const dispatch = useAppDispatch();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(appActions.setAppError({ error: null }));
  };
  return (
    <div>
      <Snackbar open={error !== null} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
