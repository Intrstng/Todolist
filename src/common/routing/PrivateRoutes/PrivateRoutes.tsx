import {Navigate, Outlet} from "react-router";
import {PrivateRoutesProps} from "@/common/routing/PrivateRoutes/PrivateRoutes.types.ts";
import {PATH} from "@/common/constants";

export const PrivateRoutes = ({ isAllowed, redirectPath = PATH.ROOT }: PrivateRoutesProps) => {
    return isAllowed ? <Outlet/> : <Navigate to={redirectPath} replace />
};