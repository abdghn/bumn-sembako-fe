<script setup>
import { onMounted, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const products = ref(null);
const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
});

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
    <div class="grid">

    </div>
  </div>
    <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-center mb-3">
            <div>
              <h3 class="block text-500 font-medium mb-3">Total Penerima</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>152</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-center mb-3">
            <div>
              <h3 class="block text-500 font-medium mb-3">Done</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>152</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-center mb-3">
            <div>
              <h3 class="block text-500 font-medium mb-3">Partially Done</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>152</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-center mb-3">
            <div>
              <h3 class="block text-500 font-medium mb-3">Belum Menerima</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>152</h3> </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
          <div class="flex justify-content-center mb-3">
            <div>
              <h3 class="block text-500 font-medium mb-3">Gugur</h3>
              <div class="text-900 font-medium text-xl align-items-center justify-content-center"> <h3>152</h3> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
