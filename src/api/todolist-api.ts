import axios from 'axios';
import { instance } from "common";
import { TodolistType } from 'features/Todolists/slices';

export const todolistApi = {
  getTodolists() {
    return instance.get<TodolistType[]>('/todo-lists');
  },
  createTodolist(data: DataType) {
    return instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists', data);
  },
  updateTodolistTitle(todoID: string, data: DataType) {
    return instance.put<ResponseType>(`/todo-lists/${todoID}`, data);
  },
  deleteTodolist(todoID: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todoID}`);
  },
};

// TYPES
// Generic for response
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};

export type DataType = {
  title: string;
};



