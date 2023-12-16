<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import UserService from '@/service/UserService';
import RegionService from '@/service/RegionService';
import ParticipantService from '../../../service/ParticipantService';
import moment from 'moment';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const user = ref(window.localStorage.getItem('name'));
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const userService = new UserService();
const file = ref(null);
const uploadBulkDialog = ref(false);
const isLoading = ref(false);

const provinces = ref(null);

const cities = ref(null);

const organizations = ref(null);

const types = ref([
    { name: 'EO', code: 'EO' },
    { name: 'Yayasan', code: 'Yayasan' }
]);

const type = ref('EO');

const regionService = new RegionService();
const participantService = new ParticipantService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    participantService.getLogs({ page: 1, size: 1000 }).then((result) => (products.value = result));
});

const handleUploadBulkDialog = () => {
    uploadBulkDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    uploadBulkDialog.value = false;
    submitted.value = false;
};

const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = import.meta.env.VITE_BACKEND_URL + '/template/template-penerima.xlsx';
    link.setAttribute('download', 'template.xlsx');
    link.click();
};

const exportData = (path) => {
    const link = document.createElement('a');
    link.href = import.meta.env.VITE_BACKEND_URL + '/v1/' + path;
    link.setAttribute('download', 'result.xlsx');
    link.click();
};

const saveProduct = () => {
    submitted.value = true;
    const payload = ref(Object.assign({}, product.value));
    if (product.value.name && product.value.name.trim() && product.value.username && product.value.provinsi) {
        payload.value.provinsi = provinces.value[findProvinceIndexById(payload.value.provinsi)].name;
        // payload.value.kota = cities.value[findCityIndexById(payload.value.kota)].name;
        if (product.value.id) {
            try {
                const id = payload.value.id;
                userService
                    .updateUser(payload.value.id, payload.value)
                    .then((result) => {
                        toast.add({ severity: 'success', summary: 'Successful Update User', detail: 'User Updated', life: 3000 });
                        products.value[findIndexById(id)] = result;
                        productDialog.value = false;
                        product.value = {};
                        submitted.value = false;
                    })
                    .catch(() => toast.add({ severity: 'error', summary: 'Failed update User', detail: 'Error when update User', life: 3000 }));
            } catch (e) {
                toast.add({ severity: 'error', summary: 'Failed update User', detail: 'Error when update User', life: 3000 });
            }
        } else {
            try {
                // console.log(payload);
                userService
                    .addUser(payload.value)
                    .then((result) => {
                        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                        products.value.push(result);
                        productDialog.value = false;
                        product.value = {};
                        submitted.value = false;
                    })
                    .catch(() => toast.add({ severity: 'error', summary: 'Failed add new User', detail: 'Error when add new User ', life: 3000 }));
            } catch (e) {
                toast.add({ severity: 'error', summary: 'Failed add new User', detail: 'Error when add new User ', life: 3000 });
            }
        }
    }
};

