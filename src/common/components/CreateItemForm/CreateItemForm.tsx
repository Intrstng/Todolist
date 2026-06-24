import {AddItemForm} from "@/common/components";
import {useAddTodolistMutation} from "@/features/Todolists/api/todolistApi.ts";

export const CreateItemForm = () => {
    const [addTodolist] = useAddTodolistMutation()

    const addTodolistHandler = (newTitle: string) => {
        addTodolist({title: newTitle})
    }

    return <AddItemForm addItem={addTodolistHandler} className={'inputForm'} titleBtn={'Add todolist'} label={'Create TODO'} />;
};
