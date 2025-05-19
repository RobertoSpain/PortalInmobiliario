<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/layout/Navbar.vue';

const auth = getAuth();
const router = useRouter();

// Verificar estado de autenticación cuando se inicia la aplicación
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado, redirigir a la página principal
      router.push('/');
    } else {
      // Usuario no autenticado, redirigir a la página de inicio de sesión
      router.push('/login');
    }
  });
});
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