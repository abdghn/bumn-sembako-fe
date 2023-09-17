import { axiosApp } from '@/utils/axios';

export default class ParticipantService {
    getParticipants(params) {
        return axiosApp.get('/v1/participant', { params }).then((d) => d.data.data);
    }

    getParticipant(id) {
        return axiosApp.get('/v1/participant/' + id).then((d) => d.data.data);
    }

    updateParticipant(id, body) {
        return axiosApp
            .put('/v1/participant/' + id, body, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((d) => d.data.data);
    }
}
