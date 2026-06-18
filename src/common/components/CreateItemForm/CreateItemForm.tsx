import {useCallback} from 'react';
import {todolistsThunks} from "@/features/Todolists/model/slices";
import {AddItemForm} from "@/common/components";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

export const CreateItemForm = () => {
    const dispatch = useAppDispatch();

    const addTodolist = useCallback(
        (newTitle: string) => {
            // // For useReducer():
            // const action = removeTodolistAC(id); // !!!!!!!!!!!
            // dispatchTodolists(action); // we cannot use dispatchTodolists(removeTodolistAC(id)) here
            // dispatchTasks(action); // we cannot use dispatchTodolists((removeTodolistAC(id)) here
            //dispatch(addTodolistAC(newTitle));  // !!!!!!! один dispatch и action
            dispatch(todolistsThunks.addTodoListTC({title: newTitle}));
        },
        [dispatch],
    ); // we can remove dispatch from deps

    return <AddItemForm addItem={addTodolist} className={'inputForm'} titleBtn={'Add todolist'} label={'Create TODO'} />;
};
