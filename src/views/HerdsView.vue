<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import { Button, DatePicker, Dialog, InputNumber, InputText, Message, ProgressSpinner, Select } from 'primevue';
import api from '@/config/axios';
import { useAuthStore } from '@/stores/login';


const auth = useAuthStore()

onMounted(async () => {
    isLoading.value = true;
    await getHerds();
    await getAllRuralPropertiesToSelect();
    isLoading.value = false;
});

const isLoading = ref(false);
const ruralPropertiesSelectData = ref([]);
const columns = [
    { field: 'species', header: 'Espécie' },
    { field: 'quantity', header: 'Quantidade' },
    { field: 'purpose', header: 'Finalidade' },
    { field: 'last_update_date', header: 'Última Atualização' },
    { field: 'rural_property', header: 'Propriedade Rural' },
];
const herds = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)

const formErrors = ref({
    species: null,
    quatity: null,
    purpose: null,
    last_update_date: null,
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
    species: '',
    quatity: '',
    purpose: '',
    last_update_date: '',
    rural_property_id: null
});

const clearErrors = () => {
    formErrors.value = {
        species: null,
        quatity: null,
        purpose: null,
        last_update_date: null,
        rural_property: null,
    };
}

const getHerds = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/herd?page=${pagination.page + 1}` : `${apiBaseUrl}/api/herd`;
        herds.value = [];
        const response = await api.get(url, {
            params: {
                filters: {
                    per_page: perPage.value
                }
            },
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        
        response.data.data.forEach((herd) => {
            herds.value.push({
                id: herd.id,
                species: herd.species,
                quantity: herd.quantity,
                purpose: herd.purpose,
                rural_property_id: herd.rural_property_id,
                rural_property: herd.rural_property.name,
                last_update_date: new Date(herd.last_update_date).toLocaleDateString('pt-BR')
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

const getAllRuralPropertiesToSelect = async () => {

    try{

        const response = await api.get(`${apiBaseUrl}/api/rural-property`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
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

const submitDeleteRegister = async () => {
    isLoading.value = true;
    try{
        await api.delete(`${apiBaseUrl}/api/herd/${registerToDeleteId.value}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
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
    await getHerds();
    isLoading.value = false;
}

const submitCreationForm = async () => {
    isLoading.value = true;
    serverReturn.value = false;
    const validated = validateForm();

    if(!validated){
        return;
    }

    dataToCreate.value.rural_property_id = dataToCreate.value.rural_property_id.code
    if(dataToCreate.value.id){
        await api.put(`${apiBaseUrl}/api/herd/${dataToCreate.value.id}`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${auth.token}`
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
        await api.post(`${apiBaseUrl}/api/herd`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${auth.token}`
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
    
    await getHerds();
    creationDialogIsOpen.value = false;
    isLoading.value = false;
}

const openCreationDialog = () => {
    dataToCreate.value = {
        id: null,
        species: '',
        quantity: '',
        purpose: '',
        last_update_date: '',
        rural_property_id: null
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
        species: data.species,
        quantity: data.quantity,
        purpose: data.purpose,
        last_update_date: data.last_update_date,
        rural_property_id: rural_property_id
    };

    clearErrors();
    creationDialogIsOpen.value = true;
}

const validateForm = () => {
    clearErrors();
    if(!dataToCreate.value.species || dataToCreate.value.species.length === 0){
        formErrors.value.species = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.quantity || dataToCreate.value.quantity.length === 0){
        formErrors.value.quantity = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.last_update_date || dataToCreate.value.last_update_date.length === 0){
        formErrors.value.last_update_date = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.purpose || dataToCreate.value.purpose.length === 0){
        formErrors.value.purpose = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.rural_property_id || dataToCreate.value.rural_property_id.length === 0){
        formErrors.value.rural_property_id = 'Este campo é obrigatório';
    }

    return !formErrors.value.species &&
    !formErrors.value.quantity &&
    !formErrors.value.purpose && 
    !formErrors.value.rural_property_id &&
    !formErrors.value.last_update_date
}

</script>

<template>

    <div class="w-full min-h-screen flex justify-center items-center" v-if="isLoading">
        <ProgressSpinner />
    </div>

    <div v-else>
        <div class="flex justify-end pe-6 pt-6 ">
            <Button @click="openCreationDialog" style="background-color: #111627;">Criar Rebanho</Button>
        </div>

        <div class="px-6 pt-6">
            <Message  v-if="serverReturn" :life="3000" :severity="serverReturnStatus">
                <p >{{serverReturnMessage}}</p>
            </Message>
        </div>


        <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="herds" lazy :totalRecords="totalRecords" @page="getHerds" :paginator="true" :rows="perPage">
            <template #header>
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <p class="text-xl font-bold">Rebanhos</p>
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

        <Dialog closeIcon="none" :visible="creationDialogIsOpen" modal header="Criar Rebanho" :style="{ width: '50rem' }">
        
            <div class="flex items-center gap-4" style="margin-bottom: 10px;">
                <label for="species" class="font-semibold w-24">Espécie</label>
                <InputText v-model="dataToCreate.species" id="species" class="flex-auto" placeholder="Informe o nome da espácie" autocomplete="off" />
                
            </div>
            <Message v-if="formErrors.species" severity="error" >{{ formErrors.species }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="quantity" class="font-semibold w-24">Quantidade</label>
                <InputNumber v-model="dataToCreate.quantity" id="quantity" class="flex-auto" placeholder="Informe a quantidade do rebanho" autocomplete="off" />
            </div>

            <Message v-if="formErrors.quantity" severity="error" >{{ formErrors.quantity }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="purpose" class="font-semibold w-24">Propósito</label>
                <InputText v-model="dataToCreate.purpose" id="purpose" class="flex-auto" placeholder="Informe o propósito do rebanho" autocomplete="off" />
            </div>

            <Message v-if="formErrors.purpose" severity="error" >{{ formErrors.purpose }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="last_update_date" class="font-semibold w-24">Data da Última Atualização</label>
                <DatePicker dateFormat="dd/mm/yy" fluid v-model="dataToCreate.last_update_date" class="w-162" placeholder="Informe a data da última atualização" id="last_update_date"/>
            </div>

            <Message v-if="formErrors.last_update_date" severity="error">{{ formErrors.last_update_date }}</Message>

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
    </div>
</template>
