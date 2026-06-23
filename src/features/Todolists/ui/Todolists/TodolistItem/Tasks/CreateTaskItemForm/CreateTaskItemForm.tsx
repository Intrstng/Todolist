import {FC} from 'react';
import {AddItemForm} from "@/common/components";
import {useCreateTaskMutation} from "@/features/Todolists/api/_taskApi.ts";
import {TodolistDomainType} from "@/features/Todolists/model/slices/todoListsSlice.types.ts";

type CreateTaskItemFormProps = {
    todolist: TodolistDomainType;
    toggleTaskListCollapsed: () => void;
}

export const CreateTaskItemForm: FC<CreateTaskItemFormProps> = ({ todolist, toggleTaskListCollapsed}) => {
    // const dispatch = useAppDispatch();
    const [createTask] = useCreateTaskMutation()

    const addTask = (title: string) => {
        // dispatch(tasksActions.addTask({todolistID: todolist.id, title}));
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
