import {BaseResponse, instance} from "@/common";

export const authApi = {
  login(params: LoginParamsType) {
    return instance.post<BaseResponse<LoginResponse>>('/auth/login', params);
  },
  logout() {
    return instance.delete<BaseResponse>('/auth/login');
  },
  me() {
    return instance.get<BaseResponse<AuthMeResponse>>('/auth/me');
  },
};

// TYPES
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string; // boolean
};

type AuthMeResponse = {
  id: number;
  email: string;
  login: string;
};

export type LoginResponse = {
  userId?: number
}
