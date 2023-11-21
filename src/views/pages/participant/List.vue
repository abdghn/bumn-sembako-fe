<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ParticipantService from '@/service/ParticipantService';
import RegionService from '@/service/RegionService';
import TextClamp from 'vue3-text-clamp';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteDialog = ref(false);
const deleteProductsDialog = ref(false);
const resetDialog = ref(false);
const detailPariticpantDialog = ref(null);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const rows = ref(10);
const totalRecords = ref(100);
const indexPage = ref(0);
const loadingPage = ref(false);
const userData = ref(window.localStorage.getItem('userData'));
const user = JSON.parse(userData.value);

//  <------ state dropdown ------>
const provinces = ref([]);
const province = ref({});

const cities = ref([]);
const city = ref({});

const districts = ref([]);
const district = ref({});

//  <------ state dropdown ------>

const paramProvince = ref(null);
const paramCity = ref(null);
const paramDistrict = ref(null);
const paramVillage = ref(null);
const status = ref(null);
const paramStatus = ref(null);
const paramSearch = ref(null);

const villages = ref([]);
const village = ref(null);
const statuses = ref([
    { name: 'Selesai', code: 'DONE' },
    { name: 'Belum unggah foto', code: 'PARTIAL_DONE' },
    { name: 'Gugur', code: 'REJECTED' },
    { name: 'Calon Penerima', code: 'NOT DONE' }
]);

const printStatuses = ref([
    { name: 'Cetak semua', code: 'ALL' },
    { name: 'Sudah cetak', code: 'DONE' },
    { name: 'Gugur', code: 'NOT DONE' }
]);

const printStatus = ref(null);

const participantService = new ParticipantService();
const regionService = new RegionService();

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    await getDataDropdown();
});

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
    resetDialog.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const resetParticipant = () => {
    try {
        participantService
            .resetParticipant(product.value.id)
            .then(() => {
                product.value.status = 'NOT DONE';
                products.value[findIndexById(product.value.id)] = product.value;
            })
            .finally(() => {
                resetDialog.value = false;
                product.value = {};
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Penerima Berhasil di Reset', life: 3000 });
            });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed reset penerima', detail: 'Error ketika reset Penerima ', life: 3000 });
    }
};

const deleteParticipant = () => {
    try {
        participantService
            .deleteParticipant(product.value.id)
            .then(() => {
                products.value = products.value.filter((val) => val.id !== product.value.id);
            })
            .finally(() => {
                deleteDialog.value = false;
                product.value = {};
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Penerima berhasil dihapus', life: 3000 });
            });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed delete penerima', detail: 'Error ketika hapus penerima ', life: 3000 });
    }
};
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

const findStatusIndexById = (code) => {
    let index = -1;
    for (let i = 0; i < statuses.value.length; i++) {
        if (statuses.value[i].code === code) {
            index = i;
            break;
        }
    }
    return index;
};

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

