import { createTheme, Theme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import {CustomThemeMode} from "../../app/App";

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