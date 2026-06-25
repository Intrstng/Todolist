import {Navigate, Route, Routes} from "react-router"
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {authIsLoggedInSelector} from "@/app/slices/appSlice.ts";
import {PrivateRoutes} from "@/common/routing/PrivateRoutes/PrivateRoutes.tsx";
import {Login} from "@/features/auth/ui/Login.tsx";
import {ErrorPage} from "@/common/pages/ErrorPage/ErrorPage.tsx";
import {Main} from "@/common/components/Main";
import {PATH} from "@/common/constants";

export const Routing = () => {
    const isLoggedIn = useAppSelector(authIsLoggedInSelector);

    return (
        <Routes>
            <Route path={PATH.ROOT} element={<Navigate to={PATH.TODO} replace />} />

            <Route element={<PrivateRoutes isAllowed={isLoggedIn} redirectPath={PATH.LOGIN} />}>
                <Route path={PATH.TODO} element={<Main />} />
            </Route>
            <Route element={<PrivateRoutes isAllowed={!isLoggedIn} />}>
                <Route path={PATH.LOGIN} element={<Login />} />
            </Route>
            <Route path={PATH.NOT_FOUND} element={<ErrorPage />} />
        </Routes>
    )
}