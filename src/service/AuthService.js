import { axiosApp } from '@/utils/axios';

export default class AuthService {
    login(body) {
        return axiosApp.post('/v1/login', body).then((d) => d.data.data);
    }

    register(body) {
        return axiosApp.post('/v1/register', body).then((d) => d.data.data);
    }

    registerYayasan(body) {
        return axiosApp.post('/v1/register-yayasan', body).then((d) => d.data.data);
    }
}
