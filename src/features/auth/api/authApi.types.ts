import {z} from "zod/v4"
import {
    AuthLoginResponseSchema, AuthMeResponseSchema,
    LoginParamsSchema,
    LoginResponseSchema,
    MeDataResponseSchema
} from "@/features/auth/lib/schemas/auth.schema.ts";

export type LoginParamsType = z.infer<typeof LoginParamsSchema>;
export type AuthMeDataResponse = z.infer<typeof MeDataResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;
export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;
