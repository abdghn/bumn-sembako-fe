<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import AuthService from '@/service/AuthService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const authService = new AuthService();
const username = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();
const name = ref('');
const confirmedPassword = ref('');

const logoUrl = computed(() => {
    return `layout/images/login1.png`;
});

const handleRegister = () => {
    if (username.value && password.value) {
        authService
            .register({ username: username.value, password: password.value, name: name.value })
            .then(() => {
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Register Success', life: 3000 });
                router.push('/auth/login');
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
                    <div>
                        <label for="name1" class="block text-900 text-xl font-medium mb-2">Nama Lengkap</label>
                        <InputText id="name1" type="text" placeholder="" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" />

                        <label for="username1" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

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
                    </div>
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
