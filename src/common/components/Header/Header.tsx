import LinearProgress from "@mui/material/LinearProgress";
import {Theme} from "@mui/material/styles";
import {getTheme} from "@/common/theme/theme";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {appActions, initializeAppTC, Status, statusSelector, themeModeSelector} from "@/app/slices/appSlice";
import {ButtonAppBar} from "@/common/components";

export const Header = () => {
    const dispatch = useAppDispatch()
    const themeMode = useAppSelector(themeModeSelector)
    const appStatus = useAppSelector<Status>(statusSelector)
    const customThemeMode = useAppSelector(themeModeSelector)
    const theme: Theme = getTheme(themeMode)

    const changeModeHandler = () => {
        dispatch(appActions.changeThemeMode({theme: customThemeMode === 'light' ? 'dark' : 'light'}))
        dispatch(initializeAppTC())
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
