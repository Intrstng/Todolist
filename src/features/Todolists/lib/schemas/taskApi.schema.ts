import {z} from "zod/v4"
import {TaskPriorities, TaskStatuses} from "@/common/enums/enums.ts";
import {baseResponseSchema} from "@/common/schemas/schemas.ts";

export const taskSchema = z.object({
    description: z.string().nullish(),
    title: z.string(),
    status: z.enum(TaskStatuses),
    priority: z.enum(TaskPriorities),
    startDate: z.coerce.date(),
    deadline: z.coerce.date(),
    id: z.string(),
    todoListId: z.string(),
    order: z.number(),
    addedDate: z.coerce.date(),
});

export const responseGetTasksSchema = z.object({
    items: z.array(taskSchema),
    totalCount: z.number().optional(),
    error: z.string().nullish(),
});

export const updateTaskTypeSchema = z.object({
    title: z.string().optional(),
    description: z.string().nullish(),
    status: z.enum(TaskStatuses).optional(),
    priority: z.enum(TaskPriorities).optional(),
    startDate: z.coerce.date().optional(),
    deadline: z.coerce.date().optional(),
});

export const taskDomainSchema = taskSchema.extend({
    entityStatus: z.string(), // replace with StatusSchema if Status is an enum
});

export const addTaskArgSchema = z.object({
    todolistID: z.string(),
    title: z.string(),
});

export const updateTaskArgSchema = z.object({
    todolistID: z.string(),
    taskID: z.string(),
    model: updateTaskTypeSchema,
});

export const deleteTaskArgSchema = z.object({
    todolistID: z.string(),
    taskID: z.string(),
});

export const createTaskResponseSchema = baseResponseSchema(
    z.object({
        item: taskSchema,
    }),
)

export const updateTaskResponseSchema = baseResponseSchema(
    z.object({
        item: taskSchema,
    }),
)