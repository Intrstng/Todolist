import {memo} from 'react';
import {ButtonProps} from "@/common/components/Button/Button.types.ts";
import {Button as MuiButton} from '@mui/material';

export const Button = memo(({ onClickCallBack, variant, color, children, ...rest }: ButtonProps) => {
  const onClickHandler = () => onClickCallBack();
  return (
    <MuiButton onClick={onClickHandler} variant={variant} color={color || 'primary'} {...rest}>
      {children}
    </MuiButton>
  );
});
