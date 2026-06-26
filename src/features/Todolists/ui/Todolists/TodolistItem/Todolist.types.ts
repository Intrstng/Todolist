import { TodolistDomainType } from "@/features/Todolists/lib/types";

export type TodolistProps = {
    todolist: TodolistDomainType;
    sortIndex: number;
};