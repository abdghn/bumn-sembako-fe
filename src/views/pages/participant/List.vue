<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
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
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Dropdown class="ml-3 mr-4" v-model="status" :options="statuses" optionValue="id" optionLabel="name" placeholder="Provinsi" @change="handleProvinsi" />
                            <Dropdown class="mr-4" v-model="type" :options="types" optionValue="name" optionLabel="name" placeholder="Kota" />
                            <Dropdown class="mr-4" v-model="kecamatan" :options="kecamatans" optionValue="name" optionLabel="name" placeholder="Kecamatan" />
                            <Dropdown v-if="kecamatan" class="mr-4" v-model="kelurahan" :options="kelurahans" optionValue="name" optionLabel="name" placeholder="Kelurahan" />
                            <Dropdown v-if="kelurahan" class="mr-4" v-model="stat" :options="statuss" optionValue="name" optionLabel="name" placeholder="Status" />
                            <Button label="Search" class="p-button-secondary ml-2" @click="handleFilter" />
                            <Button label="Reset Filter" class="p-button-info ml-2" @click="resetFilter" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!--                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />-->
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">List Penerima Sembako</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>
                    <Column header="Action" headerStyle="min-width:6rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Action</span>
                            <router-link :to="`participant/${slotProps.data.id}`">
                                <Button label="Detail" class="p-button-info mr-2" />
                            </router-link>
                        </template>
                    </Column>
                    <Column field="no" header="No" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No</span>
                            {{ slotProps.index + 1 }}
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
                            {{ slotProps.data.address }}
                        </template>
                    </Column>
                    <Column field="rt" header="RT" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">RT</span>
                            {{ slotProps.data.rt }}
                        </template>
                    </Column>
                    <Column field="rw" header="RW" :sortable="false" headerStyle="width:14%; min-width:10rem;">
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
                    <Column field="kode_pos" header="Kode POS" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Kode POS</span>
                            {{ slotProps.data.kode_pos }}
                        </template>
                    </Column>
                    <Column field="residence_address" header="Alamat Domisili" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat Domisili</span>
                            {{ slotProps.data.residence_address }}
                        </template>
                    </Column>
                    <Column field="residence_rt" header="RT" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">RT</span>
                            {{ slotProps.data.residence_rt }}
                        </template>
                    </Column>
                    <Column field="residence_rw" header="RW" :sortable="false" headerStyle="width:14%; min-width:10rem;">
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
                    <Column field="residence_kode_pos" header="Kode POS" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Kode POS</span>
                            {{ slotProps.data.residence_kode_pos }}
                        </template>
                    </Column>
                    <!-- <Column header="Action" headerStyle="min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Action</span>
                            <router-link :to="`participant/${slotProps.data.id}`">
                                <Button label="Detail" class="p-button-info mr-2" />
                            </router-link>
                        </template>
                    </Column> -->
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                    <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !product.price }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">Quantity</label>
                            <InputNumber id="quantity" v-model="product.quantity" integeronly />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>