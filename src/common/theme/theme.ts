import {createTheme} from '@mui/material/styles'
import {CustomThemeMode} from "@/common";

export const getTheme = (themeMode: CustomThemeMode) => {
    return createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: '#087EA4',
            },
        },
    })
}