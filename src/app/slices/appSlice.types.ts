import {CustomThemeMode} from "@/common";

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type AppInitialState = {
    status: Status;
    error: string | null;
    isInitialized: boolean;
    themeMode: CustomThemeMode;
};