import { createRouter, createWebHistory } from 'vue-router'; // Importa las funciones necesarias para crear el enrutador de Vue y usar el historial HTML5 (sin # en la URL)
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
import { getAuth } from 'firebase/auth';
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next('/login'); // Redirige a login si no está autenticado
  } else {
    next(); // Permite el acceso
  }
});

export default router;