const findCitiesIndexByName = (name) => {
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

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const handleProvince = async () => {
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

const handleStatus = () => {
    paramStatus.value = statuses.value[findStatusIndexById(status.value)].code;
};

const handleKeyup = () => {
    if (paramSearch.value.length >= 3 || paramSearch.value.length === 0) {
        handleFilter();
    }
};

const resetFilter = async () => {
    loadingPage.value = true;
    products.value = [];
    rows.value = 10;
    indexPage.value = 0;
    province.value = null;
    city.value = null;
    district.value = null;
    village.value = null;
    status.value = null;
    paramProvince.value = null;
    paramCity.value = null;
    paramDistrict.value = null;
    paramVillage.value = null;
    paramStatus.value = null;
    paramSearch.value = null;
    loadingPage.value = true;
    products.value = [];
    await participantService.getParticipants({ page: indexPage.value / rows.value + 1, size: rows.value }).then((result) => {
        products.value = result.data;
        totalRecords.value = result.total;
    });
    loadingPage.value = false;
};

const handleFilter = async () => {
    products.value = [];
    rows.value = 10;
    indexPage.value = 0;
    loadingPage.value = true;
    const params = {
        page: indexPage.value / rows.value + 1,
        size: rows.value
    };

    try {
        if (paramProvince.value) params.provinsi = paramProvince.value;
        if (paramCity.value) params.kota = paramCity.value;
        if (paramDistrict.value) params.kecamatan = paramDistrict.value;
        if (paramVillage.value) params.kelurahan = paramVillage.value;
        if (paramStatus.value) params.status = paramStatus.value;
        if (paramSearch.value && paramSearch.value.length > 3) params.search = paramSearch.value;

        await participantService.getParticipants(params).then((result) => {
            products.value = result.data;
            totalRecords.value = result.total;
        });
    } catch (e) {
        console.log(e);
    }

    loadingPage.value = false;
};

const handlePaginate = async () => {
    loadingPage.value = true;
    products.value = [];
    const params = {
        page: indexPage.value / rows.value + 1,
        size: rows.value
    };

    try {
        if (paramProvince.value) params.provinsi = paramProvince.value;
        if (paramCity.value) params.kota = paramCity.value;
        if (paramDistrict.value) params.kecamatan = paramDistrict.value;
        if (paramVillage.value) params.kelurahan = paramVillage.value;
        if (paramStatus.value) params.status = paramStatus.value;
        if (paramSearch.value && paramSearch.value.length > 3) params.search = paramSearch.value;

        await participantService.getParticipants(params).then((result) => {
            products.value = result.data;
            totalRecords.value = result.total;
        });
    } catch (e) {
        console.log(e);
    }

    loadingPage.value = false;
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const generateStatus = (value) => {
    let status;
    switch (value) {
        case 'NOT DONE':
            status = 'Calon Penerima';
            break;
        case 'PARTIAL_DONE':
            status = 'Belum Upload Foto';
            break;
        case 'REJECTED':
            status = 'Gugur';
            break;
        case 'DONE':
            status = 'Sudah Menerima';
            break;
    }

    return status;
};

// Method
const getDataDropdown = async () => {
    loadingPage.value = true;
    products.value = [];
    try {
        const params = { page: indexPage.value / rows.value + 1, size: rows.value };
        await regionService.getProvincies({}).then((result) => (provinces.value = result));

        const dataProvince = ref(window.localStorage.getItem('provinsi'));
        const dataCity = ref(window.localStorage.getItem('kota'));
        const dataDistrict = ref(window.localStorage.getItem('kecamatan'));
        const dataVillage = ref(window.localStorage.getItem('kelurahan'));

        if (dataProvince.value !== null && provinces.value[findProvincesIndexByName(dataProvince.value)]) {
            paramProvince.value = provinces.value[findProvincesIndexByName(dataProvince.value)].name;
            province.value = provinces.value[findProvincesIndexByName(dataProvince.value)].id;
            await regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
            params.provinsi = paramProvince.value;
        }
        if (dataCity.value !== null && cities.value[findCitiesIndexByName(dataCity.value)]) {
            city.value = cities.value[findCitiesIndexByName(dataCity.value)].id;
            await regionService.getDistrict({ regency_id: city.value }).then((result) => (districts.value = result));
            params.kota = cities.value[findCitiesIndexByName(dataCity.value)].name;
        }

        if (dataDistrict.value !== null && districts.value[findDistrictsIndexByName(dataDistrict.value)]) {
            district.value = districts.value[findDistrictsIndexByName(dataDistrict.value)].id;
            await regionService.getVillage({ district_id: district.value }).then((result) => (villages.value = result));
            params.kecamatan = dataDistrict.value;
        }

        if (dataVillage.value !== null) {
            if (villages.value[findVillagesIndexByName(dataVillage.value)]) village.value = villages.value[findVillagesIndexByName(dataVillage.value)].id;
            params.kelurahan = dataVillage.value;
        }

        await participantService.getParticipants(params).then((result) => {
            products.value = result.data;
            totalRecords.value = result.total;
        });
        window.localStorage.removeItem('provinsi');
        window.localStorage.removeItem('kota');
        window.localStorage.removeItem('kecamatan');
        window.localStorage.removeItem('kelurahan');
    } catch (error) {
        console.log(error);
    }
    loadingPage.value = false;
};

const confirmResetParticipant = (detailParticipant) => {
    product.value = { ...detailParticipant };
    resetDialog.value = true;
};

const confirmDeleteParticipant = (detailParticipant) => {
    product.value = { ...detailParticipant };
    deleteDialog.value = true;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2" style="display: block">
                            <Dropdown class="mr-4 mb-2" v-model="province" :options="provinces" optionValue="id" optionLabel="name" placeholder="Provinsi" @change="handleProvince" />
                            <Dropdown class="mr-4 mb-2" v-model="city" :options="cities" optionValue="id" optionLabel="name" placeholder="Kota" @change="handleCity" />
                            <Dropdown class="mr-4 mb-2" v-model="district" :options="districts" optionValue="id" optionLabel="name" placeholder="Kecamatan" @change="handleDistrict" />
                            <Dropdown class="mr-4 mb-2" v-model="village" :options="villages" optionValue="id" optionLabel="name" placeholder="Kelurahan" @change="handleVillage" />
                            <Dropdown class="mr-4 mb-2" v-model="status" :options="statuses" optionValue="code" optionLabel="name" placeholder="Status" @change="handleStatus" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" /> -->
                        <Button label="Search" class="p-button-secondary ml-2" @click="handleFilter" />
                        <Button label="Reset Filter" class="p-button-info ml-2" @click="resetFilter" />
                    </template>
                </Toolbar>

                <div>
                    <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :filters="filters" responsiveLayout="scroll" :loading="loadingPage">
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">List Penerima Sembako</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="paramSearch" placeholder="Search..." v-on:keyup="handleKeyup" />
                                </span>
                            </div>
                        </template>

                        <template #loading>
                            <ProgressSpinner />
                        </template>
                        <template #empty></template>
                        <Column v-if="user.role === 'ADMIN'" header="Action" headerStyle="min-width:26rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Action</span>
                                <router-link :to="`participant/${slotProps.data.id}`">
                                    <Button label="Detail" class="p-button-info mr-2" />
                                </router-link>

                                <Button label="Delete" class="p-button-danger mr-2" @click="confirmDeleteParticipant(slotProps.data)" />
                                <Button label="Reset" class="p-button-primary mr-2" @click="confirmResetParticipant(slotProps.data)" />
                                <router-link :to="`participant/edit/${slotProps.data.id}`">
                                    <Button label="Edit" class="p-button-secondary mt-2" />
                                </router-link>
                            </template>
                        </Column>

                        <Column header="Action" headerStyle="min-width:6rem;" v-else>
                            <template #body="slotProps">
                                <span class="p-column-title">Action</span>
                                <router-link :to="`participant/${slotProps.data.id}`">
                                    <Button label="Detail" class="p-button-info mr-2" />
                                </router-link>
                            </template>
                        </Column>
                        <Column field="no" header="No" :sortable="false" headerStyle="width:14%; min-width:4rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">No</span>
                                {{ slotProps.index + 1 + indexPage }}
                            </template>
                        </Column>
                        <Column field="name" header="Nama Penerima" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nama Penerima</span>
                                {{ slotProps.data.name }}
                            </template>
                        </Column>
                        <Column field="nik" header="NIK" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">NIK</span>
                                {{ slotProps.data.nik }}
                            </template>
                        </Column>
                        <Column field="gender" header="Jenis Kelamin" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Jenis Kelamin</span>
                                {{ slotProps.data.gender }}
                            </template>
                        </Column>
                        <Column field="phone" header="No Handphone" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">No Handphone</span>
                                {{ slotProps.data.phone }}
                            </template>
                        </Column>
                        <Column field="address" header="Alamat Sesuai KTP" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Alamat Sesuai KTP</span>
                                <text-clamp :text="slotProps.data.address" :max-lines="2" />
                            </template>
                        </Column>
                        <Column field="rt" header="RT" :sortable="false" headerStyle="width:14%; min-width:4rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">RT</span>
                                {{ slotProps.data.rt }}
                            </template>
                        </Column>
                        <Column field="rw" header="RW" :sortable="false" headerStyle="width:14%; min-width:4rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">RW</span>
                                {{ slotProps.data.rw }}
                            </template>
                        </Column>
                        <Column field="provinsi" header="Provinsi" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Provinsi</span>
                                {{ slotProps.data.provinsi }}
                            </template>
                        </Column>
                        <Column field="kota" header="Kota" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kota</span>
                                {{ slotProps.data.kota }}
                            </template>
                        </Column>
                        <Column field="kecamatan" header="Kecamatan" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kecamatan</span>
                                {{ slotProps.data.kecamatan }}
                            </template>
                        </Column>
                        <Column field="kelurahan" header="Kelurahan" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kelurahan</span>
                                {{ slotProps.data.kelurahan }}
                            </template>
                        </Column>
                        <Column field="kode_pos" header="Kode POS" :sortable="false" headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kode POS</span>
                                {{ slotProps.data.kode_pos }}
                            </template>
                        </Column>
                        <Column field="residence_address" header="Alamat Domisili" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Alamat Domisili</span>
                                <text-clamp :text="slotProps.data.residence_address" :max-lines="2" />
                            </template>
                        </Column>
                        <Column field="residence_rt" header="RT" :sortable="false" headerStyle="width:14%; min-width:4rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">RT</span>
                                {{ slotProps.data.residence_rt }}
                            </template>
                        </Column>
                        <Column field="residence_rw" header="RW" :sortable="false" headerStyle="width:14%; min-width:4rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">RW</span>
                                {{ slotProps.data.residence_rw }}
                            </template>
                        </Column>
                        <Column field="residence_provinsi" header="Provinsi" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Provinsi</span>
                                {{ slotProps.data.residence_provinsi }}
                            </template>
                        </Column>
                        <Column field="residence_kota" header="Kota" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kota</span>
                                {{ slotProps.data.residence_kota }}
                            </template>
                        </Column>
                        <Column field="residence_kecamatan" header="Kecamatan" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kecamatan</span>
                                {{ slotProps.data.residence_kecamatan }}
                            </template>
                        </Column>
                        <Column field="residence_kelurahan" header="Kelurahan" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kelurahan</span>
                                {{ slotProps.data.residence_kelurahan }}
                            </template>
                        </Column>
                        <Column field="residence_kode_pos" header="Kode POS" :sortable="false" headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Kode POS</span>
                                {{ slotProps.data.residence_kode_pos }}
                            </template>
                        </Column>
                        <Column field="residence_status" header="Status" :sortable="false" headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                {{ generateStatus(slotProps.data.status) }}
                            </template>
                        </Column>
                        <Column field="residence_status" header="Petugas" :sortable="false" headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.updated_by }}
                            </template>
                        </Column>
                        <template #footer>
                            <Paginator
                                v-model:first="indexPage"
                                v-model:rows="rows"
                                :totalRecords="totalRecords"
                                :rowsPerPageOptions="[10, 20, 30]"
                                @page="handlePaginate"
                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} penerima"
                            />
                        </template>
                    </DataTable>

                    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="product"
                                >Are you sure you want to delete <b>{{ product.name }} {{ product.nik }}</b
                                >?</span
                            >
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteParticipant" />
                        </template>
                    </Dialog>

                    <Dialog v-model:visible="resetDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                        <div class="flex align-items-center justify-content-center">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="product"
                                >Are you sure you want to reset <b>{{ product.name }} {{ product.nik }}</b
                                >?</span
                            >
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" class="p-button-text" @click="resetDialog = false" />
                            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="resetParticipant" />
                        </template>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
