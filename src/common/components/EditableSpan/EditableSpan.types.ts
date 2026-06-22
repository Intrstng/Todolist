import {StyleObject} from "@/common/components/Button/Button.types.ts";

export type EditableSpanType = {
    oldTitle: string;
    style?: StyleObject;
    onBlurCallBack: (value: string) => void;
    size?: 'small' | 'medium';
    className?: string;
    disabled?: boolean;
};