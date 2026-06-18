import {Status} from "@/app/slices/appSlice.types.ts";
import {UpdateTaskDomainModelType} from "@/features/Todolists/model/slices";

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: Date;
    deadline: Date;
    id: string;
    todoListId: string;
    order: number;
    addedDate: Date;
};
export type TaskDomainType = TaskType & {
    entityStatus: Status;
};

export type AddTaskArg = {
    todolistID: string;
    title: string;
};

export type UpdateTaskArg = {
    todolistID: string
    taskID: string
    model: UpdateTaskDomainModelType
};

export type DeleteTaskArg = {
    todolistID: string
    taskID: string
};

export type UpdateTaskType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: Date;
    deadline: Date;
};

export type ResponseGetTasksType = {
    items: TaskType[];
    totalCount?: number;
    error?: string | null;
};
