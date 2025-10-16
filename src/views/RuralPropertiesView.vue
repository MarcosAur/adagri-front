<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';


onMounted(async () => {
    await getRuralProperties();
});
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'state_registration', header: 'Inscrição Estadual' },
    { field: 'total_area', header: 'Área Total' },
    { field: 'producer_id', header: 'Produtor' },
];
const ruralProperties = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const getRuralProperties = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/rural-property?page=${pagination.page + 1}` : `${apiBaseUrl}/api/rural-property`;
        ruralProperties.value = [];
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
        
        response.data.data.forEach((ruralProperty) => {
            ruralProperties.value.push({
                name: ruralProperty.name,
                state_registration: ruralProperty.state_registration,
                total_area: ruralProperty.total_area,
                producer_id: ruralProperty.producer_id,
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

</script>

<template>
    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="ruralProperties" lazy :totalRecords="totalRecords" @page="getRuralProperties" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Propriedades Rurais</p>
            </div>
        </template>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="{ minWidth: '12rem' }"></Column>
    </DataTable>
</template>
