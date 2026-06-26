import {ChangeEvent, memo, useState} from 'react';
import {EditableSpanType} from "@/common/components/EditableSpan/EditableSpan.types.ts";
import TextField from '@mui/material/TextField';

export const EditableSpan = memo(
  ({ oldTitle, style, onBlurCallBack, size, className, disabled = false }: EditableSpanType) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>(oldTitle);
    const activateEdit = () => {
      if (newTitle) {
        setEdit(!edit);
        onBlurCallBack(newTitle);
      }
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.currentTarget.value);
    };

    const spanStyle = {
      overflow: 'hidden',
    };

    return !disabled && edit ? (
      <TextField
        id="standard-search"
        type="search"
        variant="standard"
        error={!newTitle.length}
        className={className}
        style={style}
        value={newTitle}
        onChange={onChangeHandler}
        onBlur={activateEdit}
        placeholder={!newTitle ? 'Enter title...' : ''}
        size={size || 'small'}
        autoFocus
        color={'info'}
        disabled={disabled}
      />
    ) : (
      <div style={style}>
        <span style={spanStyle} onDoubleClick={activateEdit}>
          {oldTitle}
        </span>
      </div>
    );
  },
);
