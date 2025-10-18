<script setup>
import loginService from '@/services/LoginService';
import { apiBaseUrl } from '@/setting';
import axios from 'axios';
import { Button } from 'primevue';
import { onMounted, ref } from 'vue';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import Chart from 'primevue/chart';
import { useAuthStore } from '@/stores/login';

onMounted(async () => {
    await getReportValues();
})

const authStore = useAuthStore();
const linkToPdfFileReport = ref('')
const isLoading = ref(false)

const propertiesPerCitytGraphicsData = ref();
const quantityPerSpeciesGraphicsData = ref();
const totalAreaPerCultureGraphicsData = ref();


const getPdfReport = async (routeLink) => {
    isLoading.value = true; 
    try{
        const response = await axios.get(`${apiBaseUrl}/api/report/${routeLink}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
      
        linkToPdfFileReport.value = response.data;


    }catch(error){
        console.log(error);
    }

    isLoading.value = false;
    window.open(linkToPdfFileReport.value, '_blank')
}

const getReportValues = async () => {
    isLoading.value = true; 
    try{

        const response = await axios.get(`${apiBaseUrl}/api/report/overview-graphics`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
      
        const propertiesPerCity = response.data.propertiesPerCity;
        const quantityPerSpecies = response.data.quantityPerSpecies;
        const totalAreaPerCulture = response.data.totalAreaPerCulture;


        propertiesPerCitytGraphicsData.value = {
            labels: propertiesPerCity ? propertiesPerCity.labels : [],
            datasets: [
                {
                    label: 'Propriedades por municipio',
                    data: propertiesPerCity ? propertiesPerCity.data : [],
                    borderWidth: 1
                }
            ]
        }

        totalAreaPerCultureGraphicsData.value = {
            labels: totalAreaPerCulture ? totalAreaPerCulture.labels : [],
            datasets: [
                {
                    label: 'Propriedades por municipio',
                    data: totalAreaPerCulture ? totalAreaPerCulture.data : [],
                    borderWidth: 1
                }
            ]
        }

        quantityPerSpeciesGraphicsData.value = {
            labels: quantityPerSpecies ? quantityPerSpecies.labels : [],
            datasets: [
                {
                    label: 'Propriedades por municipio',
                    data: quantityPerSpecies ? quantityPerSpecies.data : [],
                    borderWidth: 1
                }
            ]
        }


    }catch(error){
        console.log(error);
    }

    isLoading.value = false;
}
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-center" v-if="isLoading">
    <ProgressSpinner />
  </div>
  
  <Toolbar v-if="!isLoading">
    <template #center>
      <div class="p-5">
        <Button style="margin:10px; background-color: #111627; border-color: #111627;" @click="getPdfReport('pdf-report')"  >Baixar relatório de rebanhos por produtor </Button>
        <Button style="margin:10px; background-color: #111627; border-color: #111627;" @click="getPdfReport('rural-properties-xlsx')">Baixar relatório de rebanhos por produtor </Button>
      </div>
    </template>
</Toolbar>


<div class="w-full flex p-5  gap-5" v-if="!isLoading">
    <Chart type="bar" :data="propertiesPerCitytGraphicsData"  class="w-[37rem]  " />
    <Chart type="bar" :data="quantityPerSpeciesGraphicsData"  class="w-[37rem]" />
    <Chart type="bar" :data="totalAreaPerCultureGraphicsData"  class="w-[37rem] " />
</div>


</template>
