import React from "react";

export type StyleObject = {
    [key: string]: string | number | undefined;
};

export type ButtonProps = {
    onClickCallBack: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'text' | 'contained' | 'outlined';
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    size?: 'small' | 'medium' | 'large';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    style?: React.CSSProperties;
    children: React.ReactNode;
};