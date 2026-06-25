import {TaskDomainType, TodolistDomainType} from "@/features/Todolists/lib/types";

export type TaskProps = {
    todolist: TodolistDomainType;
    task: TaskDomainType;
    sortIndex: number;
};