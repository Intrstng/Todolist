import {BaseResponse, instance} from "@/common";
import {AuthLoginResponse, AuthMeResponse, LoginParamsType} from "@/features/auth/api/authApi.types.ts";
import {baseApi} from "@/app/baseApi.ts";

export const _authApi = {
  login(params: LoginParamsType) {
    // return instance.post<BaseResponse<LoginResponse>>('/auth/login', params);
    return instance.post<AuthLoginResponse>('/auth/login', params);
  },
  logout() {
    return instance.delete<BaseResponse>('/auth/login');
  },
  me() {
    return instance.get<AuthMeResponse>('/auth/me');
  },
};

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
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi