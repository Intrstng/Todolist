import {BaseResponse, instance} from "@/common";
import {CreateTodolistResponse, DataType, GetTodolistsResponse} from "@/features/Todolists/api/todolistApi.types.ts";

export const todolistApi = {
  getTodolists() {
    return instance.get<GetTodolistsResponse>('/todo-lists');
  },
  createTodolist(data: DataType) {
    // return instance.post<BaseResponse<{ item: TodolistType }>>('/todo-lists', data);
    return instance.post<CreateTodolistResponse>('/todo-lists', data);
  },
  updateTodolist(todoID: string, data: DataType) {
    return instance.put<BaseResponse>(`/todo-lists/${todoID}`, data);
  },
  deleteTodolist(todoID: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todoID}`);
  },
};
