import { PATH } from "@/common/constants";
import {Outlet} from "react-router";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "@/app/store.ts";
import {authIsLoggedInSelector} from "@/features/auth/model/slices/authSlice.ts";

export const PrivateRoutes = () => {
    const isLoggedIn = useAppSelector(authIsLoggedInSelector);

    return isLoggedIn ? <Outlet/> : <Navigate to={PATH.LOGIN}/>
};