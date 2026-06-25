import {useEffect} from 'react'
import './App.css'
import {Theme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {appActions, isInitializedSelector, themeModeSelector} from '@/app/slices/appSlice'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import {getTheme} from "@/common/theme/theme";
import {Header} from "@/common/components/Header/Header";
import {ErrorSnackbar} from "@/common/components";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {useMeQuery} from "@/features/auth/api/authApi.ts";
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {Routing} from "@/common/routing";
import Box from "@material-ui/core/Box"

const App = () => {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector<boolean>(isInitializedSelector)
  const themeMode = useAppSelector(themeModeSelector)
  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (isLoading) return
    if (data?.resultCode === RESULT_CODE.SUCCEDED) {
      dispatch(appActions.setIsLoggedIn({ isLoggedIn: true }))
    }
    dispatch(appActions.setAppInitialized({ isInitialized: true }))
  }, [isLoading])

  if (!isInitialized) {
    return (
      <Box className='loaderContainer'>
        <CircularProgress color='secondary' />
      </Box>
    )
  }

  const theme: Theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <Box className='App'>
        <CssBaseline /> {/*CssBaseline is used for Day & Night toggling*/}
        <Header/>
        <ErrorSnackbar />
        <Routing/>
      </Box>
    </ThemeProvider>
  )
}

export default App
