import {createRoot} from "react-dom/client"
import {Provider} from 'react-redux'
import {store} from '@/app/store'
import {RouterProvider} from 'react-router-dom'
import {router} from "@/common/routing";
import './index.css'

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
)