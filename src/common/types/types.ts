import {z} from "zod/v4"
import {
    customThemeModeSchema,
    defaultResponseSchema,
    fieldErrorSchema,
    rejectActionErrorSchema,
    rejectAppErrorSchema,
    rejectCatchErrorSchema
} from "@/common/schemas/schemas.ts";


export type BaseResponse = z.infer<typeof defaultResponseSchema>

export type CustomThemeMode = z.infer<typeof customThemeModeSchema>;
export type FieldError = z.infer<typeof fieldErrorSchema>;
export type ActionForTests<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">
export type RejectAppError = z.infer<typeof rejectAppErrorSchema>;
export type RejectCatchError = z.infer<typeof rejectCatchErrorSchema>;
export type RejectActionError = z.infer<typeof rejectActionErrorSchema>;