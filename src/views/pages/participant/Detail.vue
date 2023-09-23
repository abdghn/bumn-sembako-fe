<script setup>
import { useRoute, useRouter } from 'vue-router';
import ParticipantService from '../../../service/ParticipantService';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import RegionService from "../../../service/RegionService";

const route = useRoute();
const router = useRouter();
const displayConfirmationGugur = ref(false);
const displayConfirmationSesuai = ref(false);
const participant = ref({});
const participantService = new ParticipantService();
const checkboxValue = ref([]);
const toast = useToast();
const gugur = ref(false);
const file = ref(null);
const file_penerima = ref(null);
const newParticipant = ref({});
const newParticipant2 = ref({});
const isSelected = ref(false);
const baseUrl = ref(import.meta.env.VITE_BACKEND_URL);
const provinces = ref(null);
const province = ref({});
const cities = ref(null);
const districts = ref(null);
const villages = ref(null);
const isRejected = ref(false);
const genders = ref([
    { name: 'Pria', code: 'pria' },
    { name: 'Perempuan', code: 'Perempuan' }
]);
const gender = ref(null);
const jenisKelamin = ref(null);
const regionService = new RegionService()

onMounted(async () => {
    participantService.getParticipant(route.params.id).then((result) => (participant.value = result));
   await regionService.getProvincies({}).then((result) => (provinces.value = result));
});

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const handleGugur = () => {
    if (!gugur.value) {
        gugur.value = !gugur.value;
        participant.value.status = 'REJECTED';
        isRejected.value = gugur.value;
        displayConfirmationGugur.value = true;
    } else {
        participant.value.status = 'NOT DONE';
        gugur.value = !gugur.value;
    }
};

const handleBack = () => {
    window.localStorage.setItem('provinsi', participant?.value.provinsi);
    window.localStorage.setItem('kota', participant?.value.kota);
    // window.localStorage.setItem('kecamatan', participant?.value.kecamatan);
    router.push('/participant');
};

const openDialog = () => {
    displayConfirmationSesuai.value = true;
};

const findGenderIndexById = (code) => {
    let index = -1;
    for (let i = 0; i < genders.value.length; i++) {
        if (genders.value[i].code === code) {
            index = i;
            break;
        }
    }
    return index;
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
        if (file.value !== null) {
            formData.append('file', file.value);
        }
        if (file_penerima.value !== null) {
            formData.append('file_penerima', file_penerima.value);
        }
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

        if (participant.value.status === 'REJECTED') {
            router.push('/participant');
        }
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
    }
    displayConfirmationSesuai.value = false;
};

const handleSubmit = () => {
    try {
        const formData = new FormData();
        if (file.value !== null) {
            formData.append('file', file.value);
        }
        if (file_penerima.value !== null) {
            formData.append('file_penerima', file_penerima.value);
        }
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
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
    }
};

const handleCopy = () => {
    try {
        newParticipant.value = Object.assign({}, participant.value);
      newParticipant.value.provinsi = provinces.value[findProvincesIndexByName(participant.value.provinsi.toUpperCase())].id;
      newParticipant.value.kota = cities.value[findCitiesIndexByName(participant.value.kota.toUpperCase())].id;
      newParticipant.value.kecamatan = districts.value[findDistrictsIndexByName(participant.value.kecamatan.toUpperCase())].id
      newParticipant.value.kelurahan = villages.value[findVillagesIndexByName(participant.value.kelurahan.toUpperCase())].id
      newParticipant.value.residence_provinsi = provinces.value[findProvincesIndexByName(participant.value.residence_provinsi.toUpperCase())].id
      newParticipant.value.residence_kota = cities.value[findCitiesIndexByName(participant.value.residence_kota.toUpperCase())].id
      newParticipant.value.residence_kecamatan = districts.value[findDistrictsIndexByName(participant.value.residence_kecamatan.toUpperCase())].id
      newParticipant.value.residencence_kelurahan = villages.value[findVillagesIndexByName(participant.value.residence_kelurahan)].id
    } catch (e) {
        console.log(e);
    }
};

