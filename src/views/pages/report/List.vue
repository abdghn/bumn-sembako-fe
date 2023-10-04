<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import RegionService from '@/service/RegionService';
import DashboardService from '@/service/DashboardService';
import ReportService from '@/service/ReportService';
import moment from 'moment';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const product = ref({});
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const calendarValue = ref(null);
const isActive = ref(false);

const jamValue = ref(null);
const evaluasiValue = ref(null);
const solusiValue = ref(null);
const exportPDFSign = ref(false);

const provinces = ref(null);
const province = ref({});

const cities = ref(null);
const city = ref({});

const provinsi = ref(null);

const detail = ref(null);

const regionService = new RegionService();
const dashboardService = new DashboardService();
const reportService = new ReportService();


onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    getDataDropdown();
    // await getDetail();
});

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

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

const exportCSV = () => {
    dt.value.exportCSV();
};

const handleProvinsi = () => {
    provinsi.value = provinces.value[findStatusIndexById(province.value)].name;
    regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
};

const resetFilter = () => {
    provinsi.value = null;
    city.value = null;
    dashboardService.dashboard({ }).then((result) => (products.value = result));
};

const handleSearch = async () => {
    try {
        const params = {};
        // const dates = calendarValue.value;

        if (provinsi.value) params.provinsi = provinsi.value;
        if (city.value) params.kota = city.value;
        // if (calendarValue.value) params.date = moment(dates).format('YYYY-MM-DD');

        await dashboardService.dashboard(params).then((result) => (detail.value = result));
        console.log(detail.value)
        if (detail.value !== null) {
            isActive.value = true;
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal Menampilkan Data', life: 3000 });
    }
};

const handleExport = () => {
    try {
        const payload = {
            provinsi: province.value,
            kota: city.value,
            date: moment(calendarValue.value).format('YYYY-MM-DD'),
            jam: jamValue.value,
            evaluasi: evaluasiValue.value,
            solusi: solusiValue.value
        }

        reportService.exportReport(payload).then((result) => (console.log(result)));
    } catch (e) {
        console.log(e);
    }
};

// const handleExport = () => {
//     try {
//         const payload = {
//             provinsi: province.value,
//             kota: "KOTA BOGOR",
//             date: "2023-01-01",
//             jam: jamValue.value,
//             evaluasi: evaluasiValue.value,
//             solusi: solusiValue.value
//         }

//         reportService.exportReport(payload).then((result) => (console.log(result)));
//     } catch (e) {
//         console.log(e);
//     }
// };

// const handleExportPDF = () => {
//     const payload = {
//         provinsi : province.value,
//         kota : province.value,
//         jam : jamValue.value,
//         evaluasi : evaluasiValue.value,
//         solusi : solusiValue.value
//     }
//     console.log(payload);
// }

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

// const getDetail = async () => {
//   try {
//     await dashboardService.dashboard({}).then((data) => (detail.value = data));
//   } catch (e) {
//     console.log(e)
//   }
// };

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
                <h5>Menampilkan Data : {{ provinsi ?? '' }}{{ ' ' }}{{ city.length !== 0 ? city : '' }} </h5>
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <span class="mr-4"><b>Total: {{detail?.tota_penerima ?? '0'}}</b></span>
                            <span class="mr-4"><b>Sudah Menerima: {{detail?.total_sudah_menerima ?? '0'}}</b></span>
                            <span class="mr-4"><b>Calon Penerima: {{detail?.total_partial_done ?? '0'}}</b></span>
                            <span class="mr-4"><b>Gugur: {{detail?.total_belum_menerima ?? '0'}}</b></span>
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
                <div v-if="isActive === true" class="grid p-fluid" >
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
</template>

<style scoped lang="scss"></style>
