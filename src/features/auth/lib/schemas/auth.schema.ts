import {z} from "zod/v4"
import {baseResponseSchema} from "@/common/schemas/schemas.ts";

export const loginParamsSchema = z.object({
    email: z.email(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
    captcha: z.string().optional(),
});

export const meDataResponseSchema = z.object({
    id: z.number().optional(),
    email: z.email().optional(),
    login: z.string().optional(),
});

export const loginResponseSchema = z.object({
    userId: z.number(),
    token: z.string(),
});

export const authLoginResponseSchema = baseResponseSchema(
    loginResponseSchema
)

export const authMeResponseSchema = baseResponseSchema(
    meDataResponseSchema
)