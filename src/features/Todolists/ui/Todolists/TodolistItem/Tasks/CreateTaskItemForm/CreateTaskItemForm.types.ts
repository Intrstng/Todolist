import {TodolistDomainType} from "@/features/Todolists/lib/types";

export type CreateTaskItemFormProps = {
    todolist: TodolistDomainType;
    toggleTaskListCollapsed: () => void;
}