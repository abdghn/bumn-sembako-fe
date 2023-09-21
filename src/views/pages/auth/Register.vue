<script setup>
import { ref, computed, onMounted } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import AuthService from '@/service/AuthService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import OrganizationService from '@/service/OrganizationService';
import RegionService from '@/service/RegionService';

const authService = new AuthService();
const username = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();
const name = ref('');
const confirmedPassword = ref('');

const provinces = ref(null);
const province = ref({});
const provinsi = ref(null);

const cities = ref(null);
const city = ref({});

const organizations = ref(null);
const organization = ref({});


const regionService = new RegionService();
const organizationService = new OrganizationService();

// const logoUrl = computed(() => {
//     return `layout/images/login1.png`;
// });

onMounted(async () => {
    getDataDropdown();
});


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

const getDataDropdown = async () => {
    try {
        const params = { page: 1, size: 100 };
        // productService.getProducts().then((data) => (products.value = data));
        await regionService.getProvincies({}).then((result) => (provinces.value = result));
        await organizationService.getOrganization({}).then((result) => (organizations.value = result));

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

const handleProvinsi = () => {
    provinsi.value = provinces.value[findStatusIndexById(province.value)].name;
    regionService.getRegencies({ province_id: province.value }).then((result) => (cities.value = result));
};

const handleRegister = () => {
    if (username.value && password.value) {
        authService
            .register({ username: username.value, password: password.value, name: name.value, provinsi: provinsi.value, kota: city.value, organization_id: organization.value })
            .then(() => {
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Register Success', life: 3000 });
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1000);
            })
            .catch((e) => {
                toast.add({ severity: 'error', summary: 'Failed Register', detail: 'Username/Password Invalid', life: 3000 });
            });
    } else {
        toast.add({ severity: 'error', summary: 'Failed Register', detail: 'Username/Password Required', life: 3000 });
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <h4>Halaman Registrasi</h4>
            <h2>Dashboard Bakti Sosial 2023</h2>
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5"></div>
                    <form>
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Nama Lengkap</label>
                        <InputText id="name1" type="text" placeholder="Nama Lengkap" class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="name" />

                        <label for="name1" class="block text-900 text-xl font-medium mb-2">EO</label>
                        <Dropdown v-model="organization" class="w-full md:w-30rem mb-3" :options="organizations" optionValue="id" optionLabel="name" placeholder="Select Organization"/>

                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Provinsi</label>
                        <Dropdown v-model="province" class="w-full md:w-30rem mb-3" :options="provinces" optionValue="id" optionLabel="name" placeholder="Select Provinsi" @change="handleProvinsi" />

                        <label for="name1" class="block text-900 text-xl font-medium mb-2">City</label>
                        <Dropdown v-model="city" class="w-full md:w-30rem mb-3" :options="cities" optionValue="name" optionLabel="name" placeholder="Select Kota" :disabled="!provinces" />

                        <label for="username1" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <label for="confirmPassword1" class="block text-900 font-medium text-xl mb-2">Konfirmasi Password</label>
                        <Password id="confirmPassword1" v-model="confirmedPassword" placeholder="Password" :toggleMask="false" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <Button label="Register" class="w-full p-3 text-xl" @click="handleRegister"></Button>
                        <div class="text-center mb-5">
                            <span class="text-600 font-medium line-height-3">Sudah Punya Akun?</span>
                            <router-link :to="`/auth/login`">
                                <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Ke halaman login</a>
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
