<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'; // ref para variables reactivas, onMounted para ejecutar código al montar el componente, computed para valores calculados, watch para observar cambios y nextTick para ejecutar código después de renderizar
import { useRoute } from 'vue-router'; // useRoute para acceder a los parámetros de la ruta
import { db } from '../../firebasej'; // Importa la configuración de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Métodos para interactuar con Firestore

// Declaración de variables reactivas
const route = useRoute(); // Obtiene la información de la ruta actual
const property = ref(null); // Almacena los datos de la propiedad obtenida
const loading = ref(true); // Indica si los datos están cargando
const imageIndex = ref(0); // Índice de la imagen actual en el carrusel
const formattedAddress = ref(''); // Dirección formateada obtenida de las coordenadas
let mapInstance = null; // Instancia del mapa interactivo

// Hook que se ejecuta al montar el componente
onMounted(() => {
  const id = route.params.id; // Obtiene el ID de la propiedad desde los parámetros de la ruta
  if (!id) return; // Si no hay ID, no hace nada
  const docRef = doc(db, 'propiedades', id); // Referencia al documento en Firestore
  getDoc(docRef).then(docSnap => {
    if (docSnap.exists()) {
      property.value = { id: docSnap.id, ...docSnap.data() }; // Almacena los datos de la propiedad
    }
    loading.value = false; // Cambia el estado de carga
    // Inicializa Leaflet solo si hay coordenadas
    if (property.value && property.value.lat && property.value.lng) {
      fetchAddressFromCoords(property.value.lat, property.value.lng); // Obtiene la dirección formateada
      if (!window.L) { // Si Leaflet no está cargado, lo carga dinámicamente
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(leafletCss);
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
        script.onload = () => {
          nextTick().then(() => initMap()); // Inicializa el mapa después de cargar Leaflet
        };
        document.body.appendChild(script);
      } else {
        nextTick().then(() => initMap()); // Inicializa el mapa si Leaflet ya está cargado
      }
    }
  });
});

// Función para obtener la dirección formateada desde las coordenadas
function fetchAddressFromCoords(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => {
      formattedAddress.value = data.display_name || ''; // Almacena la dirección obtenida
    })
    .catch(() => {
      formattedAddress.value = ''; // Manejo de errores
    });
}

// Función para inicializar el mapa interactivo con Leaflet
function initMap() {
  const L = window.L; // Accede a la librería Leaflet
  const mapDiv = document.getElementById('map'); // Obtiene el div del mapa
  if (mapDiv) {
    mapDiv.innerHTML = ''; // Limpia el contenido del div si ya hay un mapa
  }
  if (mapInstance) {
    mapInstance.remove(); // Elimina la instancia del mapa si existe
    mapInstance = null;
  }
  mapInstance = L.map('map').setView([property.value.lat, property.value.lng], 13); // Crea el mapa centrado en las coordenadas de la propiedad
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance); // Agrega las capas del mapa
  L.marker([property.value.lat, property.value.lng]).addTo(mapInstance)
    .bindPopup(property.value.titulo || 'Propiedad').openPopup(); // Agrega un marcador con un popup
}

// Computed para calcular el total de imágenes disponibles
const totalImages = computed(() => property.value?.imagenes?.length || 0);

// Función para mostrar la imagen anterior en el carrusel
function prevImage() {
  if (totalImages.value > 0) {
    imageIndex.value = (imageIndex.value - 1 + totalImages.value) % totalImages.value; // Calcula el índice de la imagen anterior
  }
}

// Función para mostrar la siguiente imagen en el carrusel
function nextImage() {
  if (totalImages.value > 0) {
    imageIndex.value = (imageIndex.value + 1) % totalImages.value; // Calcula el índice de la siguiente imagen
  }
}

// Observa cambios en la propiedad y reinicia el índice de la imagen
watch(property, () => {
  imageIndex.value = 0; // Reinicia el índice de la imagen al cambiar la propiedad
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
          <div class="property-address">{{ formattedAddress || property.direccion }}</div>
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
            <div class="feature-item" v-if="property.parking">
              <span class="feature-value">{{ property.parking }}</span>
              <span class="feature-label">Parking</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Mapa interactivo con Leaflet -->
      <div class="location-block">
        <div class="location-title">Location</div>
        <div class="map-static">
          <div id="map" class="leaflet-map"></div>
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

.leaflet-map {
  width: 100%;
  height: 300px;
  min-height: 220px;
}

.contact-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 48px 0 0 0;
  background: transparent;
}

.contact-btn {
  width: 80%;
  max-width: 320px;
  background: #00d264;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 32px 0;
  font-size: 2rem;
  font-weight: 200;
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