<script setup>
import { useRoute, useRouter } from 'vue-router';
import ParticipantService from '../../../service/ParticipantService';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const participant = ref({});
const participantService = new ParticipantService();
const toast = useToast();
const gugur = ref(false);
const file = ref(null);
const newParticipant = ref({});
const baseUrl = ref(import.meta.env.VITE_BACKEND_URL)
const isRejected = ref(false);

onMounted(() => {
    participantService.getParticipant(route.params.id).then((result) => (participant.value = result));
});

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const handleGugur = () => {
    gugur.value = !gugur.value;
    participant.value.status = gugur.value ? "REJECTED" : "NOT DONE"
    isRejected.value = gugur.value
};

const handleBack = () => {
    window.localStorage.setItem('provinsi', participant?.value.provinsi);
    window.localStorage.setItem('kota', participant?.value.kota);
    router.push('/participant');
};

const handleSesuai = () => {
    if (file.value === null) {
        if (gugur.value) {
            participant.value.status = 'REJECTED';
        } else {
            participant.value.status = 'PARTIAL_DONE';
        }
    } else {
        if (gugur.value) {
            participant.value.status = 'REJECTED';
        } else {
            participant.value.status = 'DONE';
        }
    }
    try {
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('name', newParticipant.value.name ? newParticipant.value.name : participant.value.name);
        formData.append('nik', newParticipant.value.nik ? newParticipant.value.nik : participant.value.nik);
        formData.append('gender', newParticipant.value.gender ? newParticipant.value.gender : participant.value.gender);
        formData.append('phone', newParticipant.value.phone ? newParticipant.value.phone : participant.value.phone);
        formData.append('address', newParticipant.value.address ? newParticipant.value.address : participant.value.address);
        formData.append('rt', newParticipant.value.rt ? newParticipant.value.rt : participant.value.rt);
        formData.append('rw', newParticipant.value.rw ? newParticipant.value.rw : participant.value.rw);
        formData.append('provinsi', newParticipant.value.provinsi ? newParticipant.value.provinsi : participant.value.provinsi);
        formData.append('kota', newParticipant.value.kota ? newParticipant.value.kota : participant.value.kota);
        formData.append('kecamatan', newParticipant.value.kecamatan ? newParticipant.value.kecamatan : participant.value.kecamatan);
        formData.append('kelurahan', newParticipant.value.kelurahan ? newParticipant.value.kelurahan : participant.value.kelurahan);
        formData.append('kode_pos', newParticipant.value.kode_pos ? newParticipant.value.kode_pos : participant.value.kode_pos);
        formData.append('residence_address', newParticipant.value.residence_address ? newParticipant.value.residence_address : participant.value.residence_address);
        formData.append('residence_rt', newParticipant.value.residence_rt ? newParticipant.value.residence_rt : participant.value.residence_rt);
        formData.append('residence_rw', newParticipant.value.residence_rw ? newParticipant.value.residence_rw : participant.value.residence_rw);
        formData.append('residence_provinsi', newParticipant.value.residence_provinsi ? newParticipant.value.residence_provinsi : participant.value.residence_provinsi);
        formData.append('residence_kota', newParticipant.value.residence_kota ? newParticipant.value.residence_kota : participant.value.residence_kota);
        formData.append('residence_kecamatan', newParticipant.value.residence_kecamatan ? newParticipant.value.residence_kecamatan : participant.value.residence_kecamatan);
        formData.append('residence_kelurahan', newParticipant.value.residence_kelurahan ? newParticipant.value.residence_kelurahan : participant.value.residence_kelurahan);
        formData.append('residence_kode_pos', newParticipant.value.residence_kode_pos ? newParticipant.value.residence_kode_pos : participant.value.residence_kode_pos);
        formData.append('status', participant.value.status);
        participantService.updateParticipant(participant.value.id, formData).then((result) => {
            toast.add({ severity: 'success', summary: 'Successful Update Penerima', detail: 'Penerima Updated', life: 3000 });
            participant.value = result;
        });

        if(participant.value.status === "REJECTED") {
          router.push('/participant')
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
    }
};

const onSelectedFiles = (event) => {
    event.files.forEach((result) => {
        file.value = result;
    });
};

const generateStatus = (value) => {
  let status
  switch (value) {
    case "NOT DONE":
      status =  "-";
      break;
    case "PARTIAL_DONE":
      status =  "Sudah Sesuai (Belum Upload Foto)";
      break;
    case "REJECTED":
      status =  "Gugur";
      break;
    case "DONE":
      status =  "Sukses Upload Foto";
      break;

  }

  return status;
};
</script>

<template>
    <Toast />
    <div className="card">
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button label="Back" class="p-button-rounded p-button-plain p-button-text p-button-text" icon="pi pi-arrow-left" @click="handleBack" />
                </div>
            </template>

            <template v-slot:end v-if="participant.status !== `DONE` ">

                <Button :label="gugur ? `Batal` : `Gugur`" class="p-button-danger ml-2" @click="handleGugur" />
                <Button label="Sesuai" class="p-button-info ml-2" @click="handleSesuai"
            /></template>
        </Toolbar>
        <div class="formgrid grid">
            <div class="field col">
                <h4>STATUS: {{ generateStatus(participant?.status) }}</h4>
                <p>Nama: {{ participant?.name }}</p>
                <p>NIK: {{ participant?.nik }}</p>
                <p>Jenis Kelamin: {{ participant?.gender }}</p>
                <p>No Handphone: {{ participant?.phone }}</p>
            </div>
            <div class="field col">
                <FileUpload v-if="participant.status !== `DONE`" name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="gugur === 1" @select="onSelectedFiles" />
              <img v-if="participant.status === `DONE`" :src="baseUrl+ `/v1/` + participant.image" height="250" alt="Logo" class="mr-2" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <p>Alamat Sesuai KTP: {{ participant?.address }}</p>
                <p>RT: {{ participant?.rt }}</p>
                <p>RW: {{ participant?.rw }}</p>
                <p>Provinsi: {{ participant?.provinsi }}</p>
                <p>Kota: {{ participant?.kota }}</p>
                <p>Kecamatan: {{ participant?.kecamatan }}</p>
                <p>Kelurahan: {{ participant?.kelurahan }}</p>
                <p>Kode POS: {{ participant?.kode_pos }}</p>
            </div>
            <div class="field col">
                <p>Alamat Domisili: {{ participant?.address }}</p>
                <p>RT: {{ participant?.rt }}</p>
                <p>RW: {{ participant?.rw }}</p>
                <p>Provinsi: {{ participant?.provinsi }}</p>
                <p>Kota: {{ participant?.kota }}</p>
                <p>Kecamatan: {{ participant?.kecamatan }}</p>
                <p>Kelurahan: {{ participant?.kelurahan }}</p>
                <p>Kode POS: {{ participant?.kode_pos }}</p>
            </div>
        </div>

        <hr />

      <div v-if="participant.status !== `DONE` && (participant.status !== `REJECTED` || isRejected)">
        <div class="formgrid grid">
          <div class="field col">
            <div class="p-fluid">
              <div class="field">
                <label for="name1">Nama Peserta</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model.trim="newParticipant.name" />
              </div>
              <div class="field">
                <label for="email1">Nomor KTP</label>
                <InputText id="email1" type="number" :required="true" :disabled="!gugur == 1" v-model.trim="newParticipant.nik" />
              </div>
              <div class="field">
                <label for="age1">Jenis Kelamin</label>
                <InputText id="age1" type="text" :disabled="!gugur == 1" v-model="newParticipant.gender" />
              </div>
              <div class="field">
                <label for="age1">No Handphone</label>
                <InputText id="age1" type="text" :disabled="!gugur == 1" v-model="newParticipant.phone" />
              </div>
            </div>
          </div>
          <div class="field col">
            <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="!gugur == 1" @select="onSelectedFiles" />
          </div>
        </div>
        <div class="formgrid grid">
          <div class="field col">
            <div class="p-fluid">
              <h5>Alamat Sesuai KTP</h5>
              <div class="field">
                <label for="name1">Alamat</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.address" />
              </div>
              <div class="field">
                <label for="email1">RT</label>
                <InputText id="email1" type="text" :disabled="!gugur == 1" v-model="newParticipant.rt" />
              </div>
              <div class="field">
                <label for="age1">RW</label>
                <InputText id="age1" type="text" :disabled="!gugur == 1" v-model="newParticipant.rw" />
              </div>
              <div class="field">
                <label for="name1">Provinsi</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.provinsi" />
              </div>
              <div class="field">
                <label for="name1">Kota</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.kota" />
              </div>
              <div class="field">
                <label for="name1">Kecamatan</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.kecamatan" />
              </div>
              <div class="field">
                <label for="name1">Kelurahan</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.kelurahan" />
              </div>
              <div class="field">
                <label for="name1">Kode POS</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.kode_pos" />
              </div>
            </div>
          </div>
          <div class="field col">
            <div class="p-fluid">
              <h5>Alamat Domisili</h5>
              <div class="field">
                <label for="name1">Alamat</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_address" />
              </div>
              <div class="field">
                <label for="email1">RT</label>
                <InputText id="email1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_rt" />
              </div>
              <div class="field">
                <label for="age1">RW</label>
                <InputText id="age1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_rw" />
              </div>
              <div class="field">
                <label for="name1">Provinsi</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_provinsi" />
              </div>
              <div class="field">
                <label for="name1">Kota</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_kota" />
              </div>
              <div class="field">
                <label for="name1">Kecamatan</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_kecamatan" />
              </div>
              <div class="field">
                <label for="name1">Kelurahan</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_kelurahan" />
              </div>
              <div class="field">
                <label for="name1">Kode POS</label>
                <InputText id="name1" type="text" :disabled="!gugur == 1" v-model="newParticipant.residence_kode_pos" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<style scoped lang="scss">
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
</style>
