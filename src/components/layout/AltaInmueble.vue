<script setup>
import { ref } from 'vue';
import { db } from '../../firebasej';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { auth } from '../../firebasej';

const router = useRouter();

const tipo = ref('venta');
const titulo = ref('');
const dormitorios = ref(1);
const banos = ref(1);
const direccion = ref('');
const oferta = ref(false);
const precio = ref(0);
const descuento = ref(0);
const imagenes = ref([]);
const coordenadas = ref({ lat: null, lng: null });
const parking = ref(null); 

const handleImageChange = (e) => {
  const files = e.target.files;
  imagenes.value = [];
  for (let i = 0; i < Math.min(files.length, 4); i++) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imagenes.value.push(event.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
};

// Función para convertir dirección a coordenadas
const geocodificarDireccion = async (direccion) => {
  if (!direccion.trim()) {
    alert('Por favor, ingresa una dirección');
    return false;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      coordenadas.value = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      console.log('Coordenadas encontradas:', coordenadas.value);
      return true;
    } else {
      alert('No se pudo encontrar la dirección. Verifica que sea correcta.');
      return false;
    }
  } catch (error) {
    console.error('Error en geocoding:', error);
    alert('Error al buscar la dirección');
    return false;
  }
};

const crearInmueble = async () => {
  // Primero geocodificar la dirección
  const coordsEncontradas = await geocodificarDireccion(direccion.value);
  
  if (!coordsEncontradas) {
    return; // No crear si no se encontraron coordenadas
  }

  const inmueble = {
    userId: auth.currentUser ? auth.currentUser.uid : '',
    tipo: tipo.value,
    titulo: titulo.value,
    dormitorios: dormitorios.value,
    banos: banos.value,
    direccion: direccion.value,
    lat: coordenadas.value.lat,
    lng: coordenadas.value.lng,
    oferta: oferta.value,
    precio: precio.value,
    descuento: oferta.value ? descuento.value : 0,
    imagenes: imagenes.value,
    parking: parking.value, 
  };

  addDoc(collection(db, 'propiedades'), inmueble)
    .then(() => {
      router.push('/profile');
    })
    .catch((e) => {
      alert('Error al crear la oferta: ' + e.message);
      console.error(e);
    });
};
</script>

<template>
  <section class="alta-page">
    <h1>Create a Listing</h1>
    <form class="alta-form" @submit.prevent="crearInmueble">
      <div class="form-row">
        <label>Sell / Rent</label>
        <button type="button" :class="{ active: tipo === 'venta' }" @click="tipo = 'venta'">Sell</button>
        <button type="button" :class="{ active: tipo === 'alquiler' }" @click="tipo = 'alquiler'">Rent</button>
      </div>
      <div class="form-row">
        <label>Name</label>
        <input v-model="titulo" type="text" required />
      </div>
      <div class="form-row">
        <label>Bedrooms</label>
          <input v-model.number="dormitorios" type="number" min="1" max="20" required />
        <label>Bathrooms</label>
          <input v-model.number="banos" type="number" min="1" max="20" required />
        <label>Parking</label>
          <button type="button" :class="{ active: parking === 'yes' }" @click="parking = 'yes'">Yes</button>
          <button type="button" :class="{ active: parking === 'no' }" @click="parking = 'no'">No</button>
          <button v-if="parking !== null" type="button" @click="parking = null" class="clear-btn">✕</button>
      </div>
      <div class="form-row address-row">
        <label>Address</label>
        <textarea v-model="direccion" required placeholder="Ej: Calle Ángel Barrios 15, Madrid, España"></textarea>
        <button type="button" @click="geocodificarDireccion(direccion)" class="test-btn">
          📍 Test Address
        </button>
      </div>
      <div v-if="coordenadas.lat && coordenadas.lng" class="coordinates-info">
        <span class="coords-label">✅ Coordinates found:</span>
        <span class="coords-values">{{ coordenadas.lat.toFixed(4) }}, {{ coordenadas.lng.toFixed(4) }}</span>
      </div>
      <div class="form-row">
        <label>Offer</label>
        <button type="button" :class="{ active: oferta }" @click="oferta = true">Yes</button>
        <button type="button" :class="{ active: !oferta }" @click="oferta = false">No</button>
      </div>
      <div class="form-row">
        <label>Regular Price</label>
        <input v-model.number="precio" type="number" min="0" required /> €/Month
      </div>
      <div class="form-row" v-if="oferta">
        <label>Discount</label>
        <input v-model.number="descuento" type="number" min="0" :max="precio" required /> €
      </div>
      <div class="form-row">
        <label>Images<br /><small>(max 4, solo se guardan como base64 demo)</small></label>
        <input type="file" accept="image/*" multiple @change="handleImageChange" />
      </div>
      <button class="alta-submit" type="submit">Create Listing</button>
    </form>
  </section>
</template>

<style scoped>
.alta-page {
  background: #f7f8fc;
  min-height: 100vh;
  padding: 32px 0 90px 0;
}
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-left: 24px;
  margin-bottom: 18px;
}
.alta-form {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.form-row label {
  min-width: 90px;
  font-weight: 500;
}
.form-row input[type="text"],
.form-row input[type="number"],
.form-row textarea {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.form-row textarea {
  min-height: 40px;
  resize: vertical;
}
.form-row button[type="button"] {
  background: #eee;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
  transition: background 0.2s;
}
.form-row button[type="button"].active {
  background: #00cc66;
  color: #fff;
}
.alta-submit {
  width: 100%;
  background: #00cc66;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.alta-submit:hover {
  background: #00994d;
}
</style>