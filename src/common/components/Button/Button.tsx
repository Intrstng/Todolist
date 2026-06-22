import {memo} from 'react';
import {Button as MuiButton} from '@mui/material';
import {ButtonProps} from "@/common/components/Button/Button.types.ts";

export const Button = memo(({ onClickCallBack, variant, color, children, ...rest }: ButtonProps) => {
  const onClickHandler = () => onClickCallBack();
  return (
    <MuiButton onClick={onClickHandler} variant={variant} color={color || 'primary'} {...rest}>
      {children}
    </MuiButton>
  );
});
