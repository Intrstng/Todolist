import {z} from "zod/v4"
import {appInitialStateSchema, statusSchema} from "@/app/lib/schemas/appSchema.ts";

export type AppInitialState = z.infer<typeof appInitialStateSchema>;
export type Status = z.infer<typeof statusSchema>;