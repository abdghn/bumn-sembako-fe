import { axiosApp } from '@/utils/axios';

export default class UserService {
    getUsers(params) {
        return axiosApp.get('/v1/user', { params }).then((d) => d.data.data);
    }

    addUser(body) {
        return axiosApp.post('/v1/user', body).then((d) => d.data.data);
    }

    deleteUser(id) {
        return axiosApp.delete('/v1/user/' + id).then((d) => d.data.data);
    }

    updateUser(id, body) {
        return axiosApp.put('/v1/user/' + id, body).then((d) => d.data.data);
    }
}
