import App from '@/app/App'
import {createBrowserRouter, Navigate} from 'react-router-dom'
import {Todolists} from '@/features/Todolists/ui/Todolists/Todolists'
import {ErrorPage} from '@/common/pages/ErrorPage/ErrorPage'
import {PATH} from "@/common/constants";
import {Login} from "@/features/auth/ui/Login.tsx";

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

// const publicRoutes: RouteObject[] = [
//     {
//         path: PATH.LOGIN,
//         element: <Login />,
//     },
//     {
//         path: PATH.ERROR,
//         element: <ErrorPage />,
//     },
// ];
//
// const privateRoutes: RouteObject[] = [
//     {
//         path: PATH.TODO,
//         element: <Todolists />,
//     },
// ];


// export const router = createBrowserRouter([
//     {
//         path: PATH.ROOT,
//         element: <App />,
//         errorElement: <Navigate to={PATH.ERROR} />,
//         children: [
//             {
//                 index: true, // to pass to the main page automatically when root url '/' is entered
//                 element: <Navigate to={PATH.TODO} />
//             },
//             {
//                 element: <PrivateRoutes/>,
//                 children: privateRoutes,
//             },
//             ...publicRoutes,
//             // {
//             //     path: PATH.CATCH_ALL,
//             //     element: <Error404 />,
//             // },
//         ],
//     },
// ]);
