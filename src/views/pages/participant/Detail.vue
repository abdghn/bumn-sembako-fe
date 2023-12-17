<script setup>
import { useRoute, useRouter } from 'vue-router';
import ParticipantService from '../../../service/ParticipantService';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import RegionService from '../../../service/RegionService';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const route = useRoute();
const router = useRouter();
const displayConfirmationGugur = ref(false);
const displayConfirmationSesuai = ref(false);
const displayConfirmationSubmit = ref(false);
const participant = ref({});
const submitted = ref(false);
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
const provinces = ref([]);
const cities = ref([]);
const residence_cities = ref([]);
const districts = ref([]);
const residence_districts = ref([]);
const villages = ref([]);
const residence_villages = ref([]);
const isRejected = ref(false);
const genders = ref([
    { name: 'Laki-laki', code: 'Laki-laki' },
    { name: 'Perempuan', code: 'Perempuan' }
]);
const gender = ref(null);
const jenisKelamin = ref(null);
const regionService = new RegionService();
const user = ref(window.localStorage.getItem('name'));
const status = ref(null);
const loading = ref(false);

onMounted(async () => {
    await participantService
        .getParticipant(route.params.id)
        .then((result) => (participant.value = result))
        .then(() => (status.value = participant.value.status));
    await regionService.getProvincies({}).then((result) => (provinces.value = result));
});

// const onUpload = () => {
//     toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
// };

const handleGugur = () => {
    if (!gugur.value) {
        gugur.value = !gugur.value;
        status.value = participant.value.status;
        participant.value.status = 'TEMPORARY REJECTED';
        isRejected.value = gugur.value;
        displayConfirmationGugur.value = true;
    } else {
        participant.value.status = status.value;
        gugur.value = !gugur.value;
    }
};

const handleBack = () => {
    window.localStorage.setItem('provinsi', participant?.value.provinsi);
    window.localStorage.setItem('kota', participant?.value.kota);
    window.localStorage.setItem('kecamatan', participant?.value.kecamatan);
    window.localStorage.setItem('kelurahan', participant?.value.kelurahan);
    router.push('/participant');
};

const openDialog = () => {
    displayConfirmationSesuai.value = true;
};

const openDialogSubmit = () => {
    displayConfirmationSubmit.value = true;
};

const handleSesuai = () => {
    loading.value = true;
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

        formData.append('name', participant.value.name);
        formData.append('nik', participant.value.nik);
        formData.append('gender', participant.value.gender);
        formData.append('phone', participant.value.phone);
        formData.append('address', participant.value.address);
        formData.append('rt', participant.value.rt);
        formData.append('rw', participant.value.rw);
        formData.append('provinsi', participant.value.provinsi);
        formData.append('kota', participant.value.kota);
        formData.append('kecamatan', participant.value.kecamatan);
        formData.append('kelurahan', participant.value.kelurahan);
        formData.append('kode_pos', participant.value.kode_pos);
        formData.append('residence_address', participant.value.residence_address);
        formData.append('residence_rt', participant.value.residence_rt);
        formData.append('residence_rw', participant.value.residence_rw);
        formData.append('residence_provinsi', participant.value.residence_provinsi);
        formData.append('residence_kota', participant.value.residence_kota);
        formData.append('residence_kecamatan', participant.value.residence_kecamatan);
        formData.append('residence_kelurahan', participant.value.residence_kelurahan);
        formData.append('residence_kode_pos', participant.value.residence_kode_pos);
        formData.append('status', participant.value.status);
        formData.append('updated_by', user.value);
        formData.append('type', participant.value.type);

        participantService
            .updateParticipant(participant.value.id, formData)
            .then((result) => {
                toast.add({ severity: 'success', summary: 'Successful Update Penerima', detail: 'Penerima Updated', life: 3000 });
                loading.value = false;
                displayConfirmationSesuai.value = false;
                displayConfirmationSubmit.value = false;
                participant.value = result;
            })
            .catch(() => {
                loading.value = false;
                toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
            });

        if (participant.value.status === 'REJECTED') {
            router.push('/participant');
        }
    } catch (e) {
        loading.value = false;
        toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
    }

    loading.value = false;
    displayConfirmationSesuai.value = false;
    displayConfirmationSubmit.value = false;
};

