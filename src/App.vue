<script setup>
import { RouterView } from 'vue-router'
import navbar from './components/Navbar.vue';
import 'primeicons/primeicons.css'
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