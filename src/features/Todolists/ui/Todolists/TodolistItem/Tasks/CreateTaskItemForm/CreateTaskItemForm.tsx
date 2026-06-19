import {FC, useCallback} from 'react';
import {AddItemForm} from "@/common/components";
import {tasksActions, TodolistDomainType} from "@/features/Todolists/model/slices";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

type CreateTaskItemFormProps = {
    todolist: TodolistDomainType;
    toggleTaskListCollapsed: () => void;
}

export const CreateTaskItemForm: FC<CreateTaskItemFormProps> = ({ todolist, toggleTaskListCollapsed}) => {
    const dispatch = useAppDispatch();

    const addTask = useCallback(
        (title: string) => {
            dispatch(tasksActions.addTask({todolistID: todolist.id, title}));
            toggleTaskListCollapsed();
        },
        [dispatch, toggleTaskListCollapsed, todolist.id],
    );

    return (
        <AddItemForm
            className={'taskForm'}
            addItem={addTask}
            titleBtn={'Add task'}
            label={'Create task'}
            disabled={todolist.entityStatus === 'loading'}
        />
    );
};
