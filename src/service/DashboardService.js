import { axiosApp } from '@/utils/axios';

export default class DashboardService {
    dashboard(body) {
        return axiosApp.get('/v1/dashboard', body).then((d) => d.data.data);
    }
}
