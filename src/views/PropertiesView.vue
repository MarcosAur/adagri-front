<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';


onMounted(async () => {
    await getProducers();
});
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'document', header: 'Documento' },
    { field: 'phone', header: 'Telefone' },
    { field: 'email', header: 'Email' },
    { field: 'register_date', header: 'Data de Registro' }
];
const producers = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const getProducers = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/producer?page=${pagination.page + 1}` : `${apiBaseUrl}/api/producer`;
        producers.value = [];
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
        
        response.data.data.forEach((producer) => {
            producers.value.push({
                name: producer.name,
                document: producer.document,
                phone: producer.phone,
                email: producer.email,
                register_date: new Date(producer.register_date).toLocaleDateString('pt-BR')
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

</script>

<template>
    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="producers" lazy :totalRecords="totalRecords" @page="getProducers" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Produtores</p>
            </div>
        </template>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="{ minWidth: '12rem' }"></Column>
    </DataTable>
</template>
