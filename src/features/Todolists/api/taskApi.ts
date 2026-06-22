import {BaseResponse, instance} from "@/common";
import {
  CreateTaskResponse,
  ResponseGetTasksType,
  UpdateTaskResponse,
  UpdateTaskType
} from "@/features/Todolists/api/taskApi.types.ts";

export const taskApi = {
  getAllTasks(todoID: string) {
    return instance.get<ResponseGetTasksType>(`/todo-lists/${todoID}/tasks`);
  },
  createTask(todoID: string, data: { title: string }) {
    // return instance.post<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todoID}/tasks`, data);
    return instance.post<CreateTaskResponse>(`/todo-lists/${todoID}/tasks`, data);
  },
  updateTask(todoID: string, taskID: string, data: UpdateTaskType) {
   // return instance.put<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todoID}/tasks/${taskID}`, data);
    return instance.put<UpdateTaskResponse>(`/todo-lists/${todoID}/tasks/${taskID}`, data);
  },
  deleteTask(todoID: string, taskID: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${todoID}/tasks/${taskID}`);
  },
};
