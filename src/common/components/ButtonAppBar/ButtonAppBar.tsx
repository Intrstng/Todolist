import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {MenuButton} from '@/common/components';
import {Theme} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useAppSelector} from '@/app/store';
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {authActions, authIsLoggedInSelector, selectLoginName} from "@/features/auth/model/slices/authSlice.ts";

type ButtonAppBarProps = {
  theme: Theme;
  changeModeHandler: () => void;
};

export function ButtonAppBar({ theme, changeModeHandler }: ButtonAppBarProps) {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
  const loginName = useAppSelector(selectLoginName)

  const boxStyles = {
    flexGrow: 1,
    // marginBottom: '40px'
  };

  const iconStyles = {
    mr: 2,
  };

  const typographyStyles = {
    flexGrow: 1,
  };

  // const logOutHandler = useCallback(() => {
  //   dispatch(logOutTC());
  // }, [])

  const logOutHandler = () => {
    dispatch(authActions.logOut());
  };

  return (
    <Box sx={boxStyles}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={iconStyles}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={typographyStyles}>
            TODO
          </Typography>
          <Box>
            <i>{loginName}</i>
            {/*{!isLoggedIn && <MenuButton color='inherit'*/}
            {/*            theme={theme}*/}
            {/*            background={'#0275f8'}>Login</MenuButton>}*/}
            {/*Or use:*/}
            {/*<LogInMUIButton isLoggedIn={isLoggedIn} theme={theme}/>*/}
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
