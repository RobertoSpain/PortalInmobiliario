<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebasej';
import { collection, getDocs, query, where } from 'firebase/firestore';

const sales = ref([]);
const rentals = ref([]);

onMounted(() => {
  // Propiedades en venta
  const salesQuery = query(collection(db, 'propiedades'), where('tipo', '==', 'venta'));
  getDocs(salesQuery).then(salesSnap => {
    sales.value = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // Propiedades en alquiler
  const rentalsQuery = query(collection(db, 'propiedades'), where('tipo', '==', 'alquiler'));
  getDocs(rentalsQuery).then(rentalsSnap => {
    rentals.value = rentalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});
</script>

<template>
  <section class="home">
    <h1 class="title">Explore</h1>
    
    <div class="section">
      <h2 class="section-title">Recommended</h2>
      <div class="featured-listing">
        <img src="https://via.placeholder.com/800x400" alt="Casa en el campo" class="featured-image" />
        <div class="listing-overlay">
          <h3 class="listing-title">casa en el campo</h3>
          <div class="price-tag">$150000</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">Categories</h2>
      <div class="categories-grid">
        <div class="category-card">
          <img src="/img/sale.jpg" alt="Apartamento" class="category-image" />
          <div class="category-label">Places for rent</div>
        </div>
        <div class="category-card">
          <img src="/img/renta.jpg" alt="Apartamento" class="category-image" />
          <div class="category-label">Places for sale</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.featured-listing {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.featured-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.listing-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px;
  width: 100%;
}

.listing-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  background-color: rgba(0,0,0,0.7);
  display: inline-block;
  padding: 8px 16px;
  margin-bottom: 8px;
}

.price-tag {
  background-color: white;
  color: black;
  font-weight: bold;
  display: inline-block;
  padding: 8px 16px;
  border-radius: 24px;
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
  .featured-image {
    height: 300px;
  }
  .categories-grid {
    flex-wrap: wrap;
  }
  .category-card {
    min-width: 250px;
  }
}
</style>