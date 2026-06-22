import {z} from "zod/v4"
import {CustomThemeMode} from "@/common";

export const statusSchema = z.enum(['idle', 'loading', 'succeeded', 'failed']);

export const appInitialStateSchema = z.object({
    status: statusSchema,
    error: z.string().nullable(),
    isInitialized: z.boolean(),
    themeMode: z.custom<CustomThemeMode>(),
});


