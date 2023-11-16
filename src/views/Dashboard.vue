<script setup>
import { onMounted, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import DashboardService from '@/service/DashboardService';
import RegionService from '@/service/RegionService';
import { useLayout } from '@/layout/composables/layout';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const { isDarkTheme } = useLayout();
const toast = useToast();

const products = ref(null);
const participant = ref({});
const lineOptions = ref(null);
const detail = ref(null);
const provinces = ref(null);
const province = ref({});
const provinsi = ref(null);
const cities = ref(null);
const city = ref({});
const districts = ref(null);
const district = ref({});
const villages = ref(null);
const village = ref(null);

const paramProvince = ref(null);
const paramCity = ref(null);
const paramDistrict = ref(null);
const paramVillage = ref(null);

const productService = new ProductService();
const dashboardService = new DashboardService();
const regionService = new RegionService();
const loading = ref(false);

const userData = ref(window.localStorage.getItem('userData'));
const user = JSON.parse(userData.value);

// Method
onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
    // getDetail();
    getDataDropdown();
    window.localStorage.setItem('provinsi', user?.provinsi);
});

const findProvincesIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < provinces.value.length; i++) {
        if (provinces.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findCityIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < cities.value.length; i++) {
        if (cities.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findDistrictsIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < districts.value.length; i++) {
        if (districts.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findVillagesIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < villages.value.length; i++) {
        if (villages.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findProvincesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < provinces.value.length; i++) {
        if (provinces.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
const findCitiesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < cities.value.length; i++) {
        if (cities.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findDistricsIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < districts.value.length; i++) {
        if (districts.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findVillagesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < villages.value.length; i++) {
        if (villages.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const resetFilter = () => {
    province.value = null;
    city.value = null;
    paramProvince.value = null;
    paramCity.value = null;
    detail.value = null;
};

const handleSearch = async () => {
    try {
        const params = {};
        // const dates = calendarValue.value;

        if (paramProvince.value) params.provinsi = paramProvince.value;
        if (paramCity.value) params.kota = paramCity.value;
        if (paramDistrict.value) params.kecamatan = paramDistrict.value;
        if (paramVillage.value) params.kelurahan = paramVillage.value;

        await dashboardService.dashboard(params).then((result) => (detail.value = result));
    } catch (e) {
        Toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Menampilkan Data', life: 3000 });
    }
};

const handleExport = async () => {
    loading.value = true;
    try {
        const params = {};
        // const dates = calendarValue.value;

        if (paramProvince.value) params.provinsi = paramProvince.value;
        if (paramCity.value) params.kota = paramCity.value;
        if (paramDistrict.value) params.kecamatan = paramDistrict.value;
        if (paramVillage.value) params.kelurahan = paramVillage.value;

        await dashboardService.export(params).then((result) => {
            setTimeout(() => {
                loading.value = false;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Export Data Berhasil', life: 3000 });
                const link = document.createElement('a');
                link.href = import.meta.env.VITE_BACKEND_URL + '/v1/' + result;
                const name = result.split('/');
                link.download = name[1];
                link.click();
            }, 2000);
        });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Export Data', life: 3000 });
    }
};

const handleProvinsi = async () => {
    paramProvince.value = provinces.value[findProvincesIndexById(province.value)].name;
    await regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
};

const handleCity = () => {
    paramCity.value = cities.value[findCitiesIndexById(city.value)].name;
    regionService.getDistrict({ regency_id: city.value }).then((result) => (districts.value = result));
};

const handleDistrict = () => {
    paramDistrict.value = districts.value[findDistricsIndexById(district.value)].name;
    regionService.getVillage({ district_id: district.value }).then((result) => (villages.value = result));
};

const handleVillage = () => {
    paramVillage.value = villages.value[findVillagesIndexById(village.value)].name;
};

const getDataDropdown = async () => {
    try {
        const params = { page: 1, size: 100 };
        // productService.getProducts().then((data) => (products.value = data));
        await regionService.getProvincies({}).then((result) => (provinces.value = result));

        const dataProvince = ref(window.localStorage.getItem('provinsi'));
        const dataCity = ref(window.localStorage.getItem('kota'));
        const dataDistrict = ref(window.localStorage.getItem('kecamatan'));
        const dataVillage = ref(window.localStorage.getItem('kelurahan'));

        // if (dataProvince.value !== null) {
        //     dataProvince.value = dataProvince.value.toUpperCase();
        //     provinsi.value = provinces.value[findProvinceIndexByName(dataProvince.value)].name;
        //     province.value = provinces.value[findProvinceIndexByName(dataProvince.value)].id;
        //     await regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
        //     params.provinsi = provinsi.value;
        // }
        if (dataProvince.value !== null && provinces.value[findProvincesIndexByName(dataProvince.value)]) {
            paramProvince.value = provinces.value[findProvincesIndexByName(dataProvince.value)].name;
            province.value = provinces.value[findProvincesIndexByName(dataProvince.value)].id;
            await regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
            params.provinsi = paramProvince.value;
        }

        if (dataCity.value !== null) {
            dataCity.value = dataCity.value.toUpperCase();
            city.value = cities.value[findCityIndexByName(dataCity.value)].name;
            params.kota = city.value;
        }

        if (dataDistrict.value !== null && districts.value[findDistrictsIndexByName(dataDistrict.value)]) {
            district.value = districts.value[findDistrictsIndexByName(dataDistrict.value)].id;
            await regionService.getVillage({ district_id: district.value }).then((result) => (villages.value = result));
            params.kecamatan = dataDistrict.value;
        }

        if (dataVillage.value !== null && villages.value[findVillagesIndexByName(dataVillage.value)]) {
            village.value = villages.value[findVillagesIndexByName(dataVillage.value)].id;
            params.kelurahan = dataVillage.value;
        }

        window.localStorage.removeItem('provinsi');
        window.localStorage.removeItem('kota');
        // state.detail = data
    } catch (error) {
        console.log(error);
    }
};

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="card">
        <h3 class="text-center">Dashboard Bakti Sosial 2023</h3>
        <Toast />
    </div>
    <div class="card">
        <h3 class="text-left mb-0">Total Sembako di kota anda : {{ detail?.total_quota ?? '0' }}</h3>
    </div>
    <Toolbar v-if="user.role !== 'STAFF-LAPANGAN'" class="mb-2" style="background: transparent; border: none">
        <template v-slot:start>
            <div class="my-2" style="display: block">
                <Dropdown class="mr-4 mb-2" v-model="province" :options="provinces" optionValue="id" optionLabel="name" placeholder="Provinsi" @change="handleProvinsi" />
                <Dropdown class="mr-4 mb-2" v-model="city" :options="cities" optionValue="id" optionLabel="name" placeholder="Kota" @change="handleCity" />
                <Dropdown class="mr-4 mb-2" v-model="district" :options="districts" optionValue="id" optionLabel="name" placeholder="Kecamatan" @change="handleDistrict" />
                <Dropdown class="mr-4 mb-2" v-model="village" :options="villages" optionValue="id" optionLabel="name" placeholder="Kelurahan" @change="handleVillage" />

                <Button label="Export Data" class="p-button-primary mr-4 mb-2" @click="handleExport" :loading="loading" />
            </div>
        </template>

        <template v-slot:end>
            <Button label="Search" class="p-button-secondary ml-2" @click="handleSearch" />
            <Button label="Reset Filter" class="p-button-info ml-2" @click="resetFilter" />
        </template>
    </Toolbar>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0" :style="{ height: '100%' }">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Total Penerima Bantuan Kota Anda</h3>
                        <div class="text-900 font-medium text-xl align-items-center justify-content-center">
                            <h3>{{ detail?.total_penerima ?? '0' }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0" :style="{ height: '100%' }">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Sudah Menerima Bantuan</h3>
                        <div class="text-900 font-medium text-xl align-items-center justify-content-center">
                            <h3>{{ detail?.total_sudah_menerima ?? '0' }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0" :style="{ height: '100%' }">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Belum Unggah Foto Penerima Bantuan</h3>
                        <div class="text-900 font-medium text-xl align-items-center justify-content-center">
                            <h3>{{ detail?.total_partial_done ?? '0' }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0" :style="{ height: '100%' }">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Belum Menerima Bantuan</h3>
                        <div class="text-900 font-medium text-xl align-items-center justify-content-center">
                            <h3>{{ detail?.total_belum_menerima ?? '0' }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3"></div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0" :style="{ height: '100%' }">
                <div class="flex justify-content-center mb-3">
                    <div class="text-center">
                        <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Data Tidak Sesuai</h3>
                        <div class="text-900 font-medium text-xl align-items-center justify-content-center">
                            <h3>{{ detail?.total_data_gugur ?? 0 }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
