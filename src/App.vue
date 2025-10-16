<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { Button } from 'primevue';
import navbar from './components/Navbar.vue';
</script>

<template>
  <link href="/src/style.css" rel="stylesheet">
  <navbar/>
  <RouterView></RouterView>
</template>

<style >
  body{
    background-color: white;
  }
</style>