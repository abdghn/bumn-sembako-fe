import { axiosApp } from '@/utils/axios';

export default class OrganizationService {
    getOrganization(params) {
        return axiosApp.get('/v1/user/organization', { params }).then((d) => d.data.data);
    }
}
