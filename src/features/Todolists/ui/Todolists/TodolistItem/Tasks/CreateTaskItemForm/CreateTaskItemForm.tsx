import {AddItemForm} from "@/common/components";
import {useCreateTaskMutation} from "@/features/Todolists/api/taskApi.ts";
import {TodolistDomainType} from "@/features/Todolists/lib/types";

type CreateTaskItemFormProps = {
    todolist: TodolistDomainType;
    toggleTaskListCollapsed: () => void;
}

export const CreateTaskItemForm = ({ todolist, toggleTaskListCollapsed}: CreateTaskItemFormProps) => {
    const [createTask] = useCreateTaskMutation()

    const addTask = (title: string) => {
        createTask({data: {todolistID: todolist.id, title}})
        toggleTaskListCollapsed();
    }

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
