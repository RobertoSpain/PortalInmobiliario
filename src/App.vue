<script setup>
import Navbar from './components/layout/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

</style>