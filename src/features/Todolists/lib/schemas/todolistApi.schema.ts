import {z} from "zod/v4"
import {baseResponseSchema} from "@/common/schemas/schemas.ts";
import {statusSchema} from "@/app/lib/schemas/appSchema.ts";

export const todolistSchema = z.object({
    id: z.string(),
    addedDate: z.iso.datetime({ local: true }),
    order: z.number(),
    title: z.string(),
});

export const updateTodolistSchema = z.object({
    id: z.string(),
    title: z.string(),
});

export const addTodolistSchema = z.object({
    title: z.string(),
});

export const deleteTodolistSchema = z.object({
    id: z.string(),
});

export const dataTypeSchema = z.object({
    title: z.string(),
});

export const filterValuesSchema = z.enum(['all', 'active', 'completed']);

export const todolistDomainSchema = todolistSchema.extend({
    filter: filterValuesSchema,
    entityStatus: statusSchema,
});

export const getTodolistsResponseSchema = z.array(todolistSchema)

export const createTodolistResponseSchema = baseResponseSchema(
    z.object({
       item: todolistSchema,
    }),
)
