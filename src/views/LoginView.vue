<script setup>
import loginService from "@/services/LoginService";
import { useAuthStore } from "@/stores/login";
import { Button, InputText, Password, Message } from "primevue";
import { ref } from "vue";

const loginData = ref({
    email: null,
    password: null
})

const loginErrors = ref({
    email: null,
    password: null
});

const clearErrors = () => {
    loginErrors.value = {
        email: null,
        password: null
    }   
}

const responseErrors = ref([]);

const validateForm = () => {
    clearErrors()
    if (!loginData.value.email || loginData.value.email.length === 0){
        loginErrors.value.email = 'O email precisa ser preenchido'
    }

    if (!loginData.value.password || loginData.value.password.length === 0){
        loginErrors.value.password = 'A senha precisa ser preenchida'
    }

    return !loginErrors.value.email && !loginErrors.value.password;
}

const sendLogin = async () => {
    responseErrors.value = [];
    if(!validateForm()){
        return ;
    }

    try{
        const response = await loginService.getToken(loginData.value);
        useAuthStore().setToken(response);
        window.location.replace('/')

    } catch (error){

        if ('errors' in error.response.data) {
            responseErrors.value = Object.values(error.response.data.errors).flat()
        } else {
            responseErrors.value.push('Erro desconhecido no servidor')
        }
    }
}
</script>
<template>
    <div class="card flex flex-col text-black min-h-screen justify-center items-center" style="background-color: #111627;">
        
        <div>
            <h1 class="text-white" style="font-size: 40px;">Login</h1>
        </div>
        
        <div class="rounded card flex flex-col text-black min-h-[15rem] w-[40rem] p-10 gap-5 items-center" style="background-color: #FFFFF9; border-radius: 20px;">    
            <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Username</label>
                <div>
                    <InputText v-model="loginData.email" id="username" class="flex-auto" autocomplete="off" />
                    <p v-if="loginErrors.email" class="pt-2" style="color: red;">{{ loginErrors.email }}</p>
                </div>
                
            </div>
            
            <div class="flex items-center gap-4 mb-4">
                <label for="password" class="font-semibold w-24">Password</label>
                <div>
                    <Password v-model="loginData.password" id="password" :feedback="false" class="flex-auto" autocomplete="off" />
                    <p v-if="loginErrors.password" class="pt-2" style="color: red;">{{ loginErrors.password }}</p>
                </div>
            </div>

            <Message severity="error" v-if="responseErrors.length > 0" life="3000">
                <ul>
                    <li v-for="error in responseErrors">{{ error }}</li>
                </ul>
            </Message>

            <div class="flex items-center gap-4 mb-4">
                <Button type="button" label="Entrar" @click="sendLogin" style="background-color: #111627;"></Button>
            </div>
        </div>
        
    </div>
</template>

