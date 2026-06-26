import {AddItemForm} from "@/common/components";
import {useCreateTaskMutation} from "@/features/Todolists/api/taskApi.ts";
import {
    CreateTaskItemFormProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/CreateTaskItemForm/CreateTaskItemForm.types.ts";

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
