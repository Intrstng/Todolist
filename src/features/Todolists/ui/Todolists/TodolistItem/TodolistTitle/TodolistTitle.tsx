import {useCallback} from 'react';
import {EditableSpan} from "@/common/components";
import {useChangeTodolistTitleMutation} from "@/features/Todolists/api/todolistApi.ts";
import {inputFieldStyle} from "@/features/Todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.styles.ts";
import {TodolistTitleProps} from "@/features/Todolists/ui/Todolists/TodolistItem/TodolistTitle/TodolistTitle.types.ts";
import s from "../Todolist.module.css";

export const TodolistTitle = ({todolist}: TodolistTitleProps) => {
    const [changeTodolistTitle] = useChangeTodolistTitleMutation()

    const updateTodolist = useCallback(
        (newTitle: string) => {
            changeTodolistTitle({ id: todolist.id, data: { title: newTitle } })
        },
        [todolist.id],
    );

    return (
        <h2 className={s.todolistTitle}>
            <EditableSpan
                oldTitle={todolist.title}
                style={inputFieldStyle}
                onBlurCallBack={updateTodolist}
                disabled={todolist.entityStatus === 'loading'}
            />
        </h2>
    );
};
