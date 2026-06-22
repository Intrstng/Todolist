import {BaseResponse, instance} from "@/common";
import {AuthLoginResponse, AuthMeResponse, LoginParamsType} from "@/features/auth/api/authApi.types.ts";

export const authApi = {
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
