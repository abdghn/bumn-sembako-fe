<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import RegionService from '@/service/RegionService';
import DashboardService from '@/service/DashboardService';
import ReportService from '@/service/ReportService';
import moment from 'moment';
import { useRouter } from 'vue-router';

const toast = useToast();

const products = ref(null);
const filters = ref({});
const calendarValue = ref(null);
const isActive = ref(false);

const jamValue = ref(null);
const evaluasiValue = ref(null);
const solusiValue = ref(null);

const provinces = ref(null);
const province = ref(null);

const cities = ref(null);
const city = ref(null);

const provinsi = ref(null);

const detail = ref(null);

const router = useRouter();

const regionService = new RegionService();
const dashboardService = new DashboardService();
const reportService = new ReportService();
const loading = ref(false)

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    getDataDropdown();
});

const findStatusIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < provinces.value.length; i++) {
        if (provinces.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findProvinceIndexByName = (name) => {
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

const handleProvinsi = () => {
    provinsi.value = provinces.value[findStatusIndexById(province.value)].name;
    regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
};

const resetFilter = () => {
    provinsi.value = null;
    city.value = null;
    dashboardService.dashboard({}).then((result) => (products.value = result));
};

const handleSearch = async () => {
    try {
        const params = {};
        const dates = calendarValue.value;

        if (provinsi.value) params.provinsi = provinsi.value;
        if (city.value) params.kota = city.value;
        if (calendarValue.value) params.date = moment(dates).format('YYYY-MM-DD');

        await dashboardService.dashboard(params).then((result) => (detail.value = result));
        if (detail.value !== null) {
            isActive.value = true;
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Menampilkan Data', life: 3000 });
    }
};

const handleExport = () => {
    try {
        loading.value = true
        const payload = {
            provinsi: provinces.value[findStatusIndexById(province.value)].name,
            kota: cities.value[findCityIndexByName(city.value)].name,
            date: moment(calendarValue.value).format('YYYY-MM-DD'),
            jam: jamValue.value,
            evaluasi: evaluasiValue.value,
            solusi: solusiValue.value
        };
        reportService
            .exportReport(payload)
            .then((result) => {
                loading.value = false
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Export PDF Berhasil', life: 3000 });
                const link = document.createElement('a');
                link.href = import.meta.env.VITE_BACKEND_URL + '/v1/' + result;
                const name = result.split('/');
                link.target = '_blank';
                link.download = name[1];
                link.click();
            })
            .catch((e) => {
                loading.value = false
                console.log(e);
                toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Export PDF', life: 3000 });
            });

        // reportService.exportReport(payload).then((result) => {
        //     const link = document.createElement('a');
        //     link.href = import.meta.env.VITE_BACKEND_URL + '/v1/' + result;
        //     const name = result.split('/');
        //     link.target = '_blank';
        //     link.download = name[1];
        //     link.click();
        // });
    } catch (e) {
        loading.value = false
        console.log(e);
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Export PDF', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getDataDropdown = async () => {
    try {
        const params = { page: 1, size: 100 };
        // productService.getProducts().then((data) => (products.value = data));
        await regionService.getProvincies({}).then((result) => (provinces.value = result));

        const dataProvince = ref(window.localStorage.getItem('provinsi'));
        const dataCity = ref(window.localStorage.getItem('kota'));

        if (dataProvince.value !== null) {
            dataProvince.value = dataProvince.value.toUpperCase();
            provinsi.value = provinces.value[findProvinceIndexByName(dataProvince.value)].name;
            province.value = provinces.value[findProvinceIndexByName(dataProvince.value)].id;
            await regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
            params.provinsi = provinsi.value;
        }

        if (dataCity.value !== null) {
            dataCity.value = dataCity.value.toUpperCase();
            city.value = cities.value[findCityIndexByName(dataCity.value)].name;
            params.kota = city.value;
        }

        window.localStorage.removeItem('provinsi');
        window.localStorage.removeItem('kota');
        // state.detail = data
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Menampilkan Data : {{ provinsi ?? '' }}{{ ' ' }}{{ city ?? '' }}</h5>
                <Toast />
                <div className="card flex justify-content-center" v-if="loading">
                    <ProgressSpinner />
                </div>

                <div v-if="!loading"> 
                    <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <span class="mr-4"
                                ><b>Total: {{ detail?.total_penerima ?? '0' }}</b></span
                            >
                            <span class="mr-4"
                                ><b>Sudah Menerima: {{ detail?.total_sudah_menerima ?? '0' }}</b></span
                            >
                            <span class="mr-4"
                                ><b>Calon Penerima: {{ detail?.total_partial_done ?? '0' }}</b></span
                            >
                            <span class="mr-4"
                                ><b>Gugur: {{ detail?.total_belum_menerima ?? '0' }}</b></span
                            >
                        </div>
                    </template>
                </Toolbar>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div>
                            <Dropdown class="mr-2" v-model="province" :options="provinces" optionValue="id" optionLabel="name" placeholder="Provinsi" @change="handleProvinsi" />
                            <Dropdown class="mr-2" v-model="city" :options="cities" optionValue="name" optionLabel="name" placeholder="Kota" />
                            <Calendar placeholder="Pilih Tanggal" :showIcon="false" :showButtonBar="true" class="my-2 mr-4" v-model="calendarValue"></Calendar>
                            <Button label="Search" class="p-button-secondary mb-2" @click="handleSearch" />
                            <Button label="Clear Filter" class="p-button-info ml-2 mb-2" @click="resetFilter" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <div v-if="isActive === true">
                            <Button label="Export PDF" class="p-button-info ml-2 inline-block" @click="handleExport" />
                        </div>
                    </template>
                </Toolbar>
                <div v-if="isActive === true" class="grid p-fluid">
                    <div class="col-12 xl:col-4">
                        <h5>Jam</h5>
                        <Editor v-model="jamValue" editorStyle="height: 320px" />
                    </div>
                    <div class="col-12 xl:col-4">
                        <h5>Evaluasi</h5>
                        <Editor v-model="evaluasiValue" editorStyle="height: 320px" />
                    </div>
                    <div class="col-12 xl:col-4">
                        <h5>Solusi</h5>
                        <Editor v-model="solusiValue" editorStyle="height: 320px" />
                    </div>
                </div>
                <div v-if="isActive === true" class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                    <Button label="Export PDF" class="p-button-info ml-2" @click="handleExport" />
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
