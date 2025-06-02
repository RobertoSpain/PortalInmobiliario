<script setup>
// Importación de funciones y módulos necesarios
import { ref, onMounted } from 'vue'; // ref para variables reactivas y onMounted para ejecutar código al montar el componente
import { db } from '../../firebasej'; // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Métodos para interactuar con Firestore

// Declaración de variables reactivas
const productos = ref([]); // Almacena los productos obtenidos de Firestore
const currentIndex = ref(0); // Índice actual del carrusel
const cargando = ref(true); // Estado de carga de los productos

// Función para obtener productos desde Firestore
function obtenerProductos() {
  getDocs(collection(db, 'propiedades')) // Obtiene documentos de la colección 'propiedades'
    .then((querySnapshot) => {
      const productosObtenidos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapea los documentos obtenidos a objetos
      const productosAleatorios = productosObtenidos.sort(() => Math.random() - 0.5).slice(0, 5); // Ordena aleatoriamente y selecciona los primeros 5
      productos.value = productosAleatorios; // Actualiza la variable reactiva
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error); // Manejo de errores
    })
    .finally(() => {
      cargando.value = false; // Cambia el estado de carga
    });
}

// Ejecuta la función obtenerProductos al montar el componente
onMounted(() => {
  obtenerProductos();
});

</script>

<template>
  <!-- Sección principal de la página -->
  <section class="home">
    <h1 class="title">Explore</h1>
    <!-- Carrusel de productos aleatorios -->
    <div class="section">
      <h2 class="section-title">Recommended</h2>
      <div v-if="!cargando && productos.length > 0" class="carousel">
        <!-- Itera sobre los productos para mostrarlos en el carrusel -->
        <div 
          v-for="(producto, idx) in productos" 
          :key="producto.id" 
          class="carousel-item" 
          :class="{ active: idx === currentIndex }"
        >
          <!-- Imagen del producto -->
          <img 
            :src="(producto.imagenes && producto.imagenes[0]) || '/img/default.jpg'" 
            :alt="producto.titulo" 
            class="carousel-image" 
          />
          <!-- Título del producto -->
          <div class="carousel-title-bar">
            <h3 class="carousel-title">{{ producto.titulo }}</h3>
          </div>
          <!-- Información adicional del producto -->
          <div class="carousel-overlay">
            <div class="price-tag">
              <!-- Muestra el precio con descuento si aplica -->
              <template v-if="producto.descuento && producto.descuento > 0">
                €{{ producto.precio - producto.descuento }}
                <span class="old-price" style="text-decoration:line-through; color:#888; margin-left:8px;">€{{ producto.precio }}</span>
                <span class="discount-label" style="color:#e53935; margin-left:8px;">-{{ producto.descuento }}€</span>
              </template>
              <!-- Muestra el precio normal si no hay descuento -->
              <template v-else>
                €{{ producto.precio }}
              </template>
            </div>
          </div>
        </div>
        <!-- Puntos del carrusel para navegación -->
        <div class="carousel-dots">
          <span 
            v-for="(_, idx) in productos" 
            :key="idx" 
            :class="['dot', { active: idx === currentIndex }]"
            @click="currentIndex = idx"
            style="cursor:pointer;"
          />
        </div>
      </div>
      <!-- Mensaje si no hay productos disponibles -->
      <div v-else-if="!cargando" class="empty-state">
        <p>No hay productos aleatorios disponibles.</p>
      </div>
      <!-- Mensaje de carga -->
      <div v-else class="empty-state">
        <p>Cargando productos...</p>
      </div>
    </div>

    <!-- Sección de categorías -->
    <div class="section">
      <h2 class="section-title">Categories</h2>
      <div class="categories-grid">
        <!-- Categoría: Lugares en alquiler -->
        <router-link to="/category/alquiler" class="category-card">
          <img src="/img/renta.jpg" alt="Apartamentos en alquiler" class="category-image" />
          <div class="category-label">Places for Rent</div>
        </router-link>

        <!-- Categoría: Lugares en venta -->
        <router-link to="/category/venta" class="category-card">
          <img src="/img/sale.jpg" alt="Propiedades en venta" class="category-image" />
          <div class="category-label">Places for Sale</div>
        </router-link>
      </div>
    </div>
  </section>
  <!-- Barra de navegación inferior -->
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" exact-active-class="active">
      <span class="material-icons nav-icon">explore</span>
      <span class="nav-label">Explore</span>
    </router-link>
    <router-link to="/offers" class="nav-item" exact-active-class="active">
      <span class="material-icons nav-icon">local_offer</span>
      <span class="nav-label">Offers</span>
    </router-link>
    <router-link to="/profile" class="nav-item" exact-active-class="active">
      <span class="material-icons nav-icon">person_outline</span>
      <span class="nav-label">Profile</span>
    </router-link>
  </nav>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  z-index: 1;
}

.carousel-item.active {
  opacity: 1;
  z-index: 2;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-title-bar {
  position: absolute;
  left: 0;
  bottom: 60px;
  width: 100%;
  background: rgba(0,0,0,0.7);
  padding: 16px 0 16px 24px;
  z-index: 3;
}

.carousel-title {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 8px rgba(0,0,0,0.5);
}

.carousel-overlay {
  position: absolute;
  left: 24px;
  bottom: 16px;
  z-index: 4;
}

.price-tag {
  background-color: white;
  color: black;
  font-weight: bold;
  display: inline-block;
  padding: 8px 24px;
  border-radius: 24px;
  font-size: 1.4rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.carousel-dots {
  position: absolute;
  right: 24px;
  bottom: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.5;
  transition: opacity 0.3s;
  border: 2px solid #fff;
}

.dot.active {
  opacity: 1;
  background: #222;
  border: 2px solid #fff;
}

.empty-state {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 24px;
}

.home {
  padding: 20px 16px 80px 16px;
  background-color: #f7f8fc;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin: 20px 0 16px 0;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0;
}

.categories-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-card {
  width: 500px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-decoration: none;
  color: inherit;
}

.category-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.category-label {
  font-size: 1.2rem;
  font-weight: 500;
  padding: 12px 0 10px 0;
  text-align: center;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: auto;
  margin-right: auto;
  width: 350px;
  height: 80px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.07);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  border-top: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  transition: color 0.2s;
}

.nav-item.active,
.nav-item.router-link-exact-active {
  color: #222;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 1rem;
  margin-top: 2px;
}

@media (min-width: 768px) {
  .home {
    max-width: 1200px;
    margin: 0 auto;
  }
  .carousel {
    height: 400px;
  }
  .categories-grid {
    flex-wrap: wrap;
  }
  .category-card {
    min-width: 250px;
  }
  .bottom-nav {
    display: none;
  }
}
</style>