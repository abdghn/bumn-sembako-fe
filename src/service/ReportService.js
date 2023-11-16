import { axiosApp } from '@/utils/axios';

export default class ReportService {
    exportReport(body) {
        return axiosApp.post('/v1/report/export-new', body).then((d) => d.data.data);
    }
}
