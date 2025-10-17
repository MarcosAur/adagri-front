<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';
import { Button, Dialog, InputText, Message, Select } from 'primevue';


onMounted(async () => {
    await getProductionUnits();
    await getAllRuralPropertiesToSelect();
});

const ruralPropertiesSelectData = ref([]);
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'total_area_ha', header: 'Área em Hectáres' },
    { field: 'latitude', header: 'Latitude' },
    { field: 'longitude', header: 'Longitude' },
    { field: 'rural_property', header: 'Propriedade Rural' },
];
const productionUnits = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const formErrors = ref({
    name: null,
    total_area_ha: null,
    latitude: null,
    longitude: null,
    rural_property: null,
});

const registerToDeleteId = ref(null);
const serverReturn = ref(false);
const serverReturnMessage = ref('');
const serverReturnStatus = ref('');
const creationDialogIsOpen = ref(false);
const deleteDialogIsOpen = ref(false);
const dataToCreate = ref({
    id: null,
    name: '',
    total_area_ha: '',
    latitude: '',
    longitude: '',
    rural_property: null
});

const clearErrors = () => {
    formErrors.value = {
        name: null,
        total_area_ha: null,
        latitude: null,
        longitude: null,
        rural_property: null,
    };
}

const getAllRuralPropertiesToSelect = async () => {

    try{
        const token = await loginService.getToken();
        const response = await axios.get(`${apiBaseUrl}/api/rural-property`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        response.data.forEach((rural_property) => {
            ruralPropertiesSelectData.value.push({
                'name': rural_property.name,
                'code': rural_property.id
            });
        });


    }catch(error){
        console.error(error);
    }
}

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
                id: productionUnit.id,
                name: productionUnit.name,
                total_area_ha: productionUnit.total_area_ha,
                latitude: productionUnit.latitude,
                longitude: productionUnit.longitude,
                rural_property_id: productionUnit.rural_property_id,
                rural_property: productionUnit.rural_property.name
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

const submitDeleteRegister = async () => {
    const token = await loginService.getToken();
    try{
        await axios.delete(`${apiBaseUrl}/api/production-unit/${registerToDeleteId.value}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        serverReturn.value = true;
        serverReturnMessage.value = 'Registro deletado com sucesso';
        serverReturnStatus.value = 'success';
    } catch (error){
        serverReturn.value = true;
        serverReturnMessage.value = 'Erro interno do servidor';
        serverReturnStatus.value = 'error';
    }

    deleteDialogIsOpen.value = false;
    registerToDeleteId.value = null;
    await getProductionUnits();
}

const submitCreationForm = async () => {
    serverReturn.value = false;
    const token = await loginService.getToken();
    const validated = validateForm();
    if(!validated){
        return;
    }

    dataToCreate.value.rural_property_id = dataToCreate.value.rural_property_id.code

    if(dataToCreate.value.id){
        await axios.put(`${apiBaseUrl}/api/production-unit/${dataToCreate.value.id}`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            serverReturn.value = true;
            serverReturnMessage.value = 'Registro atualizado com sucesso'
            serverReturnStatus.value = 'success' 
        }).catch((error) => {
            serverReturn.value = true;
            serverReturnMessage.value = 'Erro interno do servidor'
            serverReturnStatus.value = 'error' 
        });
    } else {
        await axios.post(`${apiBaseUrl}/api/production-unit`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            serverReturn.value = true;
            serverReturnMessage.value = 'Registro inserido com sucesso'
            serverReturnStatus.value = 'success' 
        }).catch((error) => {
            serverReturn.value = true;
            serverReturnMessage.value = 'Erro interno do servidor'
            serverReturnStatus.value = 'error'
        });
    }
    
    await getProductionUnits();
    creationDialogIsOpen.value = false;
}

const openCreationDialog = () => {
    dataToCreate.value = {
        id: null,
        name: '',
        total_area_ha: '',
        latitude: '',
        longitude: '',
        rural_property: null
    };

    clearErrors();
    creationDialogIsOpen.value = true;
}

const openDeleteRegisterModal = (data) => {
    deleteDialogIsOpen.value = true
    registerToDeleteId.value = data.id;
}

const openUpdateRegisterModal = (data) => {
    let rural_property_id = ''
    ruralPropertiesSelectData.value.forEach((rural_property) => {
        if (rural_property.code == data.rural_property_id){
            rural_property_id = rural_property;
        }
    })

    dataToCreate.value = {
        id: data.id,
        name: data.name,
        total_area_ha: data.total_area_ha,
        latitude: data.latitude,
        longitude: data.longitude,
        rural_property_id: rural_property_id
    };

    clearErrors();
    creationDialogIsOpen.value = true;
}

const validateForm = () => {
    clearErrors();
    if(!dataToCreate.value.name || dataToCreate.value.name.length === 0){
        formErrors.value.name = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.total_area_ha || dataToCreate.value.total_area_ha.length === 0){
        formErrors.value.total_area_ha = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.latitude || dataToCreate.value.latitude.length === 0){
        formErrors.value.latitude = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.longitude || dataToCreate.value.longitude.length === 0){
        formErrors.value.longitude = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.rural_property_id || dataToCreate.value.rural_property_id.length === 0){
        formErrors.value.rural_property_id = 'Este campo é obrigatório';
    }

    return !formErrors.value.name &&
    !formErrors.value.latitude &&
    !formErrors.value.longitude && 
    !formErrors.value.rural_property_id &&
    !formErrors.value.total_area_ha
}
</script>

<template>

    <div class="flex justify-end pe-6 pt-6 ">
        <Button @click="openCreationDialog" style="background-color: #111627;">Criar Unidade de Produção</Button>
    </div>

    <div class="px-6 pt-6">
        <Message  v-if="serverReturn" :life="3000" :severity="serverReturnStatus">
            <p >{{serverReturnMessage}}</p>
        </Message>
    </div>

    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="productionUnits" lazy :totalRecords="totalRecords" @page="getProductionUnits" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Unidade de Produção</p>
            </div>
        </template>

        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="{ minWidth: '12rem' }"></Column>
        
        <Column class="w-24 !text-center" header="Editar">
            <template #body="{ data }">
                <Button icon="pi pi-cog" @click="openUpdateRegisterModal(data)" severity="secondary" rounded></Button>
            </template>
        </Column>

        <Column class="w-24 !text-center" header="Deletar">
            <template #body="{ data }">
                <Button icon="pi pi-trash" @click="openDeleteRegisterModal(data)" severity="secondary" rounded></Button>
            </template>
        </Column>

    </DataTable>

    <Dialog closeIcon="none" :visible="creationDialogIsOpen" modal header="Criar Propriedade" :style="{ width: '50rem' }">
    
        <div class="flex items-center gap-4" style="margin-bottom: 10px;">
            <label for="name" class="font-semibold w-24">Nome</label>
            <InputText v-model="dataToCreate.name" id="name" class="flex-auto" placeholder="Informe o nome" autocomplete="off" />
            
        </div>
        <Message v-if="formErrors.name" severity="error" >{{ formErrors.name }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="total_area_ha" class="font-semibold w-24">Area total em Hectares</label>
            <InputText v-model="dataToCreate.total_area_ha" id="total_area_ha" class="flex-auto" placeholder="Informe a área total em hectares" autocomplete="off" />
        </div>

        <Message v-if="formErrors.total_area_ha" severity="error" >{{ formErrors.total_area_ha }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="latitude" class="font-semibold w-24">Latitude</label>
            <InputText v-model="dataToCreate.latitude" id="latitude" class="flex-auto" placeholder="Informe a latitude" autocomplete="off" />
        </div>

        <Message v-if="formErrors.latitude" severity="error">{{ formErrors.latitude }}</Message>
    
        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="longitude" class="font-semibold w-24">Longitude</label>
            <InputText v-model="dataToCreate.longitude" id="longitude" class="flex-auto" placeholder="Informe o email" autocomplete="off" />
        </div>

        <Message v-if="formErrors.longitude" severity="error">{{ formErrors.longitude }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="rural_property_id" class="font-semibold w-24">Propriedade Rural</label>
            <Select :options="ruralPropertiesSelectData" optionLabel="name" name="code" placeholder="Selecione a propriedade" v-model="dataToCreate.rural_property_id" id="rural_property_id" class="flex-auto"  autocomplete="off" />
        </div>

        <Message v-if="formErrors.rural_property_id" severity="error">{{ formErrors.rural_property_id }}</Message>
    
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="creationDialogIsOpen = false"></Button>
            <Button type="button" label="Criar" @click="submitCreationForm"></Button>
        </div>
    </Dialog>

    <Dialog closeIcon="none" :visible="deleteDialogIsOpen" modal header="Deletar Propriedade" :style="{ width: '50rem' }">
        <p>Deseja realmente deletar o registro?</p>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="deleteDialogIsOpen = false"></Button>
            <Button type="button" label="Deletar" severity="danger" @click="submitDeleteRegister"></Button>
        </div>
    </Dialog>
</template>
