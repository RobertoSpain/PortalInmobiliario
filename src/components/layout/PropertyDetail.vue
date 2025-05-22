<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../../firebasej';
import { doc, getDoc } from 'firebase/firestore';

const route = useRoute();
const property = ref(null);
const loading = ref(true);
const imageIndex = ref(0);

onMounted(() => {
  const id = route.params.id;
  if (!id) return;
  const docRef = doc(db, 'propiedades', id);
  getDoc(docRef).then(docSnap => {
    if (docSnap.exists()) {
      property.value = { id: docSnap.id, ...docSnap.data() };
    }
    loading.value = false;
    // Leaflet solo si hay coordenadas
    if (property.value && property.value.lat && property.value.lng) {
      if (!window.L) {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(leafletCss);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
        script.onload = () => initMap();
        document.body.appendChild(script);
      } else {
        initMap();
      }
    }
  });
});

function initMap() {
  const L = window.L;
  const map = L.map('map').setView([property.value.lat, property.value.lng], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([property.value.lat, property.value.lng]).addTo(map)
    .bindPopup(property.value.titulo || 'Propiedad').openPopup();
}

const totalImages = computed(() => property.value?.imagenes?.length || 0);

function prevImage() {
  if (totalImages.value > 0) {
    imageIndex.value = (imageIndex.value - 1 + totalImages.value) % totalImages.value;
  }
}
function nextImage() {
  if (totalImages.value > 0) {
    imageIndex.value = (imageIndex.value + 1) % totalImages.value;
  }
}

watch(property, () => {
  imageIndex.value = 0;
});
</script>

<template>
  <section class="property-detail">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="property" class="property-content">
      <!-- Imagen principal grande -->
      <div class="main-image-bar">
        <img :src="property.imagenes?.[imageIndex] || 'https://via.placeholder.com/1200x350'" class="main-img-bar" />
        <!-- Controles del carrusel -->
        <div class="carousel-controls" v-if="totalImages > 1">
          <button @click="prevImage" class="control-btn prev-btn">‹</button>
          <button @click="nextImage" class="control-btn next-btn">›</button>
        </div>
        <!-- Dots del carrusel -->
        <div v-if="totalImages > 1" class="carousel-dots-detail">
          <span v-for="(img, idx) in property.imagenes" :key="idx" :class="['dot', { active: idx === imageIndex }]" @click="imageIndex = idx"></span>
        </div>
      </div>
      <div class="property-info-flex">
        <div class="property-info-block">
          <h1 class="property-title">
            {{ property.titulo }}
            <span v-if="typeof property.oferta === 'number' && property.oferta < property.precio">
              - <span style="color:#00b359;font-weight:700">{{ property.oferta }}€</span>
              <span style="text-decoration:line-through;color:#888;font-size:1.2rem;margin-left:10px">{{ property.precio }}€</span>
            </span>
            <span v-else-if="property.precio">
              - {{ property.precio }}€
            </span>
          </h1>
          <div class="property-address">{{ property.direccion }}</div>
          <div class="category-badge" v-if="property.tipo">
            <span :class="['badge', property.tipo === 'alquiler' ? 'rent' : 'sale']">
              {{ property.tipo === 'alquiler' ? 'For Rent' : 'For Sale' }}
            </span>
          </div>
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-value">{{ property.dormitorios }}</span>
              <span class="feature-label">Bedroom</span>
            </div>
            <div class="feature-item">
              <span class="feature-value">{{ property.banos }}</span>
              <span class="feature-label">Bathroom</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Mapa interactivo con Leaflet -->
      <div class="location-block">
        <div class="location-title">Location</div>
        <div class="map-static">
          <div id="map" class="map-img"></div>
        </div>
      </div>
      <!-- Botón grande -->
      <div class="contact-bar">
        <button class="contact-btn">Contact Landlord</button>
      </div>
    </div>
    <div v-else class="not-found">Propiedad no encontrada.</div>
  </section>
</template>

<style scoped>
.property-detail {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  border-radius: 0;
  background: #f7f8fc;
  box-sizing: border-box;
  overflow-x: hidden;
  padding-bottom: 120px;
}

.main-image-bar {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  background: #222;
  position: relative;
}

.main-img-bar {
  width: 100vw;
  max-width: 100vw;
  height: 260px;
  object-fit: cover;
  display: block;
}

.property-info-flex {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 32px 0 0 0;
  width: 100vw;
  margin: 0;
}

.property-info-block {
  background: none;
  padding: 32px 0 0 48px;
  width: 100%;
  text-align: left;
}

.property-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #111;
}

.property-address {
  font-size: 1.25rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 18px;
}

.category-badge {
  margin-bottom: 18px;
}

.badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.rent {
  background: #16c96e;
}

.sale {
  background: #0077cc;
}

.features-list {
  display: flex;
  gap: 32px;
  margin-top: 10px;
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  color: #555;
}

.feature-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: #222;
}

.feature-label {
  font-size: 1.1rem;
  color: #888;
}

.location-block {
  width: 100vw;
  margin: 0;
  padding: 0;
}

.location-title {
  font-weight: bold;
  margin: 18px 0 8px 0;
  font-size: 2rem;
  color: #111;
  text-align: left;
  padding-left: 48px;
}

.map-static {
  width: 100%;
  min-height: 220px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.map-img {
  width: 100%;
  min-width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.contact-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 48px 0 0 0;
  background: transparent;
}

.contact-btn {
  width: 90%;
  max-width: 900px;
  background: #00d264;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 32px 0;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 204, 102, 0.15);
  margin: 0 auto;
  display: block;
}

.contact-btn:hover {
  background: #00b359;
}

/* Estilos del carrusel de imágenes */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 32px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  color: #222;
  cursor: pointer;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
}

.carousel-dots-detail {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: #00d264;
}

@media (max-width: 900px) {
  .main-img-bar, .main-image-bar {
    height: 180px;
    min-height: 180px;
  }
  .property-info-flex {
    flex-direction: column;
    padding: 18px 0 0 0;
    width: 100vw;
  }
  .property-info-block {
    padding: 18px 8px 0 8px;
    width: 100%;
  }
  .location-block {
    padding: 0;
    width: 100vw;
  }
  .location-title {
    padding-left: 8px;
    font-size: 1.3rem;
  }
  .map-img {
    height: 180px;
  }
  .contact-btn {
    width: 95%;
  }
}
</style>