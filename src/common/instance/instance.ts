import axios from 'axios'

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

export const settings = {
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        'API-KEY': '49c04d35-d285-4efe-9548-92691308d757',
    },
};

export const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    ...settings,
})