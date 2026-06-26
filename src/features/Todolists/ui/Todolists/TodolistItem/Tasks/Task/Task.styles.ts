import { SxProps } from "@mui/material"

export const inputFieldStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    maxWidth: '135px',
    maxHeight: '30px',
    minWidth: '135px',
    minHeight: '30px',
} as const;

export const deleteTaskBtnStyle = {
    maxWidth: '94px',
    maxHeight: '40px',
    minWidth: '94px',
    minHeight: '40px',
} as const;

export const getListItemSx = (isDone: boolean): SxProps => ({
    p: 0,
    justifyContent: 'space-between',
    opacity: isDone ? 0.8 : 1,
})