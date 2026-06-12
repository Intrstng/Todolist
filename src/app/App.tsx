import React, {useEffect} from 'react'
import './App.css'
import {Grid} from '@mui/material'
import Container from '@mui/material/Container'
import {Theme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {useAppDispatch, useAppSelector} from './store'
import LinearProgress from '@mui/material/LinearProgress'
import {ButtonAppBar, ErrorSnackbar} from '../components'
import {isInitializedSelector, statusSelector, themeModeSelector} from './selectors/appSelectors'
import {appActions, initializeAppTC, Status} from 'app/slices/appSlice'
import {Outlet} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import {getTheme} from "common/theme/theme";

const App = () => {
  const dispatch = useAppDispatch()
  const appStatus = useAppSelector<Status>(statusSelector)
  const isInitialized = useAppSelector<boolean>(isInitializedSelector)
  const customThemeMode = useAppSelector(themeModeSelector)
  const themeMode = useAppSelector(themeModeSelector)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  if (!isInitialized) {
    return (
      <div className='loaderContainer'>
        <CircularProgress color='secondary' />
      </div>
    )
  }

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
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/*CssBaseline is used for Day & Night toggling*/}
      <div className='App'>
        <ButtonAppBar theme={theme} changeModeHandler={changeModeHandler} />
        {appStatus === 'loading' && <LinearProgress color={'success'} sx={linearProgressStyles} />}
        <ErrorSnackbar />
        <Container maxWidth='xl' fixed sx={{ marginTop: '40px' }}>
          <Grid container spacing={2}>
            <Outlet />
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
