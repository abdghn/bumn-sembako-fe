<script setup>
import {useRoute} from "vue-router";
import ParticipantService from "../../../service/ParticipantService";
import {onMounted, ref} from "vue";

const route = useRoute();
const participant = ref(null);
const participantService = new ParticipantService()


onMounted(() => {
  participantService.getParticipant(route.params.id).then((result) => (participant.value = result));

});



</script>

<template>
  <div className="card">
    <h4>STATUS: DONE</h4>
    <p>Nama:  {{participant?.name}}</p>
    <p>NIK: {{participant?.nik}}</p>
    <p>Jenis Kelamin: {{participant?.gender}}</p>
    <p>No Handphone: {{participant?.phone}}</p>
    <br/>
    <p>Alamat Sesuai KTP: {{participant?.address}}</p>
    <p>RT: {{participant?.rt}}</p>
    <p>RW: {{participant?.rw}}</p>
    <p>Provinsi: {{participant?.provinsi}}</p>
    <p>Kota: {{participant?.kota}}</p>
    <p>Kecamatan: {{participant?.kecamatan}}</p>
    <p>Kelurahan: {{participant?.kelurahan}}</p>
    <p>Kode POS: {{participant?.kode_pos}}</p>
    <br/>
    <p>Alamat Domisili: {{participant?.residence_address}}</p>
    <p>RT: {{participant?.residence_rt}}</p>
    <p>RW: {{participant?.residence_rw}}</p>
    <p>Provinsi: {{participant?.residence_provinsi}}</p>
    <p>Kota: {{participant?.residence_kota}}</p>
    <p>Kecamatan: {{participant?.residence_kecamatan}}</p>
    <p>Kelurahan: {{participant?.residence_kelurahan}}</p>
    <p>Kode POS: {{participant?.residence_kode_pos}}</p>
    <hr/>

  </div>
</template>

<style scoped lang="scss"></style>

