<script setup>
import Navbar from './components/layout/Navbar.vue';
</script>

<template>
  <!-- Contenedor principal de la aplicación -->
  <div class="app-container">
    <!-- Barra de navegación superior (Navbar) -->
    <Navbar />
    <!-- Contenido principal de la página -->
    <main class="main-content">
      <!-- Aquí se renderizan las vistas según la ruta activa -->
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