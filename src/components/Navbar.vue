<script setup>
import {Toolbar} from 'primevue';
import { RouterLink } from 'vue-router';
</script>
<template>
    <div class="w-full h-full">
      <Toolbar style="background-color: #111627; border-color: #111627; border-radius: 0;" class="h-18">
        <template #start>
          <RouterLink style="padding-left: 10px;" class="text-white" to="/">Adagri</RouterLink>
        </template>
        <template #center>
          <div class="flex items-center gap-10">
            <RouterLink class="text-white" to="propriedades">Propriedades</RouterLink>
            <RouterLink class="text-white" to="produtores-rurais">Produtores Rurais</RouterLink>
            <RouterLink class="text-white" to="unidades-produtoras">Unidades Produtoras</RouterLink>
            <RouterLink class="text-white" to="rebanhos">Rebanhos</RouterLink>
          </div>
        </template>
      </Toolbar>
    </div>
</template>
