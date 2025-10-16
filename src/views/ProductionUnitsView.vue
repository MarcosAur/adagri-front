<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';


onMounted(async () => {
    await getProductionUnits();
});
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'total_area_ha', header: 'Área em Hectáres' },
    { field: 'latitude', header: 'Latitude' },
    { field: 'longitude', header: 'Longitude' },
    { field: 'rural_property_id', header: 'Propriedade Rural' },
];
const productionUnits = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const getProductionUnits = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/production-unit?page=${pagination.page + 1}` : `${apiBaseUrl}/api/production-unit`;
        productionUnits.value = [];
        const token = await loginService.getToken();
        const response = await axios.get(url, {
            params: {
                filters: {
                    per_page: perPage.value
                }
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        response.data.data.forEach((productionUnit) => {
            productionUnits.value.push({
                name: productionUnit.name,
                total_area_ha: productionUnit.total_area_ha,
                latitude: productionUnit.latitude,
                longitude: productionUnit.longitude,
                rural_property_id: productionUnit.rural_property_id,
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

</script>

<template>
    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="productionUnits" lazy :totalRecords="totalRecords" @page="getProductionUnits" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Unidade de Produção</p>
            </div>
        </template>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="{ minWidth: '12rem' }"></Column>
    </DataTable>
</template>