const findProvincesIndexByName = (name) => {
  let index = -1;
  for (let i = 0; i < provinces.value.length; i++) {
    if (provinces.value[i].name === name) {
      index = i;
      break;
    }
  }
  return index;
};


const findCitiesIndexByName = (name) => {
  let index = -1;
  for (let i = 0; i < cities.value.length; i++) {
    if (cities.value[i].name === name) {
      index = i;
      break;
    }
  }
  return index;
};

const findDistrictsIndexByName = (name) => {
  let index = -1;
  for (let i = 0; i < districts.value.length; i++) {
    if (districts.value[i].name === name) {
      index = i;
      break;
    }
  }
  return index;
};

const findVillagesIndexByName = (name) => {
  let index = -1;
  for (let i = 0; i < villages.value.length; i++) {
    if (villages.value[i].name === name) {
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

const handleGender = () => {
    jenisKelamin.value = participant.value.gender;
    console.log(gender.value);
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

const closeConfirmation = () => {
    displayConfirmationGugur.value = false;
    displayConfirmationSesuai.value = false;
};

const duplicateResidence = () => {
  isSelected.value = !isSelected.value
  try {
    if(isSelected.value) {
      newParticipant.value.residence_address = newParticipant.value.address
      newParticipant.value.residence_rt = newParticipant.value.rt
      newParticipant.value.residence_rw = newParticipant.value.rw
      newParticipant.value.residence_provinsi = newParticipant.value.provinsi
      newParticipant.value.residence_kota = newParticipant.value.kota
      newParticipant.value.residence_kecamatan = newParticipant.value.kecamatan
      newParticipant.value.residence_kelurahan = newParticipant.value.kelurahan
      newParticipant.value.residence_kode_pos = newParticipant.value.kode_pos

    } else {
      newParticipant.value.residence_address = null
      newParticipant.value.residence_rt = null
      newParticipant.value.residence_rw = null
      newParticipant.value.residence_provinsi = null
      newParticipant.value.residence_kota = null
      newParticipant.value.residence_kecamatan = null
      newParticipant.value.residence_kelurahan = null
      newParticipant.value.residence_kode_pos = null



    }
  } catch (e) {
    console.error(e);
  }
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

            <template v-slot:end v-if="participant.status !== `DONE`">
                <Button :label="gugur ? `Batal` : `Gugur`" class="p-button-danger ml-2" @click="handleGugur" :modal="true" />
                <Button label="Sesuai" class="p-button-info ml-2" @click="openDialog"  :disabled="gugur === true" />
            </template>
        </Toolbar>
        <div class="formgrid grid">
            <div class="field col">
                <h4>STATUS: {{ generateStatus(participant?.status) }}</h4>
                <p>Nama: {{ participant?.name }}</p>
                <p>NIK: {{ participant?.nik }}</p>
                <p>Jenis Kelamin: {{ participant?.gender }}</p>
                <p>No Handphone: +{{ participant?.phone }}</p>
            </div>
            <div class="field col">
                <h5 class="mb-2">Unggah foto dengan KTP Jelas</h5>
                <div class="mb-4">
                    <FileUpload v-if="participant.status !== `DONE`" name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="gugur === true" @select="onSelectedFiles" />
                </div>
                <img v-if="participant.status === `DONE`" :src="baseUrl + `/v1/` + participant.image" height="250" alt="Logo" class="mr-2" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col-3">
                <p>Alamat Sesuai KTP: {{ participant?.address }}</p>
                <p>RT: 0{{ participant?.rt }}</p>
                <p>RW: 0{{ participant?.rw }}</p>
                <p>Provinsi: {{ participant?.provinsi }}</p>
                <p>Kota: {{ participant?.kota }}</p>
                <p>Kecamatan: {{ participant?.kecamatan }}</p>
                <p>Kelurahan: {{ participant?.kelurahan }}</p>
                <p>Kode POS: {{ participant?.kode_pos }}</p>
            </div>
            <div class="field col-3">
                <p>Alamat Domisili: {{ participant?.address }}</p>
                <p>RT: 0{{ participant?.rt }}</p>
                <p>RW: 0{{ participant?.rw }}</p>
                <p>Provinsi: {{ participant?.provinsi }}</p>
                <p>Kota: {{ participant?.kota }}</p>
                <p>Kecamatan: {{ participant?.kecamatan }}</p>
                <p>Kelurahan: {{ participant?.kelurahan }}</p>
                <p>Kode POS: {{ participant?.kode_pos }}</p>
            </div>
            <div class="field col">
                <h5 class="mb-2 text-900">Unggah Foto Menerima Sembako Jelas</h5>
                <FileUpload v-if="participant.status !== `DONE`" name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="gugur === true" @select="onSelectedFiles" />
            </div>
        </div>

        <hr />

      <!-- <div v-if="participant.status !== `DONE` && (participant.status !== `REJECTED` || isRejected)"> -->
        <div class="formgrid grid">
            <div class="field col">
                <div class="grid my-4">
                    <div class="col-12 md:col-3">
                        <div class="field-checkbox mb-2">
                            <label for="checkOption1">Penerima Gugur</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-checkbox mb-2">
                            <Button label="SALIN DATA DARI ATAS" class="p-button-info ml-2 py-1 px-2" :disabled="!gugur === true" @click="handleCopy" />
                        </div>
                    </div>
                </div>
                <div class="p-fluid">
                    <div class="field">
                        <label for="name1">Nama Peserta Baru (Sesuai KTP)*</label>
                        <InputText id="name1" type="text" :disabled="!gugur === true" placeholder="Nama Peserta" v-model.trim="newParticipant.name" />
                    </div>
                    <div class="field">
                        <label for="ktp">Nomor KTP</label>
                        <InputNumber  id="ktp" :required="true" :disabled="!gugur === true" placeholder="No. KTP" v-model.trim="newParticipant.nik" :max="16" :useGrouping="false" />
                    </div>
                    <div class="field">
                        <label for="age1">Jenis Kelamin</label>
                        <!-- <InputText id="age1" type="text" :disabled="!gugur === true" v-model="newParticipant.gender" /> -->
                        <Dropdown class="mr-4" v-model="gender" :options="genders" :disabled="!gugur === true" optionValue="code" optionLabel="name" placeholder="Jenis Kelamin" @change="handleGender" />
                    </div>
                    <div class="field">
                        <label for="age1">No Handphone</label>
                        <InputText id="age1" type="text" :disabled="!gugur === true" placeholder="08*********" v-model="newParticipant.phone" />
                    </div>
                </div>
            </div>
            <div class="field col">
                <h5 class="mb-2">Unggah foto dengan KTP Jelas</h5>
                <div class="mb-6">
                    <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="!gugur === true" @select="onSelectedFiles" />
                </div>
                <h5 class="mb-2">Unggah Foto Menerima Sembako Jelas</h5>
                <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload :disabled="!gugur === true" @select="onSelectedFiles" />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <div class="p-fluid">
                    <h5>Alamat Sesuai KTP</h5>
                    <div class="field-checkbox mb-6">
                        <div class="mb-1"></div>
                    </div>
                    <div class="field">
                        <label for="name1">Alamat</label>
                        <InputText id="name1" type="text" :disabled="!gugur === true" placeholder="Alamat" v-model="newParticipant.address" />
                    </div>
                    <div class="grid formgrid mb-4">
                        <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                            <label for="email1" class="mb-2">RT</label>
                            <InputText id="email1" type="text" :disabled="!gugur === true" placeholder="RT" v-model="newParticipant.rt" />
                        </div>
                        <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                            <label for="age1">RW</label>
                            <InputText id="age1" type="text" :disabled="!gugur === true" placeholder="RW" v-model="newParticipant.rw" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="name1">Provinsi</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.provinsi" /> -->
                        <Dropdown class="mr-4" v-model="newParticipant.provinsi" :options="provinces" :disabled="!gugur === true" optionValue="id" optionLabel="name" placeholder="Provinsi" />
                    </div>
                    <div class="field">
                        <label for="name1">Kota</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kota" /> -->
                        <Dropdown class="mr-4" v-model="city" :options="cities" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kota" />
                    </div>
                    <div class="field">
                        <label for="name1">Kecamatan</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kecamatan" /> -->
                        <Dropdown class="mr-4" v-model="subdistrict" :disabled="!gugur === true" :options="subdistricts" optionValue="name" optionLabel="name" placeholder="Kecamatan" />
                    </div>
                    <div class="field">
                        <label for="name1">Kelurahan</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kelurahan" /> -->
                        <Dropdown class="mr-4" v-model="ward" :options="wards" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kelurahan" />
                    </div>
                    <div class="field">
                        <label for="name1">Kode POS</label>
                         <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kode_pos" />
<!--                        <Dropdown class="mr-4" v-model="poscode" :options="poscodes" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kode POS" />-->
                    </div>
                </div>
            </div>
            <div class="field col">
                <div class="p-fluid">
                    <h5>Alamat Domisili</h5>
                    <div class="field-checkbox mb-4">
                        <Checkbox id="checkOption2" name="option" :disabled="!gugur === true" :value="newParticipant2"  v-model="checkboxValue" @change="duplicateResidence"/>
                        <label for="checkOption2">Alamat sesuai KTP</label>
                    </div>
                    <div class="field">
                        <label for="name1">Alamat</label>
                        <InputText id="name1" type="text" :disabled="!gugur === true" placeholder="Alamat" v-model="newParticipant.residence_address" />
                    </div>
                    <div class="grid formgrid mb-4">
                        <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                            <label for="email1">RT</label>
                            <InputText id="email1" type="text" :disabled="!gugur === true" placeholder="RT" v-model="newParticipant.residence_rt" />
                        </div>
                        <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                            <label for="age1">RW</label>
                            <InputText id="age1" type="text" :disabled="!gugur === true" placeholder="RW" v-model="newParticipant.residence_rw" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="name1">Provinsi</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_provinsi" /> -->
                        <Dropdown class="mr-4" v-model="province" :options="provinces" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Provinsi" />
                    </div>
                    <div class="field">
                        <label for="name1">Kota</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kota" /> -->
                        <Dropdown class="mr-4" v-model="city" :options="cities" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kota" />
                    </div>
                    <div class="field">
                        <label for="name1">Kecamatan</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kecamatan" /> -->
                        <Dropdown class="mr-4" v-model="subdistrict" :options="subdistricts" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kecamatan" />
                    </div>
                    <div class="field">
                        <label for="name1">Kelurahan</label>
                        <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kelurahan" /> -->
                        <Dropdown class="mr-4" v-model="ward" :options="wards" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kelurahan" />
                    </div>
                    <div class="field">
                        <label for="name1">Kode POS</label>
                         <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kode_pos" />
                    </div>
                </div>
                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                    <Button label="Submit" @click="handleSubmit" class="p-button-info mr-4"  :disabled="!gugur === true" />
                </div>
            </div>
        </div>
        <!-- </div> -->
        <!-- dialog gugur -->
        <Dialog header="Confirmation" v-model:visible="displayConfirmationGugur" :style="{ width: '550px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <h5 class="text-center">Apakah anda yakin mengubah ke status <b>GUGUR?</b></h5>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-danger" />
                <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="p-button-success" autofocus />
            </template>
        </Dialog>
        <!-- dialog -->
        <!-- dialog Terima -->
        <Dialog header="Confirmation" v-model:visible="displayConfirmationSesuai" :style="{ width: '550px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <h5 class="text-center">Apakah data penerima sudah <b>SESUAI</b> ?</h5>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-danger" />
                <Button label="Yes" icon="pi pi-check" @click="handleSesuai" class="p-button-success" autofocus />
            </template>
        </Dialog>
        <!-- dialog -->
    </div>
</template>

<style scoped lang="scss">
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}
</style>
