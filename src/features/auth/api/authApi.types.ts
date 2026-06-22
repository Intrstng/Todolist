export type LoginParamsType = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha?: string; // boolean
};

export type AuthMeResponse = {
    id: number;
    email: string;
    login: string;
};

export type LoginResponse = {
    userId: number
    token: string
}
