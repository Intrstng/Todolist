import {createRoot} from "react-dom/client"
import {Provider} from 'react-redux'
import {store} from '@/app/store'
import {BrowserRouter} from "react-router"
import './index.css'
import App from "@/app/App.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
)