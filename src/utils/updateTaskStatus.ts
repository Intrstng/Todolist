import {AppDispatch} from "@/app/store.ts";
import {tasksApi} from "@/features/Todolists/api/_taskApi.ts";
import {EntityStatus} from "@/features/Todolists/api/taskApi.types.ts";

export const updateTaskStatus = (
    dispatch: AppDispatch,
    todolistID: string,
    taskID: string,
    status: EntityStatus
) => {
    dispatch(
        tasksApi.util.updateQueryData('getTasks', todolistID, (state) => {
            const task = state.items.find((t) => t.id === taskID);
            if (task) {
                task.entityStatus = status;
            }
        })
    );
};