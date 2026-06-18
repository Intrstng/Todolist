import {FC, useCallback, useMemo} from 'react';
import S from "../Todolist.module.css";
import {EditableSpan} from "@/common/components";
import {TodolistDomainType, todolistsThunks} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

type TodolistTitleProps = {
    todolist: TodolistDomainType;
};

export const TodolistTitle: FC<TodolistTitleProps> = ({todolist}) => {
    const dispatch = useAppDispatch();

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
            dispatch(todolistsThunks.changeTodoListTitleTC({id: todolist.id, title: newTitle}));
        },
        [dispatch, todolist.id],
    );

    return (
        <h2 className={S.todolist__title}>
            <EditableSpan
                oldTitle={todolist.title}
                style={inputFieldStyle}
                onBlurCallBack={updateTodolist}
                disabled={todolist.entityStatus === 'loading'}
            />
        </h2>
    );
};
