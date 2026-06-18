import {BaseResponse, instance} from "@/common";
import {TodolistType} from '@/features/Todolists/model/slices';
import {DataType} from "@/features/Todolists/api/todolistsApi.types.ts";

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>('/todo-lists');
  },
  createTodolist(data: DataType) {
    return instance.post<BaseResponse<{ item: TodolistType }>>('/todo-lists', data);
  },
  updateTodolist(todoID: string, data: DataType) {
    return instance.put<BaseResponse>(`/todo-lists/${todoID}`, data);
  },
  deleteTodolist(todoID: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todoID}`);
  },
};
