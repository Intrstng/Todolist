import {TodolistDomainType} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";
import {TaskDomainType} from "@/features/Todolists/lib/types";

export type TaskProps = {
    todolist: TodolistDomainType;
    task: TaskDomainType;
};