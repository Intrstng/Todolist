import React, {useCallback} from 'react';
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {useAppDispatch} from "../../../app/store";
import {addTodoListTC} from "../../../features/Todolists/model/slices";


export const CreateItemForm = () => {
    const dispatch = useAppDispatch();

    const addTodolist = useCallback(
        (newTitle: string) => {
            // // For useReducer():
            // const action = removeTodolistAC(id); // !!!!!!!!!!!
            // dispatchTodolists(action); // we cannot use dispatchTodolists(removeTodolistAC(id)) here
            // dispatchTasks(action); // we cannot use dispatchTodolists((removeTodolistAC(id)) here
            //dispatch(addTodolistAC(newTitle));  // !!!!!!! один dispatch и action
            dispatch(addTodoListTC(newTitle));
        },
        [dispatch],
    ); // we can remove dispatch from deps

    return <AddItemForm addItem={addTodolist} className={'inputForm'} titleBtn={'Add todolist'} label={'Create TODO'} />;
};
