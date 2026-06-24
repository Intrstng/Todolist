import {PATH} from "@/common/constants";
import {Outlet} from "react-router";
import {Navigate} from "react-router-dom";
import {authIsLoggedInSelector} from "@/app/slices/appSlice.ts";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";

export const PrivateRoutes = () => {
    const isLoggedIn = useAppSelector(authIsLoggedInSelector);

    return isLoggedIn ? <Outlet/> : <Navigate to={PATH.LOGIN}/>
};