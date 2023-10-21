<script setup>
import {onMounted, ref} from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const userData = ref(window.localStorage.getItem("userData"))
const model = ref([]);


onMounted(() => {
  if(userData.value) {
    const user = JSON.parse(userData.value)
    if (user.role === "ADMIN") {
      model.value = [
        {
          label: 'Dashboard',
          items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Import Data', icon: 'pi pi-file-import', to: '/import' },
            { label: 'Penerima Sembako', icon: 'pi pi-fw pi-inbox', to: '/participant' },
            { label: 'Buat Laporan', icon: 'pi pi-fw pi-file', to: '/report' }
          ]
        },
        {
          label: 'Setting',
          items: [{ label: 'List User', icon: 'pi pi-fw pi-user', to: '/user' }]
        }
      ]

    } else if(user.role === "STAFF-LAPANGAN") {
      model.value = [
        {
          label: 'Dashboard',
          items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Penerima Sembako', icon: 'pi pi-fw pi-inbox', to: '/participant' },
          ]
        }
      ]
    } else if(user.role === 'ADMIN-EO') {
      model.value = [
        {
          label: 'Dashboard',
          items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Penerima Sembako', icon: 'pi pi-fw pi-inbox', to: '/participant' },
            { label: 'Buat Laporan', icon: 'pi pi-fw pi-file', to: '/report' }
          ]
        },
      ]
    }
  }
})
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
