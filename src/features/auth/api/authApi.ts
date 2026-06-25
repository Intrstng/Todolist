import {BaseResponse} from "@/common";
import {
  AuthLoginResponse,
  AuthMeResponse,
  GetCaptchaResponse,
  LoginParamsType
} from "@/features/auth/lib/types/authApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthLoginResponse, LoginParamsType>({
      query: body => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: 'auth/login',
        method: 'DELETE',
      }),
    }),
    me: build.query<AuthMeResponse, void>({
      query: () => 'auth/me',
    }),
    getCaptcha: build.query<GetCaptchaResponse, void>({
      query: () => "security/get-captcha-url",
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation, useLazyGetCaptchaQuery } = authApi