<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import loginService from '@/services/LoginService';
import { Button, InputText, Message, Dialog, InputNumber, Select } from 'primevue';


onMounted(async () => {
    await getRuralProperties();
    await getAllProducersToSelect();
});
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'state_registration', header: 'Inscrição Estadual' },
    { field: 'total_area', header: 'Área Total' },
    { field: 'producer', header: 'Produtor' },
    { field: 'address', header: 'Endereço' },
    { field: 'number', header: 'Número' },
    { field: 'city', header: 'Cidade' },
    { field: 'state', header: 'Estado' },
];

const registerToDeleteId = ref(null);
const serverReturn = ref(false);
const serverReturnMessage = ref('');
const serverReturnStatus = ref('');
const creationDialogIsOpen = ref(false);
const deleteDialogIsOpen = ref(false);
const producerSelectData = ref([]);
const dataToCreate = ref({
    rural_property: {
        id: null,
        name: '',
        state_registration: '',
        total_area: '',
        producer_id: 1,
    },
    address: {
        address: '',
        number: '',
        city: '',
        state: ''
    }
});
const ruralProperties = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)
const formErrors = ref({
    name: null,
    state_registration: null,
    total_area: null,
    producer_id: null,
    address: null,
    number: null,
    city: null,
    state: null
}); 

const clearErrors = () => {
    formErrors.value = {
        name: null,
        state_registration: null,
        total_area: null,
        producer_id: null,
        address: null,
        number: null,
        city: null,
        state: null
    };
}

const getAllProducersToSelect = async () => {

    try{
        const token = await loginService.getToken();
        const response = await axios.get(`${apiBaseUrl}/api/producer`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        response.data.forEach((producer) => {
            producerSelectData.value.push({
                'name': producer.name,
                'code': producer.id
            });
        });


    }catch(error){
        console.error(error);
    }
}

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
                id: ruralProperty.id,
                name: ruralProperty.name,
                state_registration: ruralProperty.state_registration,
                total_area: ruralProperty.total_area,
                producer_id: ruralProperty.producer_id,
                producer: ruralProperty.producer.name,
                address: ruralProperty.address.address,
                number: ruralProperty.address.number,
                city: ruralProperty.address.city,
                state: ruralProperty.address.state
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}

