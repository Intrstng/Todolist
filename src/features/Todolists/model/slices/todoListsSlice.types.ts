import {z} from "zod/v4"
import {
    filterValuesSchema,
    todolistDomainSchema,
    todolistSchema
} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

export type FilterValuesType = z.infer<typeof filterValuesSchema>;
export type TodolistType = z.infer<typeof todolistSchema>;
export type TodolistDomainType = z.infer<typeof todolistDomainSchema>;
