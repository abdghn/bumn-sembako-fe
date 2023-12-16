import { axiosApp } from '@/utils/axios';

export default class OrganizationService {
    getOrganization(params) {
        return axiosApp.get('/v1/user/organization', { params }).then((d) => d.data.data);
    }

    getOrganizationEO(params) {
        return axiosApp.get('/v1/user/organization/eo', { params }).then((d) => d.data.data);
    }

    getOrganizationYayasan(params) {
        return axiosApp.get('/v1/user/organization/yayasan', { params }).then((d) => d.data.data);
    }
}
