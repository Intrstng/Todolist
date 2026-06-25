import {z} from "zod/v4"
import {TaskPriorities, TaskStatuses} from "@/common/enums/enums.ts";
import {baseResponseSchema} from "@/common/schemas/schemas.ts";

export const taskSchema = z.object({
    description: z.string().nullish(),
    title: z.string(),
    status: z.enum(TaskStatuses),
    priority: z.enum(TaskPriorities),
    startDate: z.iso.datetime({ local: true }).nullish(),
    deadline: z.iso.datetime({ local: true }).nullish(),
    id: z.string(),
    todoListId: z.string(),
    order: z.number(),
    addedDate: z.iso.datetime({ local: true }).nullish(),
});

export const updateTaskTypeSchema = z.object({
    title: z.string().optional(),
    description: z.string().nullish(),
    status: z.enum(TaskStatuses).optional(),
    priority: z.enum(TaskPriorities).optional(),
    startDate: z.iso.datetime({ local: true }).nullish(),
    deadline: z.iso.datetime({ local: true }).nullish(),
});

export const StatusSchema = z.enum(['idle', 'loading', 'succeeded', 'failed']);

export const taskDomainSchema = taskSchema.extend({
    entityStatus: StatusSchema.optional(),
});

export const responseGetTasksSchema = z.object({
    items: z.array(taskDomainSchema),
    totalCount: z.number().optional(),
    error: z.string().nullish(),
});

export const GetTasksRequestArgsSchema = z.object({
    todolistID: z.string(),
    params: z.object({
        count: z.number().int().positive().optional(),
        page: z.number().int().positive().optional()
    })
})

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