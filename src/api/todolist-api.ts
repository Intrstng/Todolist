import axios from 'axios';
import { TodolistType } from 'features/Todolists/slices';

export const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': '49c04d35-d285-4efe-9548-92691308d757',
  },
};

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  ...settings,
});

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



