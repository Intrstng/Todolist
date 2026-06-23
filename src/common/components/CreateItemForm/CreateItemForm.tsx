import {AddItemForm} from "@/common/components";
import {useAddTodolistMutation} from "@/features/Todolists/api/_todolistApi.ts";

export const CreateItemForm = () => {
    // const dispatch = useAppDispatch();

    // const [addTodolist, { data, isLoading, error }] = useAddTodolistMutation()
    const [addTodolist] = useAddTodolistMutation()

    const addTodolistHandler = (newTitle: string) => {
        // dispatch(todoListsActions.addTodoList({title: newTitle}));
        addTodolist({title: newTitle})
    }

    return <AddItemForm addItem={addTodolistHandler} className={'inputForm'} titleBtn={'Add todolist'} label={'Create TODO'} />;
};
