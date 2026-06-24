import LinearProgress from "@mui/material/LinearProgress";
import {Theme} from "@mui/material/styles";
import {getTheme} from "@/common/theme/theme";
import {useAppSelector} from "@/app/store";
import {appActions, statusSelector, themeModeSelector} from "@/app/slices/appSlice";
import {ButtonAppBar} from "@/common/components";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {Status} from "@/app/slices/appSlice.types.ts";

export const Header = () => {
    const dispatch = useAppDispatch()
    const themeMode = useAppSelector(themeModeSelector)
    const appStatus = useAppSelector<Status>(statusSelector)
    const customThemeMode = useAppSelector(themeModeSelector)
    const theme: Theme = getTheme(themeMode)

    const changeModeHandler = () => {
        dispatch(appActions.changeThemeMode({theme: customThemeMode === 'light' ? 'dark' : 'light'}))
    }

    const linearProgressStyles = {
        position: 'absolute',
        top: 64, // fix
        left: 0,
        right: 0,
        zIndex: 5
    }

    return (
        <>
            <ButtonAppBar theme={theme} changeModeHandler={changeModeHandler}/>
            {appStatus === 'loading' && <LinearProgress color={'success'} sx={linearProgressStyles}/>}
        </>
)};
