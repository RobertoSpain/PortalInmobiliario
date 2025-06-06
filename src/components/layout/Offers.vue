<script setup>
import { ref, onMounted } from 'vue'; // ref para variables reactivas y onMounted para ejecutar código al montar el componente
import { db } from '../../firebasej'; // Importa la configuración de Firebase
import { collection, getDocs, query, where } from 'firebase/firestore'; // Métodos para interactuar con Firestore
import { useRouter } from 'vue-router'; // useRouter para navegar entre rutas

const router = useRouter(); // Instancia del router para navegación
const offers = ref([]); // Almacena las ofertas obtenidas de Firestore

// Hook que se ejecuta al montar el componente
onMounted(() => {
  const offersQuery = query(collection(db, 'propiedades'), where('oferta', '==', true)); // Consulta para obtener propiedades con ofertas
  getDocs(offersQuery).then(offersSnap => {
    offers.value = offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapea los documentos obtenidos a objetos
  });
});

// Función para navegar a los detalles de una propiedad
function goToDetail(id) {
  router.push(`/property/${id}`); 
}
</script>

<template>
  <!-- Sección principal de ofertas -->
  <section class="offers">
    <h1>Ofertas Especiales</h1>
    <!-- Mensaje si no hay ofertas disponibles -->
    <div v-if="offers.length === 0" class="no-offers">
      No hay ofertas disponibles en este momento.
    </div>
    <!-- Listado de ofertas disponibles -->
    <div v-else class="listings">
      <!-- Itera sobre las ofertas para mostrarlas en tarjetas -->
      <div v-for="item in offers" :key="item.id" class="listing-card" @click="goToDetail(item.id)" style="cursor:pointer;">
        <!-- Imágenes de la propiedad -->
        <div class="images">
          <img
            v-for="(img, idx) in (item.imagenes || []).slice(0, 4)"
            :key="idx"
            :src="img ? img : 'https://via.placeholder.com/300x200'"
            alt="Propiedad"
          />
        </div>
        <!-- Información de la propiedad -->
        <div class="listing-info">
          <h3>{{ item.titulo }}</h3>
          <p><b>Tipo:</b> {{ item.tipo }}</p>
          <p><b>Dormitorios:</b> {{ item.dormitorios }}</p>
          <p><b>Baños:</b> {{ item.banos }}</p>
          <p><b>Dirección:</b> {{ item.direccion }}</p>
          <p class="price">
            <!-- Muestra el precio con descuento si aplica -->
            <span v-if="item.oferta">
              <b>Precio:</b> <span class="discount">{{ item.precio - (item.descuento || 0) }} €</span>
              <span class="old-price">{{ item.precio }} €</span>
              <span class="discount-label">-{{ item.descuento }}€</span>
            </span>
            <!-- Muestra el precio normal si no hay descuento -->
            <span v-else>
              <b>Precio:</b> {{ item.precio }} €
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.offers {
  max-width: 1200px;
  margin: 0 auto 90px auto;
  padding: 30px 10px 0 10px;
}
h1 {
  text-align: center;
  color: #00cc66;
  margin-bottom: 30px;
}
.no-offers {
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  margin-top: 40px;
}
.listings {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.listing-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  width: 320px;
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}
.listing-card:hover {
  transform: translateY(-5px) scale(1.03);
}
.images {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
  background: #f7f7f7;
  padding: 6px 0;
}
.images img {
  width: 48%;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
}
.listing-info {
  padding: 12px 16px;
}
.listing-info h3 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: #00cc66;
}
.listing-info p {
  margin: 0 0 4px 0;
  color: #555;
  font-size: 0.95rem;
}
.price {
  color: #222;
  font-weight: bold;
  font-size: 1.05rem;
}
.old-price {
  color: #888;
  font-size: 0.95rem;
  text-decoration: line-through;
  margin-left: 8px;
}
.discount-label {
  color: #e53935;
  font-size: 0.95rem;
  margin-left: 8px;
}
.discount {
  color: #00cc66;
}
</style>