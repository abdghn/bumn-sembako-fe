import { axiosApp } from '@/utils/axios';

export default class DashboardService {
    dashboard(params) {
        return axiosApp.get('/v1/dashboard', { params }).then((d) => d.data.data);
    }

    export(params) {
        return axiosApp.get('/v1/excel', { params }).then((d) => d.data.data);
    }

    exportParticipant(body) {
        return axiosApp.post('/v1/report/csv/export', body).then((d) => d.data.data);
    }
}
