<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '../../firebasej';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const router = useRouter();
const displayName = ref('');
const email = ref('');
const userOffers = ref([]);

onMounted(() => {
  if (auth.currentUser) {
    displayName.value = auth.currentUser.displayName || '';
    email.value = auth.currentUser.email || '';
    loadUserOffers();
  }
});

const darAltaInmueble = () => router.push('/alta-inmueble');

const loadUserOffers = () => {
  if (!auth.currentUser) return;
  const q = query(collection(db, 'propiedades'), where('userId', '==', auth.currentUser.uid));
  getDocs(q)
    .then((snap) => {
      userOffers.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    })
    .catch((e) => {
      console.error('Error cargando ofertas:', e);
    });
};

const borrarOferta = async (id) => {
  deleteDoc(doc(db, 'propiedades', id));
  userOffers.value = userOffers.value.filter(oferta => oferta.id !== id);
};

const logout = async () => {
  signOut(auth);
  router.push('/login');
};
</script>

<template>
  <section class="profile-page">
    <div class="profile-header">
      <h1>My Profile</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    <div class="profile-details">
      <div class="details-card">
        <b>{{ displayName }}</b>
        <div>{{ email }}</div>
      </div>
      <button class="alta-btn" @click="darAltaInmueble">
        🏠 Sell or rent your home <span class="alta-arrow">›</span>
      </button>
    </div>
    <div class="user-offers-section">
      <h2>Your Listings</h2>
      <div v-if="userOffers.length === 0" class="no-offers">
        No tienes ofertas publicadas.
      </div>
      <div v-else class="offers-list">
        <div v-for="oferta in userOffers" :key="oferta.id" class="offer-card">
          <img
            class="offer-img"
            :src="(oferta.imagenes && oferta.imagenes[0]) || 'https://via.placeholder.com/300x200'"
            alt="Imagen inmueble"
          />
          <div class="offer-info">
            <div class="offer-address">{{ oferta.direccion }}</div>
            <div class="offer-title">{{ oferta.titulo }}</div>
            <p class="offer-price">
              <span v-if="oferta.oferta">
                <b>Price:</b> <span class="discount">{{ oferta.precio - (oferta.descuento || 0) }} €</span>
                <span class="old-price">{{ oferta.precio }} €</span>
                <span class="discount-label">-{{ oferta.descuento }}€</span>
              </span>
              <span v-else>
                <b>Price:</b> {{ oferta.precio }} €
              </span>
            </p>
            <div class="offer-icons">
              <span>🛏️ {{ oferta.dormitorios }} Bedrooms</span>
              <span>🛁 {{ oferta.banos }} Bathrooms</span>
            </div>
          </div>
          <button class="delete-btn" @click="borrarOferta(oferta.id)" title="Borrar"><span>🗑️</span></button>
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