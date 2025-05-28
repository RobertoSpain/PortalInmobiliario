import { createRouter, createWebHistory } from 'vue-router'; 
import Home from '../components/layout/Home.vue';
import Login from '../components/layout/Login.vue';
import Offers from '../components/layout/Offers.vue';
import Profile from '../components/layout/Profile.vue';
import AltaInmueble from '../components/layout/AltaInmueble.vue';
import CategoryView from '../components/layout/CategoryView.vue';
import PropertyDetail from '../components/layout/PropertyDetail.vue';

// Definición de rutas
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/offers', name: 'offers', component: Offers },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/alta-inmueble', name: 'alta-inmueble', component: AltaInmueble, meta: { requiresAuth: true } },
  { path: '/category/:category', name: 'category', component: CategoryView },
  { path: '/property/:id', name: 'PropertyDetail', component: PropertyDetail },
];

// Crea el enrutador utilizando historial HTML5 (sin hash # en la URL)
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas (verifica autenticación)


export default router; 