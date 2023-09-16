import { axiosApp } from '@/utils/axios';

export default class ParticipantService {
    getParticipants(params) {
        return axiosApp.get('/v1/participant', { params }).then((d) => d.data.data);
    }

    getParticipant(id) {
        return axiosApp.get('/v1/participant/' + id).then((d) => d.data.data);
    }
}
