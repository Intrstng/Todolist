import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppRootState} from "@/app/store.ts";

export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;