<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import AuthService from "@/service/AuthService";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";


const authService = new AuthService();
const username = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();
const errors = ref(null);

const logoUrl = computed(() => {
    return `layout/images/login1.png`;
});

const handleLogin = () => {
  if(username.value && password.value) {
    authService.login({username: username.value, password: password.value})
        .then((result) => {
          window.localStorage.setItem("token", result.token)
          window.localStorage.setItem("name", result.user)
          toast.add({ severity: 'success', summary: 'Successful', detail: 'Login Success', life: 3000 })
          router.push('/')
        })
        .catch((e) =>  {
          errors.value = e.response.status
          toast.add({ severity: 'error', summary: 'Failed Login', detail: 'Username/Password Invalid', life: 3000 })
        })

  } else {
    toast.add({ severity: 'error', summary: 'Failed Login', detail: 'Username/Password Required', life: 3000 })
  }
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
          <h2>Dashboard Bakti Sosial 2023</h2>
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
<!--                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />-->
<!--                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>-->
<!--                        <span class="text-600 font-medium">Sign in to continue</span>-->
                    </div>

                    <div>
                        <label for="username1" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <div v-if="errors" class="my-4 text-center" style="font-style: italic; color: #E92121;">
                          <span>Anda sudah gagal login sebanyak 3x, mohon hubungi Admin</span>
                        </div>
                        <div v-if="errors">
                          <Button label="Sign In" class="w-full p-3 text-xl" @click="handleLogin" disabled/>
                        </div>
                        <div v-else>
                          <Button label="Sign In" class="w-full p-3 text-xl" @click="handleLogin" />
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
