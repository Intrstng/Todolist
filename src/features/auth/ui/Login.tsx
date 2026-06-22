// import Grid from '@mui/material/Grid';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import FormLabel from '@mui/material/FormLabel';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { useFormik } from 'formik';
// import S from './Login.module.css';
// import {authActions, authIsLoggedInSelector} from '../model/slices/authSlice';
// import { useAppSelector } from '@/app/store';
// import { Navigate } from 'react-router-dom';
// import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
// import {LoginParamsType} from "@/api/auth-api.ts";
// import {PATH} from "@/common/constants";
//
// export const Login = () => {
//   const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
//   const dispatch = useAppDispatch();
//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//       rememberMe: false,
//     },
//     validate: (values) => {
//       const errors: FormikErrors = {};
//       if (!values.password) {
//         errors.password = 'Required';
//       } else if (values.password.length < 4) {
//         errors.password = 'Must be 4 characters or more';
//       }
//       if (!values.email) {
//         errors.email = 'Required';
//       } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//         errors.email = 'Invalid email address';
//       }
//       return errors;
//     },
//     onSubmit: (values: LoginParamsType) => {
//       dispatch(authActions.login(values));
//       formik.resetForm(); // в then dispatch( )loadingTC) если success
//     },
//   });
//
//   if (isLoggedIn) {
//     return <Navigate to={PATH.ROOT} />;
//   }
//   // Добавить эти редиректы нужно непосредственно перед return, то есть после всех хуков, которые используются внутри компонент, иначе будет нарушено правило работы с хуками, говорящее, что нельзя использовать хуки внутри компоненты в условной логике.
//
//   return (
//     <Grid container justifyContent={'center'} sx={{width: '100%'}}>
//       <Grid justifyContent={'center'}>
//         <form onSubmit={formik.handleSubmit}>
//           <FormControl>
//             <FormLabel>
//               <p>
//                 To log in get registered
//                 <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
//                   {' '}
//                   here
//                 </a>
//               </p>
//               <p>or use common test account credentials:</p>
//               <p>Email: free@samuraijs.com</p>
//               <p>Password: free</p>
//             </FormLabel>
//             <FormGroup>
//               <TextField
//                 label="Email"
//                 type="email"
//                 margin="normal"
//                 {...formik.getFieldProps('email')}
//                 onBlur={formik.handleBlur}
//               />
//               {/*    initialValues: {  // the values are taken from here*/}
//               {/*    email: '',*/}
//               {/*    password: '',*/}
//               {/*    rememberMe: false,*/}
//               {/*},*/}
//               {formik.touched.email && formik.errors.email ? (
//                 <div className={S.error}>{formik.errors.email}</div>
//               ) : null}
//               <TextField
//                 type="password"
//                 label="Password"
//                 margin="normal"
//                 {...formik.getFieldProps('password')}
//                 onBlur={formik.handleBlur}
//               />
//               {formik.touched.password && formik.errors.password ? (
//                 <div className={S.error}>{formik.errors.password}</div>
//               ) : null}
//               <FormControlLabel
//                 label={'Remember me'}
//                 checked={formik.values.rememberMe}
//                 control={<Checkbox name={'rememberMe'} />}
//                 {...formik.getFieldProps('rememberMe')}
//               />
//               <Button
//                 type={'submit'}
//                 variant={'contained'}
//                 color={'primary'}
//                 disabled={!!(formik.errors.email || formik.errors.password)}
//               >
//                 Login
//               </Button>
//             </FormGroup>
//           </FormControl>
//         </form>
//       </Grid>
//     </Grid>
//   );
// };
//
// // TYPES
// type FormikErrors = Partial<LoginParamsType>;



import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import s from "./Login.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import Grid from "@mui/material/Grid"
import {getTheme} from "@/common";
import {useAppSelector} from "@/app/store.ts";
import {themeModeSelector} from "@/app/slices/appSlice.ts";
import {Navigate} from "react-router-dom";
import {PATH} from "@/common/constants";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {authActions, authIsLoggedInSelector} from "@/features/auth/model/slices/authSlice.ts";

export const Login = () => {
  const themeMode = useAppSelector(themeModeSelector)
  const isLoggedIn = useAppSelector<boolean>(authIsLoggedInSelector);
  const dispatch = useAppDispatch();

  const theme = getTheme(themeMode)

  const {
    // register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    dispatch(authActions.login(data));
    reset()
  }

  if (isLoggedIn) {
    return <Navigate to={PATH.ROOT} />;
  } // Protected routes are used instead of this

  return (
      <Grid container justifyContent={"center"} sx={{width: '100%'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>
              <p>
                To login get registered
                <a
                    style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                    href="https://social-network.samuraijs.com"
                    target="_blank"
                    rel="noreferrer"
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>
                <b>Email:</b> free@samuraijs.com
              </p>
              <p>
                <b>Password:</b> free
              </p>
            </FormLabel>
            <FormGroup sx={{width: '26.5rem'}}>
              {/*<TextField*/}
              {/*  label="Email"*/}
              {/*  margin="normal"*/}
              {/*  error={!!errors.email}*/}
              {/*  // {...register("email", {*/}
              {/*  //   required: "Email is required",*/}
              {/*  //   pattern: {*/}
              {/*  //     value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,*/}
              {/*  //     message: "Incorrect email address",*/}
              {/*  //   },*/}
              {/*  // })}*/}
              {/*  {...register("email")}*/}
              {/*/>*/}
              <Controller
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                      <TextField label="Email" margin="normal" error={!!errors.email} {...rest} />
                  )}
                  name="email"
              />
              {errors.email && <span className={s.error}>{errors.email.message}</span>}

              {/*<TextField type="password" label="Password" margin="normal" {...register("password")} />*/}
              <Controller
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                      <TextField type="password" label="Password" margin="normal" {...rest}/>
                  )}
                  name="password"
              />
              {errors.password && <span className={s.error}>{errors.password.message}</span>}

              {/*<FormControlLabel label="Remember me" control={<Checkbox {...register("rememberMe")} />} />*/}
              <FormControlLabel
                  label={"Remember me"}
                  control={
                    <Controller
                        name={"rememberMe"}
                        control={control}
                        render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                    />
                  }
              />

              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
  )
}
