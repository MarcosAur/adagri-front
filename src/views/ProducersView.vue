<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { apiBaseUrl } from '@/setting';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { Dialog, InputText, Button, DatePicker, Message, ProgressSpinner } from 'primevue';
import { useAuthStore } from '@/stores/login';


onMounted(async () => {

    isLoading.value = true;
    await getProducers();
    isLoading.value = false;
});

const isLoading = ref(false);
const authStore = useAuthStore();
const registerToDeleteId = ref(null);
const serverReturn = ref(false);
const serverReturnMessage = ref('');
const serverReturnStatus = ref('');
const creationDialogIsOpen = ref(false);
const deleteDialogIsOpen = ref(false);
const dataToCreate = ref({
    producer: {
        id: null,
        name: '',
        document: '',
        phone: '',
        email: '',
        register_date: null
    },
    address: {
        address: '',
        number: '',
        city: '',
        state: ''
    }
});
const columns = [
    { field: 'name', header: 'Nome' },
    { field: 'document', header: 'Documento' },
    { field: 'phone', header: 'Telefone' },
    { field: 'email', header: 'Email' },
    { field: 'register_date', header: 'Data de Registro' },
    { field: 'address', header: 'Endereço' },
    { field: 'number', header: 'Número' },
    { field: 'city', header: 'Cidade' },
    { field: 'state', header: 'Estado' },
];
const producers = ref([]);
const totalRecords = ref(1);
const perPage = ref(10)
const formErrors = ref({
    name: null,
    document: null,
    phone: null,
    email: null,
    register_date: null,
    address: null,
    number: null,
    city: null,
    state: null
});

const clearErrors = () => {
    formErrors.value = {
        name: null,
        document: null,
        phone: null,
        email: null,
        register_date: null,
        address: null,
        number: null,
        city: null,
        state: null
    };
}

const getProducers = async (pagination) => {
    try{
        const url = pagination ? `${apiBaseUrl}/api/producer?page=${pagination.page + 1}` : `${apiBaseUrl}/api/producer`;
        producers.value = [];
        const response = await axios.get(url, {
            params: {
                filters: {
                    per_page: perPage.value
                }
            },
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
        
        response.data.data.forEach((producer) => {
            producers.value.push({
                id: producer.id,
                name: producer.name,
                document: producer.document,
                phone: producer.phone,
                email: producer.email,
                register_date: new Date(producer.register_date).toLocaleDateString('pt-BR'),
                address: producer.address.address,
                number: producer.address.number,
                city: producer.address.city,
                state: producer.address.state
            });
        });

        totalRecords.value = response.data.total;


    }catch(error){
        console.error(error);
    }
    
}


const openUpdateRegisterModal = (data) => {

    dataToCreate.value = {
        producer: {
            id: data.id,
            name: data.name,
            document: data.document,
            phone: data.phone,
            email: data.email,
            register_date: data.register_date,
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

const openCreationDialog = () => {
    dataToCreate.value = {
        producer: {
            id: null,
            name: '',
            document: '',
            phone: '',
            email: '',
            register_date: null
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

const submitCreationForm = async () => {
    isLoading.value = true;
    serverReturn.value = false;
    const validated = validateForm();
    if(!validated){
        isLoading.value = false;
        return;
    }

    if(dataToCreate.value.producer.id){
        await axios.put(`${apiBaseUrl}/api/producer/${dataToCreate.value.producer.id}`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
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
        await axios.post(`${apiBaseUrl}/api/producer`, dataToCreate.value, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
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
    
    await getProducers();
    creationDialogIsOpen.value = false;
    isLoading.value = false;
}

const submitDeleteRegister = async () => {
    isLoading.value = true;
    try{
        await axios.delete(`${apiBaseUrl}/api/producer/${registerToDeleteId.value}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
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
    await getProducers();
    isLoading.value = false;
}

const validateForm = () => {
    clearErrors();
    if(!dataToCreate.value.producer.name || dataToCreate.value.producer.name.length === 0){
        formErrors.value.name = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.producer.document || dataToCreate.value.producer.document.length === 0){
        formErrors.value.document = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.producer.phone || dataToCreate.value.producer.phone.length === 0){
        formErrors.value.phone = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.producer.email || dataToCreate.value.producer.email.length === 0){
        formErrors.value.email = 'Este campo é obrigatório';
    }

    if(!dataToCreate.value.producer.register_date){
        formErrors.value.register_date = 'Este campo é obrigatório';
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
    !formErrors.value.document &&
    !formErrors.value.phone && 
    !formErrors.value.email && 
    !formErrors.value.register_date && 
    !formErrors.value.address && 
    !formErrors.value.number && 
    !formErrors.value.city && 
    !formErrors.value.state;
};

</script>

<template>
    <div class="w-full min-h-screen flex justify-center items-center" v-if="isLoading">
        <ProgressSpinner />
    </div>
  
    <div v-else>
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
                <InputText v-model="dataToCreate.producer.name" id="name" class="flex-auto" placeholder="Informe o nome" autocomplete="off" />
                
            </div>
            <Message v-if="formErrors.name" severity="error" >{{ formErrors.name }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="document" class="font-semibold w-24">Documento</label>
                <InputText v-model="dataToCreate.producer.document" id="document" class="flex-auto" placeholder="Informe o numero do documento" autocomplete="off" />
            </div>

            <Message v-if="formErrors.document" severity="error" >{{ formErrors.document }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="phone" class="font-semibold w-24">Telefone</label>
                <InputText v-model="dataToCreate.producer.phone" id="phone" class="flex-auto" placeholder="Informe o telefone" autocomplete="off" />
            </div>

            <Message v-if="formErrors.phone" severity="error">{{ formErrors.phone }}</Message>
        
            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="email" class="font-semibold w-24">Email</label>
                <InputText v-model="dataToCreate.producer.email" id="email" class="flex-auto" placeholder="Informe o email" autocomplete="off" />
            </div>

            <Message v-if="formErrors.email" severity="error">{{ formErrors.email }}</Message>

            <div class="flex items-center gap-4 pt-3" style="margin-bottom: 10px;">
                <label for="register_date" class="font-semibold w-24">Data de Registro</label>
                <DatePicker dateFormat="dd/mm/yy" fluid v-model="dataToCreate.producer.register_date" class="w-162" placeholder="Informe a data" id="register_date"/>
            </div>

            <Message v-if="formErrors.register_date" severity="error">{{ formErrors.register_date }}</Message>

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
                <Button type="button" label="Criar" @click="submitCreationForm"></Button>
            </div>
        </Dialog>

        <div class="flex justify-end pe-6 pt-6 ">
            <Button @click="openCreationDialog" style="background-color: #111627;">Criar Produtor</Button>
        </div>

        <div class="px-6 pt-6">
            <Message  v-if="serverReturn" :life="3000" :severity="serverReturnStatus">
                <p >{{serverReturnMessage}}</p>
            </Message>
        </div>

        <DataTable style="border-radius: 0; padding: 25px" showGridlines :value="producers" lazy :totalRecords="totalRecords" @page="getProducers" :paginator="true" :rows="perPage">
            <template #header>
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <p class="text-xl font-bold">Produtores</p>
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
    </div>
    
</template>
