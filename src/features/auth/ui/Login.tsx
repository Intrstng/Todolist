import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import {Controller, SubmitHandler, useForm} from "react-hook-form"
import s from "./Login.module.css"
import {zodResolver} from "@hookform/resolvers/zod"
import {LoginInputs, loginSchema} from "@/features/auth/lib/schemas"
import Grid from "@mui/material/Grid"
import {getTheme} from "@/common";
import {appActions, themeModeSelector} from "@/app/slices/appSlice.ts";
import {AUTH_TOKEN} from "@/common/constants";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {useLazyGetCaptchaQuery, useLoginMutation} from "@/features/auth/api/authApi.ts";
import {RESULT_CODE} from "@/common/enums/enums.ts";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {useId, useState} from "react";
import {InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export const Login = () => {
  const themeMode = useAppSelector(themeModeSelector)
  const dispatch = useAppDispatch();
  const theme = getTheme(themeMode)
  const [login] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const outlinedPasswordId = useId()
  const [trigger, { data: captcha }] = useLazyGetCaptchaQuery()

  const {
    // register, // Coontroller is used instead
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    login(data)
        .unwrap()
        .then((data) => {
            if (data.resultCode === RESULT_CODE.SUCCEDED) {
                localStorage.setItem(AUTH_TOKEN, data.data.token)
                dispatch(appActions.setIsLoggedIn({ isLoggedIn: true }))
                reset()
            } else if (data.resultCode === RESULT_CODE.INVALID_CAPTCHA_REQUIRED) {
                trigger()
            }
        })
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

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
                  name="email"
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                      <TextField label="Email" margin="normal" error={!!errors.email} {...rest} />
                  )}
              />
              {errors.email && <span className={s.error}>{errors.email.message}</span>}

              {/*<TextField type="password" label="Password" margin="normal" {...register("password")} />*/}
              <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                      <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth>
                        <InputLabel htmlFor={`${outlinedPasswordId}-input`} error={!!errors.password}>
                          Password
                        </InputLabel>
                        <OutlinedInput
                            id={`${outlinedPasswordId}-input`}
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? "hide the password" : "display the password"}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                            error={!!errors.password}
                            {...rest}
                            value={value}
                        />
                        {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}
                      </FormControl>
                  )}
              />

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
                {captcha?.url && (
                    <>
                        <Controller
                            name="captcha"
                            control={control}
                            render={({ field: { value, ...rest } }) => (
                                <TextField label="Captcha" margin="normal" error={!!errors.captcha} {...rest} />
                            )}
                        />
                        {errors.captcha && <span className={s.errorMessage}>{errors.captcha.message}</span>}
                    </>
                )}

              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </FormGroup>
              {captcha?.url && <img src={captcha?.url} width={200} height={100} alt={"captcha"} />}
          </FormControl>
        </form>
      </Grid>
  )
}
