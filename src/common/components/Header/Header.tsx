import LinearProgress from "@mui/material/LinearProgress";
import {Theme} from "@mui/material/styles";
import {getTheme} from "@/common/theme/theme";
import {appActions, statusSelector, themeModeSelector} from "@/app/slices/appSlice";
import {ButtonAppBar} from "@/common/components";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {Status} from "@/app/slices/appSlice.types.ts";
import {linearProgressStyles} from "@/common/components/Header/Header.styles.ts";

export const Header = () => {
    const dispatch = useAppDispatch()
    const themeMode = useAppSelector(themeModeSelector)
    const appStatus = useAppSelector<Status>(statusSelector)
    const customThemeMode = useAppSelector(themeModeSelector)
    const theme: Theme = getTheme(themeMode)

    const changeModeHandler = () => {
        dispatch(appActions.changeThemeMode({theme: customThemeMode === 'light' ? 'dark' : 'light'}))
    }

    return (
        <>
            <ButtonAppBar theme={theme} changeModeHandler={changeModeHandler}/>
            {appStatus === 'loading' && <LinearProgress color={'success'} sx={linearProgressStyles}/>}
        </>
)};
