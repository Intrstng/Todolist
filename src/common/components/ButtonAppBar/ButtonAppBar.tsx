import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {MenuButton} from '@/common/components';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {ButtonAppBarProps} from "@/common/components/ButtonAppBar/ButtonAppBar.types.ts";
import {useLogoutMutation} from "@/features/auth/api/authApi.ts";
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {appActions, authIsLoggedInSelector} from "@/app/slices/appSlice.ts";
import {AUTH_TOKEN} from "@/common/constants";
import {baseApi} from "@/app/baseApi.ts";

export function ButtonAppBar({ theme, changeModeHandler }: ButtonAppBarProps) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
  const [logout] = useLogoutMutation()

  const boxStyles = {
    flexGrow: 1,
  };

  const iconStyles = {
    mr: 2,
  };

  const typographyStyles = {
    flexGrow: 1,
  };

  const logOutHandler = () => {
    // // Variant 1 - Clear all state
    logout().unwrap().then((data) => {
      if (data.resultCode === RESULT_CODE.SUCCEDED) {
        dispatch(appActions.setIsLoggedIn({ isLoggedIn: false }))
        localStorage.removeItem(AUTH_TOKEN)
        dispatch(baseApi.util.resetApiState())
      }
    })

    // Variant 2 - Clear all cash for 'Todolist', 'Task'
    // logout()
    //     .then(res => {
    //       if (res.data?.resultCode === RESULT_CODE.SUCCEDED) {
    //         dispatch(appActions.setIsLoggedIn({ isLoggedIn: false }))
    //         localStorage.removeItem(AUTH_TOKEN)
    //       }
    //     })
    //     .then(() => {
    //       dispatch(baseApi.util.invalidateTags(['Todolist', 'Task']))
    //     })
  };

  return (
    <Box sx={boxStyles}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={iconStyles}>
            <FormatListNumberedIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={typographyStyles}>
            TODO
          </Typography>
          <Box>
            {isLoggedIn &&<MenuButton color="inherit" onClick={logOutHandler} disabled={!isLoggedIn}>
              Logout
            </MenuButton>}
            <MenuButton color="inherit" customtheme={theme} background={theme.palette.primary.dark}>
              Faq
            </MenuButton>
            {/*Day & night*/}
            <IconButton sx={{ ml: 1 }} onClick={changeModeHandler} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// const LogInMUIButton: FC<LogInMUIButtonProps> = ({ isLoggedIn, theme }) => {
//   const [navigateToLogin, setNavigateToLogin] = useState(false);
//   const handleLoginClick = () => setNavigateToLogin(true);
//   return (
//     <>
//       {navigateToLogin && <Navigate to="/login" />}
//       {!isLoggedIn && (
//         <MenuButton color="inherit" theme={theme} background="#0275f8" onClick={handleLoginClick}>
//           Login
//         </MenuButton>
//       )}
//     </>
//   );
// };

// type LogInMUIButtonProps = {
//   isLoggedIn: boolean;
//   theme: Theme;
// };
