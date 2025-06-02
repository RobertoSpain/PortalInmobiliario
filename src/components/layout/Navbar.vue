<template>
  <!-- Barra de navegación inferior -->
  <nav class="navbar">
    <!-- Enlace a la página de exploración -->
    <router-link to="/" class="nav-item active">
      <div class="nav-icon-container">
        <span class="material-icons nav-icon">explore</span> <!-- Icono de exploración -->
      </div>
      <span class="nav-text">Explore</span> <!-- Texto del enlace -->
    </router-link>
    <!-- Enlace a la página de ofertas -->
    <router-link to="/offers" class="nav-item">
      <div class="nav-icon-container">
        <span class="material-icons nav-icon">local_offer</span> <!-- Icono de ofertas -->
      </div>
      <span class="nav-text">Offers</span> <!-- Texto del enlace -->
    </router-link>
    <!-- Enlace a la página de perfil -->
    <router-link to="/profile" class="nav-item">
      <div class="nav-icon-container">
        <span class="material-icons nav-icon">person_outline</span> <!-- Icono de perfil -->
      </div>
      <span class="nav-text">Profile</span> <!-- Texto del enlace -->
    </router-link>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons'); 

.navbar {
  position: fixed; 
  bottom: 0;
  left: 0;
  width: 100%; 
  height: 70px; 
  background-color: white; 
  display: flex; 
  justify-content: space-evenly; 
  align-items: center; 
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); 
  z-index: 1000; 
  border-top: 1px solid #e0e0e0; 
  padding: 0; 
}

.nav-item {
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  color: #888; 
  text-decoration: none; 
  transition: color 0.2s; 
  height: 100%; 
  max-width: 15%; 
}

.nav-icon-container {
  display: flex; 
  justify-content: center;
  align-items: center;
}

.nav-icon {
  font-size: 28px; 
  margin-bottom: 0; 
}

.nav-text {
  font-size: 14px; 
  font-weight: 500; 
  margin-top: 1px; 
}

.nav-item.active {
  color: #333; 
}

.nav-item.router-link-exact-active {
  color: #333; 
}
</style>