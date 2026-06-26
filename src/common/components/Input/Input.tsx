import { ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { InputProps } from "./Input.types";
import TextField from '@mui/material/TextField';

export const Input = (props: InputProps) => {
  const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => props.onChangeCallback(e);
  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => props.onKeyDownCallback(e);
  const onBlurHandler = (e: FocusEvent<HTMLInputElement, Element>) => props.onBlurCallback && props.onBlurCallback(e);
  return (
    <TextField
      id="outlined-search"
      label={props.label}
      type="search"
      value={props.value}
      onChange={onChangeInputHandler}
      onKeyDown={onKeyDownHandler}
      onBlur={onBlurHandler}
      className={props.className}
      style={props.style}
      size={props.size || 'small'}
      error={props.error}
      disabled={props.disabled}
    />
  );
};
