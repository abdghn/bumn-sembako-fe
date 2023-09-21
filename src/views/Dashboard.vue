<script setup>
import { onMounted, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import DashboardService from '@/service/DashboardService';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const products = ref(null);
const lineOptions = ref(null);
const detail = ref(null);
const productService = new ProductService();
const dashboardService = new DashboardService();

// Method
onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
    getDetail();
});

const getDetail = async () => {
  try {
    await dashboardService.dashboard({}).then((data) => (detail.value = data));
  } catch (e) {
    console.log(e)
  }
};

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
  <div className="card">
    <h3 class="text-center">Dashboard Bakti Sosial 2023</h3>
  </div>
  <div className="card">
      <h3 class="text-left">Total Sembako di kota anda : 0</h3>
  </div>
    <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0" :style="{ 'height': '100%'}">
          <div class="flex justify-content-center mb-3">
            <div class="text-center">
              <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Total Penerima Bantuan Kota Anda</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>{{detail?.tota_penerima}}</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0" :style="{ 'height': '100%'}">
          <div class="flex justify-content-center mb-3">
            <div class="text-center">
              <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Sudah Menerima Bantuan</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>{{detail?.total_sudah_menerima}}</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0" :style="{ 'height': '100%'}">
          <div class="flex justify-content-center mb-3">
            <div class="text-center">
              <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Belum Unggah Foto Penerima Bantuan</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>{{detail?.total_partial_done}}</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0" :style="{ 'height': '100%'}">
          <div class="flex justify-content-center mb-3">
            <div class="text-center">
              <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Belum Menerima Bantuan</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>{{detail?.total_belum_menerima}}</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0" :style="{ 'height': '100%'}">
          <div class="flex justify-content-center mb-3">
            <div class="text-center">
              <h3 class="block text-500 font-medium mb-3" :style="{ 'font-size': '20px' }">Data Tidak Sesuai</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>{{detail?.total_data_gugur}}</h3> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
