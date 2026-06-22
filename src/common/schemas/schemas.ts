import {z} from "zod/v4"
import {RESULT_CODE} from "@/common/enums/enums.ts";

// CustomThemeMode
export const customThemeModeSchema = z.enum(['dark', 'light']);

// FieldError
export const fieldErrorSchema = z.object({
    error: z.string(),
    field: z.string(),
});

// BaseResponse
export const baseResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: schema,
        resultCode: z.enum(RESULT_CODE),
        messages: z.string().array(),
        fieldsErrors: fieldErrorSchema.array(),
    })

export const defaultResponseSchema = baseResponseSchema(z.object({}))

// RejectAppError
export const rejectAppErrorSchema = z.object({
    error: baseResponseSchema,
    type: z.literal('appError'),
});

// RejectCatchError
export const rejectCatchErrorSchema = z.object({
    error: z.unknown(),
    type: z.literal('catchError'),
});

// RejectActionError
export const rejectActionErrorSchema = z.discriminatedUnion('type', [
    rejectAppErrorSchema,
    rejectCatchErrorSchema,
]);
