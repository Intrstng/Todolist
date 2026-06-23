import {useCallback, useMemo} from 'react';
import s from "../Todolist.module.css";
import {EditableSpan} from "@/common/components";
import {useChangeTodolistTitleMutation} from "@/features/Todolists/api/_todolistApi.ts";
import {TodolistDomainType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";

type TodolistTitleProps = {
    todolist: TodolistDomainType;
};

export const TodolistTitle = ({todolist}: TodolistTitleProps) => {
    // const dispatch = useAppDispatch();
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
            // dispatch(todoListsActions.changeTodoListTitle({id: todolist.id, title: newTitle}));
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
