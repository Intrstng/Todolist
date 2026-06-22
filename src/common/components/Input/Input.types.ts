import {ChangeEvent, FocusEvent, KeyboardEvent} from "react";
import {StyleObject} from "@/common/components/Button/Button.types.ts";

export type InputProps = {
    value: string;
    label?: string;
    className?: string;
    onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDownCallback: (e: KeyboardEvent<HTMLInputElement>) => void;
    onBlurCallback?: (e: FocusEvent<HTMLInputElement, Element>) => void;
    style?: StyleObject;
    size?: 'small' | 'medium';
    error: boolean;
    disabled: boolean;
};