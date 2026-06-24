import {useCallback, useMemo} from 'react';
import s from "../Todolist.module.css";
import {EditableSpan} from "@/common/components";
import {useChangeTodolistTitleMutation} from "@/features/Todolists/api/todolistApi.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

type TodolistTitleProps = {
    todolist: TodolistDomainType;
};

export const TodolistTitle = ({todolist}: TodolistTitleProps) => {
    const [changeTodolistTitle] = useChangeTodolistTitleMutation()

    const inputFieldStyle = useMemo(
        () => ({
            maxWidth: '220px',
            maxHeight: '30px',
            minWidth: '220px',
            minHeight: '30px',
            overflow: 'hidden',
        }),
        [],
    );

    const updateTodolist = useCallback(
        (newTitle: string) => {
            changeTodolistTitle({ id: todolist.id, data: { title: newTitle } })
        },
        [todolist.id],
    );

    return (
        <h2 className={s.todolist__title}>
            <EditableSpan
                oldTitle={todolist.title}
                style={inputFieldStyle}
                onBlurCallBack={updateTodolist}
                disabled={todolist.entityStatus === 'loading'}
            />
        </h2>
    );
};
