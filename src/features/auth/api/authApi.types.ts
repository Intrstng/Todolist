import {z} from "zod/v4"
import {
    authLoginResponseSchema, authMeResponseSchema,
    loginParamsSchema,
    loginResponseSchema,
    meDataResponseSchema
} from "@/features/auth/lib/schemas/auth.schema.ts";

export type LoginParamsType = z.infer<typeof loginParamsSchema>;
export type AuthMeDataResponse = z.infer<typeof meDataResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AuthMeResponse = z.infer<typeof authMeResponseSchema>;
