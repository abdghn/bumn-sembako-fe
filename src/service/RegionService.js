import { axiosApp } from '@/utils/axios';

export default class RegionService {
    getProvincies(params) {
        return axiosApp.get('/v1/region/province', { params }).then((d) => d.data.data);
    }

    getRegencies(params) {
        return axiosApp.get('/v1/region/regency', { params }).then((d) => d.data.data);
    }

    getDistrict(params) {
        return axiosApp.get('/v1/region/district', { params }).then((d) => d.data.data);
    }

    getVillage(params) {
        return axiosApp.get('/v1/region/village', { params }).then((d) => d.data.data);
    }
}
