<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import ParticipantService from '@/service/ParticipantService';
import RegionService from '@/service/RegionService';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const calendarValue = ref(null);
const kecamatans = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const kecamatan = ref(null);

const kelurahans = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const kelurahan = ref(null);
const statuss = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const stat = ref(null);

const participantService = new ParticipantService();
const regionService = new RegionService();

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    const params = { page: 1, size: 100 };
    // productService.getProducts().then((data) => (products.value = data));
    await regionService.getProvincies({}).then((result) => (statuses.value = result));

    const province = ref(window.localStorage.getItem('provinsi'));
    const city = ref(window.localStorage.getItem('kota'));

    if (province.value !== null) {
        province.value = province.value.toUpperCase();
        provinsi.value = statuses.value[findStatusIndexByName(province.value)].name;
        status.value = statuses.value[findStatusIndexByName(province.value)].id;
        await regionService.getRegencies({ province_id: status.value }).then((result) => (types.value = result));
        params.provinsi = provinsi.value;
    }

    if (city.value !== null) {
        city.value = city.value.toUpperCase();
        type.value = types.value[findTypeIndexByName(city.value)].name;
        params.kota = type.value;
    }

    participantService.getParticipants(params).then((result) => (products.value = result));
    window.localStorage.removeItem('provinsi');
    window.localStorage.removeItem('kota');
});

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
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

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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

const findStatusIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < statuses.value.length; i++) {
        if (statuses.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findStatusIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < statuses.value.length; i++) {
        if (statuses.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findTypeIndexByName = (name) => {
  let index = -1;
  for (let i = 0; i < types.value.length; i++) {
    if (types.value[i].name === name) {
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

const exportCSV = () => {
    dt.value.exportCSV();
};

const statuses = ref(null);
const status = ref({});

const types = ref(null);

const type = ref({});
const provinsi = ref(null);
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const handleProvinsi = () => {
    provinsi.value = statuses.value[findStatusIndexById(status.value)].name;
    regionService.getRegencies({ province_id: status.value }).then((result) => (types.value = result));
};

const resetFilter = () => {
    provinsi.value = null;
    type.value = null;
    participantService.getParticipants({ page: 1, size: 100 }).then((result) => (products.value = result));
};

const handleFilter = () => {
    const params = {
        page: 1,
        size: 100
    };

    if (provinsi.value) params.provinsi = provinsi.value;
    if (type.value) params.kota = type.value;

    participantService.getParticipants(params).then((result) => (products.value = result));
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
              <h5>Menampilkan Data : Provinsi DKI Jakarta, Kota Jakarta Selatan, Kecamatan Kebayoran Baru</h5>
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <span class="mr-8"><b>Total: 12.121</b></span>
                            <span class="mr-8"><b>Done: 7000</b></span>
                            <span class="mr-8"><b>Belum Unggah Foto: 3921</b></span>
                            <span class="mr-8"><b>Belum Menerima: 1300</b></span>
                        </div>
                    </template>
                </Toolbar>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Dropdown class="ml-3 mr-4" v-model="status" :options="statuses" optionValue="id" optionLabel="name" placeholder="Provinsi" @change="handleProvinsi" />
                            <Dropdown class="mr-4" v-model="type" :options="types" optionValue="name" optionLabel="name" placeholder="Kota" />
                            <Calendar placeholder="Pilih Tanggal" :showIcon="false" :showButtonBar="true" class="w-2 mr-4" v-model="calendarValue"></Calendar>
                            <Button label="Search" class="p-button-secondary ml-2" @click="handleFilter" />
                            <Button label="Clear Filter" class="p-button-info ml-2" @click="resetFilter" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />-->
                        <Button label="Tampilkan data" class="p-button-info ml-2" @click="resetFilter" />
                    </template>
                </Toolbar>
                  <div class="grid">
                    <div class="col-4">
                    <h5>Jam</h5>
                    <Editor v-model="value" editorStyle="height: 320px" />
                    </div>
                    <div class="col-4">
                      <h5>Evaluasi</h5>
                    <Editor v-model="value" editorStyle="height: 320px" />
                    </div>
                    <div class="col-4">
                      <h5>Solusi</h5>
                    <Editor v-model="value" editorStyle="height: 320px" />
                    </div>
                  </div>
                  <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                    <Button label="Tampilkan data" class="p-button-info ml-2" @click="resetFilter" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