const deleteProduct = () => {
    try {
        const id = product.value.id;
        userService
            .deleteUser(id)
            .then(() => {
                products.value = products.value.filter((val) => val.id !== id);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            })
            .catch(() => toast.add({ severity: 'error', summary: 'Failed delete user', detail: 'Error when delete user', life: 3000 }));
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed delete user', detail: 'Error when delete user', life: 3000 });
    }
    deleteProductDialog.value = false;
    product.value = {};
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

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const findProvinceIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < provinces.value.length; i++) {
        if (provinces.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const onSelectedFiles = (event) => {
    event.files.forEach((result) => {
        file.value = result;
    });
};

const saveParticipants = () => {
    try {
        const formData = new FormData();
        if (file.value !== null) {
            formData.append('file', file.value);
        }
        if (file.value.size > 4000) {
            isLoading.value = true;
            formData.append('uploaded_by', user.value);
            formData.append('type', type.value);
            participantService
                .importParticipant(formData)
                .then((result) => {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Upload Bulk Success', life: 3000 });
                    products.value.unshift(result);
                    isLoading.value = false;
                    uploadBulkDialog.value = false;
                })
                .catch(() => {
                    isLoading.value = false;
                    toast.add({ severity: 'error', summary: 'Failed update CID Site', detail: 'Error Upload Data', life: 3000 });
                });
        } else {
            isLoading.value = false;
            toast.add({ severity: 'error', summary: 'Failed update CID Site', detail: 'Error Upload Data', life: 3000 });
        }
    } catch (e) {
        isLoading.value = false;
        toast.add({ severity: 'error', summary: 'Failed update CID Site', detail: 'Error Upload Data', life: 3000 });
    }
};

const handleProvinsi = () => {
    regionService.getRegencies({ province_id: provinces.value[findProvinceIndexById(product.value.provinsi)].id }).then((result) => (cities.value = result));
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2"></div>
                    </template>

                    <template v-slot:end>
                        <div class="my-2">
                            <Button label="DOWNLOAD TEMPLATE" class="p-button-secondary mr-2" @click="downloadTemplate" />
                        </div>
                        <div class="my-2">
                            <Button label="IMPORT DATA" class="p-button-secondary mr-2" @click="handleUploadBulkDialog" />
                        </div>
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} logs"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Import Data</h5>
                        </div>
                    </template>
                    <Column field="name" header="Name" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">File Name</span>
                            {{ slotProps.data.file_name }}
                        </template>
                    </Column>
                    <Column field="username" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>
                    <Column field="username" header="Created At" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Created At</span>
                            {{ moment(slotProps.data.created_at).format('DD-MM-YYYY, h:mm') }}
                        </template>
                    </Column>
                    <Column field="username" header="Total Rows" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total Rows</span>
                            {{ slotProps.data.total_rows }}
                        </template>
                    </Column>
                    <Column field="username" header="Success Rows" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Success Rows</span>
                            {{ slotProps.data.success_rows }}
                        </template>
                    </Column>
                    <Column field="username" header="Data Error" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Data Error</span>
                            <div style="color: red">
                                {{ slotProps.data.failed_rows }}
                            </div>
                        </template>
                    </Column>
                    <Column field="username" header="Uploaded By" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Uploaded By</span>
                            {{ slotProps.data.uploaded_by ? slotProps.data.uploaded_by : '-' }}
                        </template>
                    </Column>
                  <Column field="type" header="Type" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                    <template #body="slotProps">
                      <span class="p-column-title">Type</span>
                      {{ slotProps.data.type ? slotProps.data.type : '-' }}
                    </template>
                  </Column>
                    <Column header="Export" headerStyle="min-width:14rem;">
                        <template #body="slotProps">
                            <div v-if="slotProps.data.status !== 'Success All'">
                                <Button label="export data error" class="p-button-secondary mr-2" @click="exportData(slotProps.data.path)" />
                            </div>

                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" /> -->
                            <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" /> -->
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="User Detail" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">EO</label>
                        <Dropdown v-model="product.organization_id" class="w-full mb-3" :options="organizations" optionValue="id" optionLabel="name" placeholder="Select Organization" />
                    </div>
                    <div class="field">
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Provinsi</label>
                        <Dropdown v-model="product.provinsi" class="w-full mb-3" :options="provinces" optionValue="id" optionLabel="name" placeholder="Select Provinsi" @change="handleProvinsi" />
                    </div>
                    <div class="field">
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">City</label>
                        <Dropdown v-model="product.kota" class="w-full mb-3" :options="cities" optionValue="name" optionLabel="name" placeholder="Select Kota" :disabled="!provinces" />
                    </div>
                    <div class="field">
                        <label for="username">Username</label>
                        <InputText id="username" v-model.trim="product.username" required="true" autofocus :class="{ 'p-invalid': submitted && !product.username }" />
                        <small class="p-invalid" v-if="submitted && !product.username">Username is required.</small>
                    </div>
                    <div class="field">
                        <label for="New Password">New Password</label>
                        <InputText type="password" id="password" v-model.trim="product.password" required="true" autofocus :class="{ 'p-invalid': submitted && !product.password }" />
                        <small class="p-invalid" v-if="submitted && !product.password">Password is required.</small>
                    </div>
                    <div class="field">
                        <label for="confirmpassword">Confirm Password</label>
                        <InputText type="password" id="confirmpassword" v-model.trim="product.confirmpassword" required="true" autofocus :class="{ 'p-invalid': submitted && !product.confirmpassword }" />
                        <small class="p-invalid" v-if="submitted && !product.confirmpassword">Confirm Password is required.</small>
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

    <Dialog v-model:visible="uploadBulkDialog" :style="{ width: '450px' }" header="Upload Data" :modal="true" class="p-fluid">
        <div v-if="isLoading" style="display: flex">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>
        <div v-else>
            <div class="field">
                <label for="type">Type</label>
                <Dropdown v-model="type" :options="types" optionValue="code" optionLabel="name" placeholder="Type" />
            </div>

            <div class="field">
                <label for="file">File</label>
                <FileUpload mode="basic" :multiple="false" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :maxFileSize="10000000" customUpload @select="onSelectedFiles" />
            </div>
        </div>
        <template v-if="isLoading" #footer>
            <Button label="Cancel" class="p-button-danger" @click="hideDialog" disabled />
            <Button label="Save" class="p-button-info" @click="saveParticipants" disabled />
        </template>
        <template v-else #footer>
            <Button label="Cancel" class="p-button-danger" @click="hideDialog" />
            <Button label="Save" class="p-button-info" @click="saveParticipants" />
        </template>
    </Dialog>
</template>

<style scoped lang="scss"></style>