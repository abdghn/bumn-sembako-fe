import axios from 'axios';

export const axiosApp = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
    }
})
