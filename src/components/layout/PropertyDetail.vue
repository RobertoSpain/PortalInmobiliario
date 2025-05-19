<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../../firebasej';
import { doc, getDoc } from 'firebase/firestore';

const route = useRoute();
const property = ref(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;
  if (!id) return;
  const docRef = doc(db, 'propiedades', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    property.value = { id: docSnap.id, ...docSnap.data() };
  }
  loading.value = false;
});
</script>

<template>
  <section class="property-detail">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="property" class="property-content">
      <!-- Imagen principal grande -->
      <div class="main-image-bar">
        <img :src="property.imagenes?.[0] || 'https://via.placeholder.com/1200x350'" class="main-img-bar" />
      </div>
      <div class="property-info-flex">
        <div class="property-info-block">
          <h1>{{ property.titulo }} <span v-if="property.precio">- {{ property.precio }}€</span></h1>
          <div class="address">{{ property.direccion }}</div>
          <div class="category-badge" v-if="property.tipo">
            <span :class="['badge', property.tipo === 'alquiler' ? 'rent' : 'sale']">
              {{ property.tipo === 'alquiler' ? 'For Rent' : 'For Sale' }}
            </span>
          </div>
          <div class="features">
            <span>{{ property.dormitorios }} Bedroom{{ property.dormitorios === 1 ? '' : 's' }}</span>
            <span>{{ property.banos }} Bathroom{{ property.banos === 1 ? '' : 's' }}</span>
          </div>
        </div>
      </div>
      <!-- Mapa estático -->
      <div class="location-block">
        <div class="location-title">Location</div>
        <div class="map-static">
          <img src="https://static-maps.yandex.ru/1.x/?lang=en-US&ll=-5.073,50.418&z=12&l=map&size=800,300" alt="Static map" class="map-img" />
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
  background: #f7f8fc;
  min-height: 100vh;
  padding: 0 0 90px 0;
}
.main-image-bar {
  width: 100vw;
  max-width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: #222;
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
  max-width: 1200px;
  margin: 0 auto;
}
.property-info-block {
  background: none;
  padding: 0 32px;
  min-width: 350px;
}
h1 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 8px 0;
}
.address {
  color: #222;
  font-size: 1.05rem;
  margin-bottom: 8px;
}
.category-badge {
  margin-bottom: 8px;
}
.badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}
.rent {
  background: #00cc66;
}
.sale {
  background: #0077cc;
}
.features {
  display: flex;
  gap: 18px;
  font-size: 1.05rem;
  color: #222;
  margin-bottom: 12px;
}
.location-block {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.location-title {
  font-weight: bold;
  margin: 18px 0 8px 0;
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
  margin: 32px 0 0 0;
}
.contact-btn {
  width: 60%;
  max-width: 600px;
  background: #00cc66;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 18px 0;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-btn:hover {
  background: #00b359;
}
@media (max-width: 900px) {
  .main-img-bar, .main-image-bar {
    height: 180px;
    min-height: 180px;
  }
  .property-info-flex {
    flex-direction: column;
    padding: 18px 0 0 0;
  }
  .property-info-block {
    padding: 0 12px;
    min-width: unset;
  }
  .location-block {
    padding: 0 8px;
  }
  .map-img {
    height: 180px;
  }
  .contact-btn {
    width: 95%;
  }
}
</style>
