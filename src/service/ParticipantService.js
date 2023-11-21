import { axiosApp } from '@/utils/axios';

export default class ParticipantService {
    getParticipants(params) {
        return axiosApp.get('/v1/participant', { params }).then((d) => d.data);
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

    editParticipant(id, body) {
        return axiosApp
            .put('/v1/participant/edit/' + id, body, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((d) => d.data.data);
    }
    report(body) {
        return axiosApp.post('/v1/', body).then((d) => d.data.data);
    }

    importParticipant(body) {
        return axiosApp.post('/v1/participant/import', body).then((d) => d.data.data);
    }

    getLogs(params) {
        return axiosApp.get('/v1/participant/import', { params }).then((d) => d.data.data);
    }

    deleteParticipant(id) {
        return axiosApp.delete('/v1/participant/' + id).then((d) => d.data.data);
    }

    resetParticipant(id) {
        return axiosApp.put('/v1/participant/reset/' + id).then((d) => d.data.data);
    }
}
