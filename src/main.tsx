import {BrowserRouter} from "react-router"
import {createRoot} from "react-dom/client"
import {Provider} from 'react-redux'
import {store} from '@/app/store'
import App from "@/app/App.tsx";
import './index.css'

createRoot(document.getElementById("root")!).render(
    // <BrowserRouter basename="/Todolist"> // used for deploy to github-pages - not used for vercel deploy
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
)