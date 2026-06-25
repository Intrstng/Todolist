import {z} from "zod/v4"
import {
  addTodolistSchema,
  createTodolistResponseSchema,
  dataTypeSchema,
  deleteTodolistSchema, filterValuesSchema,
  getTodolistsResponseSchema, todolistDomainSchema, todolistSchema,
  updateTodolistSchema
} from "@/features/Todolists/lib/schemas/todolistApi.schema.ts";

// Generic for response
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};

export type GetTodolistsResponse = z.infer<typeof getTodolistsResponseSchema>;
export type CreateTodolistResponse = z.infer<typeof createTodolistResponseSchema>
export type UpdateTodolistArg = z.infer<typeof updateTodolistSchema>;
export type AddTodolistArg = z.infer<typeof addTodolistSchema>;
export type DeleteTodolistArg = z.infer<typeof deleteTodolistSchema>;
export type DataType = z.infer<typeof dataTypeSchema>;

export type FilterValuesType = z.infer<typeof filterValuesSchema>;
export type TodolistType = z.infer<typeof todolistSchema>;
export type TodolistDomainType = z.infer<typeof todolistDomainSchema>;
