<script setup>
import { RouterView, useRoute } from 'vue-router'
import navbar from './components/Navbar.vue';
import 'primeicons/primeicons.css'

const route = useRoute();
</script>

<template>
  <link href="/src/style.css" rel="stylesheet">
  <navbar v-if="route.path !== '/login'"/>
  <RouterView></RouterView>
</template>

<style >
  body{
    background-color: white;
  }
</style>