import {FC, useCallback} from 'react';
import {useAppDispatch} from "@/app/store";
import { AddItemForm } from "@/common/components";
import {addTaskTC, TodolistDomainType} from "@/features/Todolists/model/slices";

type CreateTaskItemFormProps = {
    todolist: TodolistDomainType;
    toggleTaskListCollapsed: () => void;
}

export const CreateTaskItemForm: FC<CreateTaskItemFormProps> = ({ todolist, toggleTaskListCollapsed}) => {
    const dispatch = useAppDispatch();

    const addTask = useCallback(
        (title: string) => {
            dispatch(addTaskTC(todolist.id, title));
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
