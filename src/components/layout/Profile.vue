<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '../../firebasej';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const router = useRouter();

const displayName = ref(''); // Nombre del usuario
const email = ref(''); // Email del usuario
const userOffers = ref([]); // Array de propiedades del usuario

// Hook que se ejecuta cuando el componente se monta
onMounted(() => {
  // Verifica si hay un usuario autenticado
  if (auth.currentUser) {
    // Asigna los datos del usuario a las variables reactivas
    displayName.value = auth.currentUser.displayName || '';
    email.value = auth.currentUser.email || '';
    // Carga las propiedades del usuario
    loadUser();
  }
});

const darAltaInmueble = () => router.push('/alta-inmueble');

// Función para cargar las propiedades del usuario actual
const loadUser = () => {
  // Verifica que haya un usuario autenticado
  if (!auth.currentUser) return;
  
  // Crea una query para obtener solo las propiedades del usuario actual
  const q = query(
    collection(db, 'propiedades'), 
    where('userId', '==', auth.currentUser.uid)
  );
  
  // Ejecuta la consulta a Firestore
  getDocs(q)
    .then((snap) => {
      // Mapea los documentos obtenidos y los asigna al array reactivo
      userOffers.value = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    })
    .catch((e) => {
      // Manejo de errores en caso de fallo en la consulta
      console.error('Error cargando ofertas:', e);
    });
};

// Función para eliminar una propiedad
const borrarOferta = (id) => {
  // Elimina el documento de Firestore
  deleteDoc(doc(db, 'propiedades', id));
  // Actualiza el array local removiendo la propiedad eliminada
  userOffers.value = userOffers.value.filter(oferta => oferta.id !== id);
};

// Función para cerrar sesión
const logout = () => {
  // Cierra la sesión en Firebase Auth
  signOut(auth);
  // Redirige al usuario a la página de login
  router.push('/login');
};
</script>

<template>
  <!-- Contenedor principal de la página de perfil -->
  <section class="profile-page">
    <!-- Cabecera del perfil con título y botón de logout -->
    <div class="profile-header">
      <h1>My Profile</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    <!-- Sección de detalles del usuario -->
    <div class="profile-details">
      <!-- Tarjeta con información del usuario -->
      <div class="details-card">
        <b>{{ displayName }}</b>
        <div>{{ email }}</div>
      </div>
      <!-- Botón para agregar nueva propiedad -->
      <button class="alta-btn" @click="darAltaInmueble">
        🏠 Sell or rent your home <span class="alta-arrow">›</span>
      </button>
    </div>
    <!-- Sección de propiedades del usuario -->
    <div class="user-offers-section">
      <h2>Your Listings</h2>
      <!-- Mensaje cuando no hay propiedades -->
      <div v-if="userOffers.length === 0" class="no-offers">
        No tienes ofertas publicadas.
      </div>
      <!-- Lista de propiedades cuando existen -->
      <div v-else class="offers-list">
        <!-- Iteración sobre cada propiedad del usuario -->
        <div v-for="oferta in userOffers" :key="oferta.id" class="offer-card">
          <!-- Imagen de la propiedad con fallback por defecto -->
          <img
            class="offer-img"
            :src="(oferta.imagenes && oferta.imagenes[0]) || 'https://via.placeholder.com/300x200'"
            alt="Imagen inmueble"
          />
          <!-- Información de la propiedad -->
          <div class="offer-info">
            <!-- Dirección de la propiedad -->
            <div class="offer-address">{{ oferta.direccion }}</div>
            <!-- Título de la propiedad -->
            <div class="offer-title">{{ oferta.titulo }}</div>
            <!-- Sección de precios con lógica condicional para ofertas -->
            <p class="offer-price">
              <!-- Si hay oferta/descuento, muestra precio rebajado -->
              <span v-if="oferta.oferta">
                <b>Price:</b> 
                <span class="discount">{{ oferta.precio - (oferta.descuento || 0) }} €</span>
                <span class="old-price">{{ oferta.precio }} €</span>
                <span class="discount-label">-{{ oferta.descuento }}€</span>
              </span>
              <!-- Si no hay oferta, muestra precio normal -->
              <span v-else>
                <b>Price:</b> {{ oferta.precio }} €
              </span>
            </p>
            <!-- Iconos con información de dormitorios y baños -->
            <div class="offer-icons">
              <span>🛏️ {{ oferta.dormitorios }} Bedrooms</span>
              <span>🛁 {{ oferta.banos }} Bathrooms</span>
            </div>
          </div>
          <!-- Botón para eliminar la propiedad -->
          <button 
            class="delete-btn" 
            @click="borrarOferta(oferta.id)" 
            title="Borrar"
          >
            <span>🗑️</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  background: #f7f8fc;
  min-height: 100vh;
  padding: 32px 0 90px 0;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 24px 0;
  padding: 0 32px;
}
.logout-btn {
  background: #00cc66;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 6px 18px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}
.profile-details {
  max-width: 600px;
  margin: 0 auto 32px auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.details-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 0;
  font-size: 1.1rem;
}
.alta-btn {
  width: 100%;
  background: #fff;
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  margin-bottom: 0;
  transition: background 0.2s;
}
.alta-btn:hover {
  background: #f0f0f0;
}
.alta-arrow {
  margin-left: auto;
  font-size: 1.5rem;
  color: #888;
}
.user-offers-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 32px;
}
.no-offers {
  color: #888;
  font-size: 1.1rem;
  margin-top: 20px;
}
.offers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}
.offer-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  width: 420px;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px;
  margin-bottom: 12px;
}
.offer-img {
  width: 140px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  background: #eee;
}
.offer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.offer-address {
  font-size: 0.95rem;
  color: #888;
}
.offer-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #222;
}
.offer-price {
  margin: 8px 0;
}
.discount {
  color: #00cc66;
  font-weight: bold;
}
.old-price {
  text-decoration: line-through;
  color: #888;
  margin-left: 8px;
}
.discount-label {
  color: red;
  font-weight: bold;
  margin-left: 8px;
}
.offer-icons {
  display: flex;
  gap: 16px;
  font-size: 0.98rem;
  color: #444;
  margin-top: 2px;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 2px 4px;
  color: #e53935;
}
</style>