const submitCreationForm = async () => {
    serverReturn.value = false;
    const token = await loginService.getToken();
    const validated = validateForm();
    if(!validated){
        return;
    }

    dataToCreate.value.rural_property.producer_id = dataToCreate.value.rural_property.producer_id.code

    if(dataToCreate.value.rural_property.id){
        await axios.put(`${apiBaseUrl}/api/rural-property/${dataToCreate.value.rural_property.id}`, dataToCreate.value, {
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
        await axios.post(`${apiBaseUrl}/api/rural-property`, dataToCreate.value, {
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
    
    await getRuralProperties();
    creationDialogIsOpen.value = false;
}

const submitDeleteRegister = async () => {
    const token = await loginService.getToken();
    try{
        await axios.delete(`${apiBaseUrl}/api/rural-property/${registerToDeleteId.value}`, {
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
    await getRuralProperties();
}

const openCreationDialog = () => {
    dataToCreate.value = {
        rural_property: {
            id: null,
            name: '',
            state_registration: '',
            total_area: '',
            producer_id: 1,
        },
        address: {
            address: '',
            number: '',
            city: '',
            state: ''
        }
    };
    clearErrors();
    creationDialogIsOpen.value = true;
}

const openDeleteRegisterModal = (data) => {
    deleteDialogIsOpen.value = true
    registerToDeleteId.value = data.id;
}

const openUpdateRegisterModal = (data) => {
    let producer_id = ''
    producerSelectData.value.forEach((producer) => {
        if (producer.code == data.producer_id){
            producer_id = producer;
        }
    })

    console.log(producer_id);

    dataToCreate.value = {
        rural_property: {
            id: data.id,
            name: data.name,
            state_registration: data.state_registration,
            total_area: data.total_area,
            producer_id: producer_id,
        },
        address: {
            address: data.address,
            number: data.number,
            city: data.city,
            state: data.state
        }
    };

    clearErrors();
    creationDialogIsOpen.value = true;
}

const validateForm = () => {
    clearErrors();
    if(!dataToCreate.value.rural_property.name || dataToCreate.value.rural_property.name.length === 0){
        formErrors.value.name = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.rural_property.state_registration || dataToCreate.value.rural_property.state_registration.length === 0){
        formErrors.value.state_registration = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.rural_property.total_area || dataToCreate.value.rural_property.total_area.length === 0){
        formErrors.value.total_area = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.rural_property.producer_id || dataToCreate.value.rural_property.producer_id.length === 0){
        formErrors.value.producer_id = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.address.address || dataToCreate.value.address.address.length === 0){
        formErrors.value.address = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.address.number || dataToCreate.value.address.number.length === 0){
        formErrors.value.number = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.address.city || dataToCreate.value.address.city.length === 0){
        formErrors.value.city = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.address.state || dataToCreate.value.address.state.length === 0){
        formErrors.value.state = 'Este campo é obrigatório';
    }

    return !formErrors.value.name &&
    !formErrors.value.state_registration &&
    !formErrors.value.total_area && 
    !formErrors.value.producer_id && 
    !formErrors.value.address && 
    !formErrors.value.number && 
    !formErrors.value.city && 
    !formErrors.value.state;
};

</script>

<template>

    <Dialog closeIcon="none" :visible="deleteDialogIsOpen" modal header="Deletar Propriedade" :style="{ width: '50rem' }">
        <p>Deseja realmente deletar o registro?</p>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="deleteDialogIsOpen = false"></Button>
            <Button type="button" label="Deletar" severity="danger" @click="submitDeleteRegister"></Button>
        </div>
    </Dialog>

    <Dialog closeIcon="none" :visible="creationDialogIsOpen" modal header="Criar Propriedade" :style="{ width: '50rem' }">
    
        <div class="flex items-center gap-4" style="margin-bottom: 10px;">
            <label for="name" class="font-semibold w-24">Nome</label>
            <InputText v-model="dataToCreate.rural_property.name" id="name" class="flex-auto" placeholder="Informe o nome" autocomplete="off" />
            
        </div>
        <Message v-if="formErrors.name" severity="error" >{{ formErrors.name }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="state_registration" class="font-semibold w-24">Inscrição Estadual</label>
            <InputNumber v-model="dataToCreate.rural_property.state_registration" id="state_registration" class="flex-auto" placeholder="Informe a inscrição estadual" autocomplete="off" />
        </div>

        <Message v-if="formErrors.state_registration" severity="error" >{{ formErrors.state_registration }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="total_area" class="font-semibold w-24">Área Total</label>
            <InputNumber v-model="dataToCreate.rural_property.total_area" id="total_area" class="flex-auto" placeholder="Informe a área total" autocomplete="off" />
        </div>

        <Message v-if="formErrors.total_area" severity="error">{{ formErrors.total_area }}</Message>
    
        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="producer_id" class="font-semibold w-24">Produtor</label>
            <Select :options="producerSelectData" optionLabel="name" name="code" placeholder="Selecione o produtor" v-model="dataToCreate.rural_property.producer_id" id="producer_id" class="flex-auto"  autocomplete="off" />
        </div>

        <Message v-if="formErrors.producer_id" severity="error">{{ formErrors.producer_id }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="address" class="font-semibold w-24">Endereço</label>
            <InputText v-model="dataToCreate.address.address" id="address" class="flex-auto" placeholder="Informe o endereço" autocomplete="off" />
        </div>

        <Message v-if="formErrors.address" severity="error">{{ formErrors.address }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="number" class="font-semibold w-24">Número</label>
            <InputText v-model="dataToCreate.address.number" id="number" class="flex-auto" placeholder="Informe o número" autocomplete="off" />
        </div>

        <Message v-if="formErrors.number" severity="error">{{ formErrors.number }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="city" class="font-semibold w-24">Cidade</label>
            <InputText v-model="dataToCreate.address.city" id="city" class="flex-auto" placeholder="Informe a cidade" autocomplete="off" />
        </div>

        <Message v-if="formErrors.city" severity="error">{{ formErrors.city }}</Message>

        <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
            <label for="state" class="font-semibold w-24">Estado</label>
            <InputText v-model="dataToCreate.address.state" id="state" class="flex-auto" placeholder="Informe o estado" autocomplete="off" />
        </div>

        <Message v-if="formErrors.state" severity="error" >{{ formErrors.state }}</Message>
    
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="creationDialogIsOpen = false"></Button>
            <Button type="button" @click="submitCreationForm" label="Criar"></Button>
        </div>
    </Dialog>

    <div class="flex justify-end pe-6 pt-6 ">
        <Button @click="openCreationDialog" style="background-color: #111627;">Criar Propriedade Rural</Button>
    </div>

    <div class="px-6 pt-6">
        <Message  v-if="serverReturn" :life="3000" :severity="serverReturnStatus">
            <p >{{serverReturnMessage}}</p>
        </Message>
    </div>

    <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="ruralProperties" lazy :totalRecords="totalRecords" @page="getRuralProperties" :paginator="true" :rows="perPage">
         <template #header>
            <div class="flex flex-wrap items-center justify-center gap-2">
                <p class="text-xl font-bold">Propriedades Rurais</p>
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
</template>
