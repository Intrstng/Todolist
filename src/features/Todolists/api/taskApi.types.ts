import {z} from "zod/v4"
import {
    addTaskArgSchema, createTaskResponseSchema,
    deleteTaskArgSchema,
    responseGetTasksSchema,
    taskDomainSchema,
    taskSchema, updateTaskArgSchema, updateTaskResponseSchema,
    updateTaskTypeSchema
} from "@/features/Todolists/lib/schemas/taskApi.schema.ts";


export type TaskType = z.infer<typeof taskSchema>;
export type ResponseGetTasksType = z.infer<typeof responseGetTasksSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskTypeSchema>;
export type TaskDomainType = z.infer<typeof taskDomainSchema>;
export type AddTaskArg = z.infer<typeof addTaskArgSchema>;
export type DeleteTaskArg = z.infer<typeof deleteTaskArgSchema>;
export type UpdateTaskArg = z.infer<typeof updateTaskArgSchema>;

export type CreateTaskResponse = z.infer<typeof createTaskResponseSchema>
export type UpdateTaskResponse = z.infer<typeof updateTaskResponseSchema>
