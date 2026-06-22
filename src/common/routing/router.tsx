import App from '@/app/App'
import {createBrowserRouter, Navigate} from 'react-router-dom'
import {Login} from '@/features/Login/ui/Login'
import {Todolists} from '@/features/Todolists/ui/Todolists/Todolists'
import {ErrorPage} from '@/common/pages/ErrorPage/ErrorPage'
import {PATH} from "@/common/constants";

export const router = createBrowserRouter([
    {
        path: PATH.ROOT,
        element: <App />,
        errorElement: <Navigate to={PATH.ERROR} />,
    children: [
    {
        index: true,
        element: <Navigate to={PATH.TODO} />
    },
    {
        path: PATH.LOGIN,
        element: <Login />
    },
    {
        path: PATH.TODO,
        element: <Todolists />
    },
    {
        path: PATH.ERROR,
        element: <ErrorPage/>,
    },
]
},
{
    path: PATH.ERROR,
        element: <ErrorPage />
}
],
// {
//   basename: process.env.PUBLIC_URL  // This will use the homepage value
// }
)