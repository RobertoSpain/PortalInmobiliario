<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebasej';
import { collection, getDocs, query, where } from 'firebase/firestore';

const carouselProperties = ref([]); 
const currentIndex = ref(0); // Para controlar las propiedades del carrusel

onMounted(() => {
  // 1. Obtener una propiedad aleatoria en oferta
  const offersQuery = query(collection(db, 'propiedades'), where('oferta', '==', true));
  getDocs(offersQuery).then(offersSnapshot => {
    const offers = offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let ofertaDestacada = null;
    if (offers.length > 0) {
      ofertaDestacada = offers[Math.floor(Math.random() * offers.length)];
    }
    // 2. Obtener las 2 últimas de alquiler
    const alquilerQuery = query(collection(db, 'propiedades'), where('tipo', '==', 'alquiler'));
    getDocs(alquilerQuery).then(alquilerSnapshot => {
      const alquileres = alquilerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      alquileres.sort((a, b) => b.fechaAlta?.toMillis?.() - a.fechaAlta?.toMillis?.());
      const ultimosAlquiler = alquileres.slice(0, 2);

      // 3. Obtener las 2 últimas de venta
      const ventaQuery = query(collection(db, 'propiedades'), where('tipo', '==', 'venta'));
      getDocs(ventaQuery).then(ventaSnapshot => {
        const ventas = ventaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        ventas.sort((a, b) => b.fechaAlta?.toMillis?.() - a.fechaAlta?.toMillis?.());
        const ultimasVentas = ventas.slice(0, 2);

        // 4. Unir en el orden: oferta, 2 alquiler, 2 venta (modo sencillo)
        carouselProperties.value = [];
        if (ofertaDestacada) carouselProperties.value.push(ofertaDestacada);
        ultimosAlquiler.forEach(p => carouselProperties.value.push(p));
        ultimasVentas.forEach(p => carouselProperties.value.push(p));
        currentIndex.value = 0; // Siempre empieza en la primera
      });
    });
  });
});
</script>

<template>
  <section class="home">
    <h1 class="title">Explore</h1>
    <!-- Carrusel de 5 propiedades: 1 oferta, 2 alquiler, 2 venta -->
    <div class="section">
      <h2 class="section-title">Recommended</h2>
      <div v-if="carouselProperties.length > 0" class="carousel">
        <div 
          v-for="(property, index) in carouselProperties" 
          :key="property.id" 
          class="carousel-item" 
          :class="{ active: index === currentIndex }"
        >
          <img 
            :src="(property.imagenes && property.imagenes[0]) || '/img/default.jpg'" 
            :alt="property.titulo" 
            class="carousel-image" 
          />
          <div class="carousel-title-bar">
            <h3 class="carousel-title">{{ property.titulo }}</h3>
          </div>
          <div class="carousel-overlay">
            <div class="price-tag">
              <template v-if="property.descuento && property.descuento > 0">
                €{{ property.precio - property.descuento }}
                <span class="old-price" style="text-decoration:line-through; color:#888; margin-left:8px;">€{{ property.precio }}</span>
                <span class="discount-label" style="color:#e53935; margin-left:8px;">-{{ property.descuento }}€</span>
              </template>
              <template v-else>
                €{{ property.precio }}
              </template>
            </div>
          </div>
        </div>
        <!-- Puntos del carrusel -->
        <div class="carousel-dots">
          <span 
            v-for="(_, idx) in carouselProperties" 
            :key="idx" 
            :class="['dot', { active: idx === currentIndex }]"
            @click="currentIndex = idx"
            style="cursor:pointer;"
          />
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No hay propiedades destacadas disponibles.</p>
      </div>
    </div>

    <!-- Categorías -->
    <div class="section">
      <h2 class="section-title">Categories</h2>
      <div class="categories-grid">
        <!-- Categoría: Places for Rent -->
        <router-link to="/category/alquiler" class="category-card">
          <img src="/img/renta.jpg" alt="Apartamentos en alquiler" class="category-image" />
          <div class="category-label">Places for Rent</div>
        </router-link>

        <!-- Categoría: Places for Sale -->
        <router-link to="/category/venta" class="category-card">
          <img src="/img/sale.jpg" alt="Propiedades en venta" class="category-image" />
          <div class="category-label">Places for Sale</div>
        </router-link>
      </div>
    </div>
  </section>
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
}
</style>