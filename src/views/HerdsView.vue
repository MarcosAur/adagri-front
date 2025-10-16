<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';


onMounted(async () => {
    await getHerds();
});
const columns = [
    { field: 'species', header: 'Espécie' },
    { field: 'quantity', header: 'Quantidade' },
    { field: 'purpose', header: 'Finalidade' },
    { field: 'last_update_date', header: 'Última Atualização' },
    { field: 'rural_property_id', header: 'Propriedade Rural' },
];
const herds = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const getHerds = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/herd?page=${pagination.page + 1}` : `${apiBaseUrl}/api/herd`;
        herds.value = [];
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
        
        response.data.data.forEach((herd) => {
            herds.value.push({
                species: herd.species,
                quantity: herd.quantity,
                purpose: herd.purpose,
                rural_property_id: herd.rural_property_id,
                last_update_date: new Date(herd.last_update_date).toLocaleDateString('pt-BR')
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

</script>

<template>
    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="herds" lazy :totalRecords="totalRecords" @page="getHerds" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Rebanhos</p>
            </div>
        </template>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="{ minWidth: '12rem' }"></Column>
    </DataTable>
</template>
