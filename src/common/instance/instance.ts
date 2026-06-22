import axios from 'axios'
import {AUTH_TOKEN} from "@/common/constants";

// export const settings = {
//     withCredentials: true,
//     headers: {
//         Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
//         'API-KEY': process.env.REACT_APP_API_KEY,
//     },
// };
//
// export const instance = axios.create({
//     baseURL: process.env.REACT_APP_BASE_URL,
//     ...settings,
// })

// export const settings = {
//     withCredentials: true,
//     headers: {
//         Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
//         'API-KEY': '49c04d35-d285-4efe-9548-92691308d757',
//     },
// };
//
// export const instance = axios.create({
//     baseURL: process.env.REACT_APP_BASE_URL,
//     ...settings,
// })

// export const settings = {
//     withCredentials: true,
//     headers: {
//         'API-KEY': import.meta.env.VITE_API_KEY,
//         Authorization: `Bearer ${import.meta.env.BEARER_TOKEN}`,
//     },
// };
//
// export const instance = axios.create({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     ...settings,
// })

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        // ❌ Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`, // т.к. добавили instance.interceptors - см. ниже
        "API-KEY": import.meta.env.VITE_API_KEY,
    },
})

instance.interceptors.request.use(function (config) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
    return config
})