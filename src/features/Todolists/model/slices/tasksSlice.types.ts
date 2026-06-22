import {TaskDomainType} from "@/features/Todolists/api/taskApi.types.ts";

export type TasksType = {
    [key: string]: TaskDomainType[];
};