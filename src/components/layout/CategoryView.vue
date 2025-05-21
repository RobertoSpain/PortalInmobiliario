<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebasej';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRoute} from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const properties = ref([]);
const route = useRoute(); 
const category = ref(route.params.category); 

onMounted(() => {
  // Consultar propiedades según la categoría
  const categoryQuery = query(
    collection(db, 'propiedades'),
    where('tipo', '==', category.value)
  );

  getDocs(categoryQuery).then((snap) => {
    properties.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
});
function goToDetail(id) {
  router.push(`/property/${id}`);
}
</script>

<template>
  <section class="category-view">
    <h1>{{ category === 'venta' ? 'Places for Sale' : 'Places for Rent' }}</h1>
    <div v-if="properties.length === 0" class="no-properties">
      No properties available in this category.
    </div>
    <div v-else class="properties-grid">
      <div v-for="property in properties" :key="property.id" class="property-card" @click="goToDetail(property.id)" style="cursor:pointer;">
        <img
          :src="property.imagenes?.[0] || 'https://via.placeholder.com/300x200'"
          alt="Property Image"
          class="property-image"
        />
        <div class="property-info">
          <h3>{{ property.titulo }}</h3>
          <p><b>Address:</b> {{ property.direccion }}</p>
          <p class="price">
            <span v-if="property.oferta">
              <b>Price:</b> <span class="discount">{{ property.precio - (property.descuento || 0) }} €</span>
              <span class="old-price">{{ property.precio }} €</span>
              <span class="discount-label">-{{ property.descuento }}€</span>
            </span>
            <span v-else>
              <b>Price:</b> {{ property.precio }} €
            </span>
          </p>
          <p><b>Bedrooms:</b> {{ property.dormitorios }}</p>
          <p><b>Bathrooms:</b> {{ property.banos }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-view {
  padding: 20px;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.property-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.property-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.property-info {
  padding: 16px;
}

.property-info h3 {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}

.price {
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
</style>