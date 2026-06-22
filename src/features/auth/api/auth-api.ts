import {BaseResponse, instance} from "@/common";
import {AuthMeResponse, LoginParamsType, LoginResponse} from "@/features/auth/api/authApi.types.ts";

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
