import axios from 'axios';

// export const axiosApp = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     headers: {
//         // 'Content-Type': 'application/json'
//     }
// })

const axiosApp = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        // 'Content-Type': 'application/json'
    }
});

/**
 * Set token on http request
 * @param {String} token
 */
const setTokenAxiosApp = (token) => {
    axiosApp.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/**
 * Remove token from http request
 */
const removeTokenAxiosApp = () => {
    axiosApp.defaults.headers.common.Authorization = null;
};

export { axiosApp, setTokenAxiosApp, removeTokenAxiosApp };