const handleSubmits = async () => {
    submitted.value = true;

    try {
        loading.value = true;
        const formData = new FormData();
        if (file.value !== null) {
            formData.append('file', file.value);
        }
        if (file_penerima.value !== null) {
            formData.append('file_penerima', file_penerima.value);
        }
        formData.append('name', newParticipant.value.name);
        formData.append('nik', newParticipant.value.nik);
        formData.append('gender', newParticipant.value.gender);
        formData.append('phone', newParticipant.value.phone);
        formData.append('address', newParticipant.value.address);
        formData.append('rt', newParticipant.value.rt);
        formData.append('rw', newParticipant.value.rw);
        formData.append('provinsi', provinces.value[findProvincesIndexById(newParticipant.value.provinsi)].name);
        formData.append('kota', cities.value[findCitiesIndexById(newParticipant.value.kota)].name);
        formData.append('kecamatan', districts.value[findDistrictsIndexById(newParticipant.value.kecamatan)].name);
        formData.append('kelurahan', villages.value[findVillagesIndexById(newParticipant.value.kelurahan)].name);
        formData.append('kode_pos', newParticipant.value.kode_pos);
        formData.append('residence_address', newParticipant.value.residence_address);
        formData.append('residence_rt', newParticipant.value.residence_rt);
        formData.append('residence_rw', newParticipant.value.residence_rw);
        formData.append('residence_provinsi', provinces.value[findProvincesIndexById(newParticipant.value.residence_provinsi)].name);
        formData.append('residence_kota', residence_cities.value[findResidenceCitiesIndexById(newParticipant.value.residence_kota)].name);
        formData.append('residence_kecamatan', residence_districts.value[findResidenceDistrictsIndexById(newParticipant.value.residence_kecamatan)].name);
        formData.append('residence_kelurahan', residence_villages.value[findResidenceVillagesIndexById(newParticipant.value.residence_kelurahan)].name);
        formData.append('residence_kode_pos', newParticipant.value.residence_kode_pos);
        formData.append('status', 'REJECTED');
        formData.append('updated_by', user.value);
        formData.append('type', newParticipant.value.type);

        participantService
            .updateParticipant(participant.value.id, formData)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Successful Update Penerima', detail: 'Penerima Updated', life: 3000 });
                loading.value = false;

                if (!loading.value) {
                    setTimeout(() => router.push('/participant'), 2000);
                }
            })
            .catch((e) => {
              console.log(e)
              loading.value = false;
              if (e?.response?.data?.message === 'NIK already exists') {
                toast.add({ severity: 'error', summary: 'Failed update penerima', detail: e?.response?.data?.message, life: 3000 });
              } else {
                toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
              }
            })
    } catch (e) {
        loading.value = false;
        toast.add({ severity: 'error', summary: 'Failed update penerima', detail: 'Error when update penerima', life: 3000 });
    }
    loading.value = false;
};

const handleCopy = async () => {
    try {
        newParticipant.value = Object.assign({}, participant.value);
        newParticipant.value.provinsi = provinces.value[findProvincesIndexByName(newParticipant.value.provinsi)].id;
        if (newParticipant.value.provinsi) {
            await regionService.getRegencies({ province_id: newParticipant.value.provinsi }).then((result) => (cities.value = result));
            await regionService.getDistrict({ regency_id: cities.value[findCitiesIndexByName(newParticipant.value.kota)].id }).then((result) => (districts.value = result));
            await regionService.getVillage({ district_id: districts.value[findDistrictsIndexByName(newParticipant.value.kecamatan)].id }).then((result) => (villages.value = result));
        }

        newParticipant.value.residence_provinsi = provinces.value[findProvincesIndexByName(newParticipant.value.residence_provinsi)].id;
        if (newParticipant.value.residence_provinsi) {
            await regionService.getRegencies({ province_id: newParticipant.value.residence_provinsi }).then((result) => (residence_cities.value = result));
            await regionService.getDistrict({ regency_id: residence_cities.value[findResidenceCitiesIndexByName(newParticipant.value.residence_kota)].id }).then((result) => (residence_districts.value = result));
            await regionService.getVillage({ district_id: residence_districts.value[findResidenceDistrictsIndexByName(newParticipant.value.residence_kecamatan)].id }).then((result) => (residence_villages.value = result));
        }
        newParticipant.value.kota = cities.value[findCitiesIndexByName(newParticipant.value.kota)].id;
        newParticipant.value.kecamatan = districts.value[findDistrictsIndexByName(newParticipant.value.kecamatan)].id;
        newParticipant.value.kelurahan = villages.value[findVillagesIndexByName(newParticipant.value.kelurahan)].id;

        newParticipant.value.residence_kota = residence_cities.value[findResidenceCitiesIndexByName(newParticipant.value.residence_kota)].id;
        newParticipant.value.residence_kecamatan = residence_districts.value[findResidenceDistrictsIndexByName(newParticipant.value.residence_kecamatan)].id;
        newParticipant.value.residence_kelurahan = residence_villages.value[findResidenceVillagesIndexByName(newParticipant.value.residence_kelurahan)].id;
    } catch (e) {
        console.log(e);
    }
};

const findProvincesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < provinces.value.length; i++) {
        if (provinces.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
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

const findCitiesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < cities.value.length; i++) {
        if (cities.value[i].id === id) {
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

const findResidenceCitiesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < residence_cities.value.length; i++) {
        if (residence_cities.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findResidenceCitiesIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < residence_cities.value.length; i++) {
        if (residence_cities.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findResidenceDistrictsIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < residence_districts.value.length; i++) {
        if (residence_districts.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findResidenceDistrictsIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < residence_districts.value.length; i++) {
        if (residence_districts.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const findDistrictsIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < districts.value.length; i++) {
        if (districts.value[i].id === id) {
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

const findVillagesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < villages.value.length; i++) {
        if (villages.value[i].id === id) {
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

const findResidenceVillagesIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < residence_villages.value.length; i++) {
        if (residence_villages.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const findResidenceVillagesIndexByName = (name) => {
    let index = -1;
    for (let i = 0; i < residence_villages.value.length; i++) {
        if (residence_villages.value[i].name === name) {
            index = i;
            break;
        }
    }
    return index;
};

const handleProvinsi = () => {
    regionService.getRegencies({ province_id: newParticipant.value.provinsi }).then((result) => (cities.value = result));
    cities.value = null;
    districts.value = null;
    villages.value = null;
};

const handleResidenceProvinsi = () => {
    regionService.getRegencies({ province_id: newParticipant.value.residence_provinsi }).then((result) => (residence_cities.value = result));
    residence_cities.value = null;
    residence_districts.value = null;
    residence_villages.value = null;
};

const handleKota = () => {
    regionService.getDistrict({ regency_id: newParticipant.value.kota }).then((result) => (districts.value = result));
};

const handleResidenceKota = () => {
    regionService.getDistrict({ regency_id: newParticipant.value.residence_kota }).then((result) => (residence_districts.value = result));
};

const handleKecamatan = () => {
    regionService.getVillage({ district_id: newParticipant.value.kecamatan }).then((result) => (villages.value = result));
};

const handleResidenceKecamatan = () => {
    regionService.getVillage({ district_id: newParticipant.value.residence_kecamatan }).then((result) => (residence_villages.value = result));
};

const onSelectedFiles = (event) => {
    event.files.forEach((result) => {
        file.value = result;
    });
};

const onSelectedFilesPenerima = (event) => {
    event.files.forEach((result) => {
        file_penerima.value = result;
    });
};

const handleGender = () => {
    jenisKelamin.value = participant.value.gender;
    console.log(gender.value);
};

const generateStatus = (value) => {
    let status;
    switch (value) {
        case 'NOT DONE':
            status = 'Calon Penerima';
            break;
        case 'PARTIAL_DONE':
            status = 'Sudah Sesuai (Harap Upload Foto)';
            break;
        case 'TEMPORARY REJECTED':
            status = 'Gugur';
            break;
        case 'REJECTED':
            status = 'Gugur';
            break;
        case 'DONE':
            status = 'Sukses Upload Foto';
            break;
        default:
            break;
    }

    return status;
};

const closeConfirmation = () => {
    displayConfirmationGugur.value = false;
    displayConfirmationSesuai.value = false;
    displayConfirmationSubmit.value = false;
};

const duplicateResidence = () => {
    isSelected.value = !isSelected.value;
    try {
        if (isSelected.value) {
            newParticipant.value.residence_address = newParticipant.value.address;
            newParticipant.value.residence_rt = newParticipant.value.rt;
            newParticipant.value.residence_rw = newParticipant.value.rw;
            newParticipant.value.residence_provinsi = newParticipant.value.provinsi;
            newParticipant.value.residence_kota = newParticipant.value.kota;
            newParticipant.value.residence_kecamatan = newParticipant.value.kecamatan;
            newParticipant.value.residence_kelurahan = newParticipant.value.kelurahan;
            newParticipant.value.residence_kode_pos = newParticipant.value.kode_pos;
            residence_cities.value = cities.value;
            residence_districts.value = districts.value;
            residence_villages.value = villages.value;
        } else {
            newParticipant.value.residence_address = null;
            newParticipant.value.residence_rt = null;
            newParticipant.value.residence_rw = null;
            newParticipant.value.residence_provinsi = null;
            newParticipant.value.residence_kota = null;
            newParticipant.value.residence_kecamatan = null;
            newParticipant.value.residence_kelurahan = null;
            newParticipant.value.residence_kode_pos = null;
            residence_cities.value = null;
            residence_districts.value = null;
            residence_villages.value = null;
        }
    } catch (e) {
        console.error(e);
    }
};

// -------- validation --------

const phoneRegex = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g;

const schema = yup.object().shape({
    name: yup.string().required('Isi nama lengkap sesuai kartu identitas').label('name'),
    nik: yup.string().required().max(16, 'Masukan 16 Karakter').label('nik'),
    phone: yup.string().required().matches(phoneRegex, 'Phone number is not valid'),
    jkel: yup.string().required('Pilih Jenis Kelamin ').label('jenis kelamin'),
    address: yup.string().required(),
    rt: yup.string().required().label('rt'),
    rw: yup.string().required().label('rw'),
    provinsi: yup.string().required().label('provinsi'),
    kota: yup.string().required().label('kota'),
    kecamatan: yup.string().required().label('kecamatan'),
    kelurahan: yup.string().required().label('kelurahan'),
    kode_pos: yup.string().required().max(5, 'Masukan 5 Karakter').label('kode pos'),
    residence_address: yup.string().required(),
    residence_rt: yup.string().required().label('rt'),
    residence_rw: yup.string().required().label('rw'),
    residence_provinsi: yup.string().required().label('provinsi'),
    residence_kota: yup.string().required().label('kota'),
    residence_kecamatan: yup.string().required().label('kecamatan'),
    residence_kelurahan: yup.string().required().label('kelurahan'),
    residence_kode_pos: yup.string().required().max(5, 'Masukan 5 Karakter').label('kode pos'),
    file: yup
        .mixed()
        .required('Unggah Foto Dengan KTP Terlebih Dahulu')
        .label('file')
        .test('fileSize', 'File Terlalu Besar', (value) => {
            if (!value.length) return true; // attachment is optional
            return value[0].size <= 2000000;
        }),
    file_penerima: yup
        .mixed()
        .required('Unggah Foto Menerima Sembako Terlebih Dahulu')
        .label('file_penerima')
        .test('fileSize', 'File Terlalu Besar', (value) => {
            if (!value.length) return true; // attachment is optional
            return value[0].size <= 2000000;
        })
});

const { defineComponentBinds, errors, handleSubmit, defineInputBinds } = useForm({
    validationSchema: schema
});

// function required(value) {
//     return value ? true : 'This field is required';
// }

// const { defineComponentBinds, defineInputBinds, handleSubmit, errors } = useForm({
//   validationSchema: {
//     tests: required,
//   },
// });

// Define fields
// const tests = defineInputBinds('tests');

const onSubmit = handleSubmit((values) => {
    // Submit to API
    console.log(values);
});

const name = defineComponentBinds('name');
const nik = defineComponentBinds('nik');
const phone = defineComponentBinds('phone');
const jkel = defineComponentBinds('jkel');
const address = defineComponentBinds('address');
const rt = defineComponentBinds('rt');
const rw = defineComponentBinds('rw');
const kode_pos = defineComponentBinds('kode_pos');
const residence_address = defineComponentBinds('residence_address');
const residence_rt = defineComponentBinds('residence_rt');
const residence_rw = defineComponentBinds('residence_rw');
const residence_kode_pos = defineComponentBinds('residence_kode_pos');
const provinsi = defineComponentBinds('provinsi');
const kota = defineComponentBinds('kota');
const kecamatan = defineComponentBinds('kecamatan');
const kelurahan = defineComponentBinds('kelurahan');

const residence_provinsi = defineComponentBinds('residence_provinsi');
const residence_kota = defineComponentBinds('residence_kota');
const residence_kecamatan = defineComponentBinds('residence_kecamatan');
const residence_kelurahan = defineComponentBinds('residence_kelurahan');

// const file = defineComponentBinds('file');
// const file_penerima = defineComponentBinds('file_penerima');

// const filez = defineComponentBinds('file');
// const onSubmit = handleSubmit((values) => {
//   console.log('Submitted with', values);
// });

// const options = ['Enterprise', 'Pro', 'Freelance'].map((o) => ({
//   name: o,
//   value: o.toLowerCase(),
// }));

// TODO: Rapihin Field dan Button
</script>

<template>
    <Toast />
    <div class="card">
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button label="Back" class="p-button-rounded p-button-plain p-button-text p-button-text" icon="pi pi-arrow-left" @click="handleBack" />
                </div>
            </template>

            <template v-slot:end v-if="participant.status !== `DONE` && participant.status !== `REJECTED`">
                <Button :label="gugur ? `Batal` : `Gugur`" class="p-button-danger ml-2" @click="handleGugur" :modal="true" />
                <Button label="Sesuai" class="p-button-info ml-2" @click="openDialog" :disabled="gugur === true" />
                <!-- <Button label="Sesuai" class="p-button-info ml-2" :disabled="gugur === true" /> -->
                <div>
                    {{ console.log(gugur) }}
                </div>
            </template>
        </Toolbar>
        <div class="p-fluid grid">
            <div class="col-12 md:col-6">
                <div class="formgrid grid">
                    <div class="col-12 md:col-12">
                        <div class="field col">
                            <h4>STATUS: {{ generateStatus(participant?.status) }}</h4>
                            <p>Nama: {{ participant?.name }}</p>
                            <p>NIK: {{ participant?.nik }}</p>
                            <p>Jenis Kelamin: {{ participant?.gender }}</p>
                            <p>No Handphone: +{{ participant?.phone }}</p>
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field col">
                            <p><b>Alamat Sesuai KTP: </b>{{ participant?.address }}</p>
                            <p>RT: 0{{ participant?.rt }}</p>
                            <p>RW: 0{{ participant?.rw }}</p>
                            <p>Provinsi: {{ participant?.provinsi }}</p>
                            <p>Kota: {{ participant?.kota }}</p>
                            <p>Kecamatan: {{ participant?.kecamatan }}</p>
                            <p>Kelurahan: {{ participant?.kelurahan }}</p>
                            <p>Kode POS: {{ participant?.kode_pos }}</p>
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field col">
                            <p><b>Alamat Domisili:</b> {{ participant?.residence_address }}</p>
                            <p>RT: 0{{ participant?.residence_rt }}</p>
                            <p>RW: 0{{ participant?.residence_rw }}</p>
                            <p>Provinsi: {{ participant?.residence_provinsi }}</p>
                            <p>Kota: {{ participant?.residence_kota }}</p>
                            <p>Kecamatan: {{ participant?.residence_kecamatan }}</p>
                            <p>Kelurahan: {{ participant?.residence_kelurahan }}</p>
                            <p>Kode POS: {{ participant?.residence_kode_pos }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="field col" v-if="participant.status === `PARTIAL_DONE`">
                    <h5 class="mb-2">Unggah foto dengan KTP Jelas</h5>
                    <div class="mb-4">
                        <FileUpload
                            v-if="participant.status !== `DONE`"
                            accept="image/*"
                            :maxFileSize="1000000"
                            customUpload
                            :disabled="gugur === true"
                            @select="onSelectedFiles"
                            aria-describedby="file-help"
                            :class="{ 'p-invalid': file ? '' : errors.file }"
                        />
                        <small id="file-help" class="p-error">
                            {{ file ? '' : errors.file }}
                        </small>
                    </div>
                </div>
                <div class="field col" v-if="participant.status === `DONE`">
                    <img :src="baseUrl + `/v1/` + participant.image" height="250" alt="Logo" class="result_img mr-2" />
                </div>
                <div class="field col" v-if="participant.status === `PARTIAL_DONE`">
                    <h5 class="mb-2">Unggah Foto Menerima Sembako Jelas</h5>
                    <div class="mb-4">
                        <FileUpload
                            v-if="participant.status !== `DONE`"
                            accept="image/*"
                            :maxFileSize="1000000"
                            customUpload
                            :disabled="gugur === true"
                            @select="onSelectedFilesPenerima"
                            aria-describedby="file_penerima-help"
                            :class="{ 'p-invalid': file_penerima ? '' : errors.file_penerima }"
                        />
                        <small id="file_penerima-help" class="p-error">
                            {{ file_penerima ? '' : errors.file_penerima }}
                        </small>
                    </div>
                </div>
                <div class="field col" v-if="participant.status === `DONE`">
                    <img class="result_img mr-2" :src="baseUrl + `/v1/` + participant.image_penerima" height="250" alt="Logo" />
                </div>
            </div>
        </div>

        <hr />
        <form @submit="onSubmit">
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
                            <InputText
                                v-bind="name"
                                id="name1"
                                type="text"
                                :required="true"
                                :disabled="!gugur === true"
                                placeholder="Nama Peserta"
                                aria-describedby="name-help"
                                :class="{ 'p-invalid': newParticipant.name ? '' : errors.name }"
                                v-model.trim="newParticipant.name"
                            />
                            <small id="name-help" class="p-error">
                                {{ newParticipant.name ? '' : errors.name }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="ages">Nomor KTP</label>
                            <InputNumber
                                v-bind="nik"
                                id="name1"
                                type="number"
                                :required="true"
                                :disabled="!gugur === true"
                                placeholder="No. KTP"
                                v-model.trim="newParticipant.nik"
                                :useGrouping="false"
                                aria-describedby="nik-help"
                                :class="{ 'p-invalid': newParticipant.nik ? '' : errors.nik }"
                            />
                            <small id="nik-help" class="p-error">
                                {{ errors.nik }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="age1">Jenis Kelamin</label>
                            <Dropdown
                                v-bind="jkel"
                                v-model="newParticipant.gender"
                                :options="genders"
                                :disabled="!gugur === true"
                                optionValue="code"
                                optionLabel="name"
                                placeholder="Jenis Kelamin"
                                @change="handleGender"
                                aria-describedby="gender-help"
                                :class="{ 'p-invalid': newParticipant.gender ? '' : errors.gender }"
                            />
                            <small id="gender-help" class="p-error">
                                {{ errors.gender }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="age1">No Handphone</label>
                            <InputText id="age1" v-bind="phone" required="true" type="text" :disabled="!gugur === true" placeholder="08*********" v-model="newParticipant.phone" aria-describedby="phone-help" :class="{ 'p-invalid': errors.phone }" />
                            <small id="phone-help" class="p-error">
                                {{ errors.phone }}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="field col">
                    <h5 class="mb-2">Unggah foto dengan KTP Jelas</h5>
                    <div class="mb-4">
                        <FileUpload required="true" accept="image/*" customUpload :disabled="!gugur === true" :maxFileSize="1000000" @select="onSelectedFiles" aria-describedby="file-help" :class="{ 'p-invalid': file ? '' : errors.file }" />
                        <div v-if="gugur === true">
                            <small id="file-help" class="p-error">
                                {{ errors.file }}
                            </small>
                        </div>
                    </div>
                    <h5 class="mb-2">Unggah Foto Menerima Sembako Jelas</h5>
                    <FileUpload
                        required="true"
                        accept="image/*"
                        :maxFileSize="1000000"
                        customUpload
                        :disabled="!gugur === true"
                        @select="onSelectedFilesPenerima"
                        aria-describedby="file_penerima-help"
                        :class="{ 'p-invalid': file_penerima ? '' : errors.file_penerima }"
                    />
                    <div v-if="gugur === true">
                        <small id="file_penerima-help" class="p-error">
                            {{ errors.file_penerima }}
                        </small>
                    </div>
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
                            <InputText
                                v-bind="address"
                                id="name1"
                                type="text"
                                required="true"
                                :disabled="!gugur === true"
                                placeholder="Alamat"
                                v-model="newParticipant.address"
                                aria-describedby="address-help"
                                :class="{ 'p-invalid': errors.address }"
                            />
                            <small id="address-help" class="p-error">
                                {{ errors.address }}
                            </small>
                        </div>
                        <div class="grid formgrid mb-4">
                            <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                                <label for="email1" class="mb-2">RT</label>
                                <InputText v-bind="rt" id="email1" type="text" required="true" :disabled="!gugur === true" placeholder="RT" v-model="newParticipant.rt" aria-describedby="rt-help" :class="{ 'p-invalid': errors.rt }" />
                                <small id="rt-help" class="p-error">
                                    {{ errors.rt }}
                                </small>
                            </div>
                            <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                                <label for="age1">RW</label>
                                <InputText v-bind="rw" id="age1" type="text" required="true" :disabled="!gugur === true" placeholder="RW" v-model="newParticipant.rw" aria-describedby="rw-help" :class="{ 'p-invalid': errors.rw }" />
                                <small id="rw-help" class="p-error">
                                    {{ errors.rw }}
                                </small>
                            </div>
                        </div>
                        <div class="field">
                            <label for="name1">Provinsi</label>
                            <Dropdown
                                v-bind="provinsi"
                                v-model="newParticipant.provinsi"
                                :options="provinces"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Provinsi"
                                @change="handleProvinsi"
                                aria-describedby="provinsi-help"
                                :class="{ 'p-invalid': newParticipant.provinsi ? '' : errors.provinsi }"
                            />
                            <small id="provinsi-help" class="p-error">
                                {{ newParticipant.provinsi ? '' : errors.provinsi }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kota</label>
                            <Dropdown
                                v-bind="kota"
                                v-model="newParticipant.kota"
                                :options="cities"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kota"
                                @change="handleKota"
                                aria-describedby="kota-help"
                                :class="{ 'p-invalid': newParticipant.kota ? '' : errors.kota }"
                            />
                            <small id="kota-help" class="p-error">
                                {{ errors.kota }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kecamatan</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kecamatan" /> -->
                            <Dropdown
                                v-bind="kecamatan"
                                v-model="newParticipant.kecamatan"
                                :disabled="!gugur === true"
                                :options="districts"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kecamatan"
                                @change="handleKecamatan"
                                aria-describedby="kecamatan-help"
                                :class="{ 'p-invalid': newParticipant.kecamatan ? '' : errors.kecamatan }"
                            />
                            <small id="kecamatan-help" class="p-error">
                                {{ errors.kecamatan }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kelurahan</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.kelurahan" /> -->
                            <Dropdown
                                v-bind="kelurahan"
                                v-model="newParticipant.kelurahan"
                                :options="villages"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kelurahan"
                                aria-describedby="kelurahan-help"
                                :class="{ 'p-invalid': errors.kelurahan }"
                            />
                            <small id="kelurahan-help" class="p-error">
                                {{ errors.kelurahan }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kode POS</label>
                            <InputText
                                v-bind="kode_pos"
                                :required="true"
                                id="name1"
                                type="text"
                                placeholder="Kode Pos"
                                :disabled="!gugur === true"
                                v-model="newParticipant.kode_pos"
                                aria-describedby="kode_pos-help"
                                :class="{ 'p-invalid': errors.kode_pos }"
                            />
                            <small id="kode_pos-help" class="p-error">
                                {{ errors.kode_pos }}
                            </small>
                            <!--                        <Dropdown v-model="poscode" :options="poscodes" :disabled="!gugur === true" optionValue="name" optionLabel="name" placeholder="Kode POS" />-->
                        </div>
                    </div>
                </div>
                <div class="field col">
                    <div class="p-fluid">
                        <h5>Alamat Domisili</h5>
                        <div class="field-checkbox mb-4">
                            <Checkbox
                                v-bind="newParticipant2"
                                id="checkOption2"
                                name="option"
                                :disabled="!gugur === true"
                                :value="newParticipant2"
                                v-model="checkboxValue"
                                @change="duplicateResidence"
                                aria-describedby="option-help"
                                :class="{ 'p-invalid': errors.option }"
                            />
                            <!-- <Field name="acceptTerms" type="checkbox" id="acceptTerms" :value="true" class="form-check-input" :class="{ 'is-invalid': errors.acceptTerms }" /> -->
                            <label for="checkOption2">Alamat sesuai KTP</label>
                            <small id="option-help" class="p-error">
                                {{ errors.option }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Alamat</label>
                            <InputText
                                v-bind="residence_address"
                                id="name1"
                                type="text"
                                :disabled="!gugur === true"
                                placeholder="Alamat"
                                v-model="newParticipant.residence_address"
                                aria-describedby="residence_address-help"
                                :class="{ 'p-invalid': errors.residence_address }"
                            />
                            <small id="residence_address-help" class="p-error">
                                {{ errors.residence_address }}
                            </small>
                        </div>
                        <div class="grid formgrid mb-4">
                            <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                                <label for="email1">RT</label>
                                <InputText
                                    v-bind="residence_rt"
                                    id="email1"
                                    type="text"
                                    :disabled="!gugur === true"
                                    placeholder="RT"
                                    v-model="newParticipant.residence_rt"
                                    aria-describedby="residence_rt-help"
                                    :class="{ 'p-invalid': errors.residence_rt }"
                                />
                                <small id="residence_rt-help" class="p-error">
                                    {{ errors.residence_rt }}
                                </small>
                            </div>
                            <div class="col-12 mb-2 lg:col-4 lg:mb-0 field">
                                <label for="age1">RW</label>
                                <InputText
                                    v-bind="residence_rw"
                                    id="age1"
                                    type="text"
                                    :disabled="!gugur === true"
                                    placeholder="RW"
                                    v-model="newParticipant.residence_rw"
                                    aria-describedby="residence_rw-help"
                                    :class="{ 'p-invalid': errors.residence_rw }"
                                />
                                <small id="residence_rw-help" class="p-error">
                                    {{ errors.residence_rw }}
                                </small>
                            </div>
                        </div>
                        <div class="field">
                            <label for="name1">Provinsi</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_provinsi" /> -->
                            <Dropdown
                                v-bind="residence_provinsi"
                                v-model="newParticipant.residence_provinsi"
                                :options="provinces"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Provinsi"
                                @change="handleResidenceProvinsi"
                                aria-describedby="residence_provinsi-help"
                                :class="{ 'p-invalid': newParticipant.residence_provinsi ? '' : errors.residence_provinsi }"
                            />
                            <small id="residence_provinsi-help" class="p-error">
                                {{ errors.residence_provinsi }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kota</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kota" /> -->
                            <Dropdown
                                v-bind="residence_kota"
                                v-model="newParticipant.residence_kota"
                                :options="residence_cities"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kota"
                                @change="handleResidenceKota"
                                aria-describedby="residence_kota-help"
                                :class="{ 'p-invalid': errors.residence_kota }"
                            />
                            <small id="residence_kota-help" class="p-error">
                                {{ errors.residence_kota }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kecamatan</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kecamatan" /> -->
                            <Dropdown
                                v-bind="residence_kecamatan"
                                v-model="newParticipant.residence_kecamatan"
                                :options="residence_districts"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kecamatan"
                                @change="handleResidenceKecamatan"
                                aria-describedby="residence_kecamatan-help"
                                :class="{ 'p-invalid': errors.residence_kecamatan }"
                            />
                            <small id="residence_kecamatan-help" class="p-error">
                                {{ errors.residence_kecamatan }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kelurahan</label>
                            <!-- <InputText id="name1" type="text" :disabled="!gugur === true" v-model="newParticipant.residence_kelurahan" /> -->
                            <Dropdown
                                v-bind="residence_kelurahan"
                                v-model="newParticipant.residence_kelurahan"
                                :options="residence_villages"
                                :disabled="!gugur === true"
                                optionValue="id"
                                optionLabel="name"
                                placeholder="Kelurahan"
                                aria-describedby="residence_kelurahan-help"
                                :class="{ 'p-invalid': errors.residence_kelurahan }"
                            />
                            <small id="residence_kelurahan-help" class="p-error">
                                {{ errors.residence_kelurahan }}
                            </small>
                        </div>
                        <div class="field">
                            <label for="name1">Kode POS</label>
                            <InputText
                                v-bind="residence_kode_pos"
                                id="name1"
                                type="text"
                                placeholder="Kode Pos"
                                :disabled="!gugur === true"
                                v-model="newParticipant.residence_kode_pos"
                                aria-describedby="residence_kode_pos-help"
                                :class="{ 'p-invalid': newParticipant.residence_kode_pos ? '' : errors.residence_kode_pos }"
                            />
                            <small id="residence_kode_pos-help" class="p-error">
                                {{ newParticipant.residence_kode_pos ? '' : errors.residence_kode_pos }}
                            </small>
                        </div>
                    </div>
                    <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <Button label="Submit" @click="openDialogSubmit" class="p-button-info mr-4" :modal="true" :disabled="!gugur === true" />
                    </div>
                </div>
            </div>
        </form>
        <!-- </div> -->
        <!-- dialog gugur -->
        <Dialog header="Confirmation" v-model:visible="displayConfirmationGugur" :style="{ width: '550px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <h5 class="text-center">Apakah anda yakin mengubah ke status <b>GUGUR?</b></h5>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-danger" />
                <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="p-button-success" />
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
                <Button label="Yes" icon="pi pi-check" :loading="loading" @click="handleSesuai" class="p-button-success" autofocus />
            </template>
        </Dialog>
        <!-- dialog -->

        <!-- dialog Submit -->
        <Dialog header="Confirmation" v-model:visible="displayConfirmationSubmit" :style="{ width: '550px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <h5 class="text-center">Apakah anda ingin input data peserta <b>BARU</b>?</h5>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" :loading="loading" @click="closeConfirmation" class="p-button-danger" />
                <Button label="Yes" icon="pi pi-check" :loading="loading" @click="handleSubmits" class="p-button-success" />
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

.result_img {
    width: 100%;
}

.labels {
    font-weight: bold;
}

.submit {
    padding: 1rem 1.45rem;
    color: white;
    background-color: #3b82f6;
    border-radius: 6px;
    outline: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
}
</style>