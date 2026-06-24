import { AppDispatch } from "@/app/store";
import {todolistsApi} from "@/features/Todolists/api/todolistApi.ts";
import {EntityStatus} from "@/features/Todolists/api/taskApi.types.ts";

export const updateTodoListEntityStatus = (
    dispatch: AppDispatch,
   todolistID: string,
   status: EntityStatus
) => {
    dispatch(
        todolistsApi.util.updateQueryData('getTodolists', undefined, (state) => {
            const todolist = state.find((tl) => tl.id === todolistID);
            if (todolist) {
                todolist.entityStatus = status;
            }
        })
    );
};
