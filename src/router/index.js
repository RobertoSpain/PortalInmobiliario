import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

// Importa las vistas
import Home from '../components/layout/Home.vue';
import Offers from '../components/layout/Offers.vue';
import Profile from '../components/layout/Profile.vue';
import Login from '../components/layout/Login.vue';
import AltaInmueble from '../components/layout/AltaInmueble.vue'; // <-- Añadido

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/offers', name: 'Offers', component: Offers },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, 
  },
  { path: '/alta-inmueble', name: 'AltaInmueble', component: AltaInmueble, meta: { requiresAuth: true } }, // <-- Añadido
  { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verificar autenticación antes de acceder a rutas protegidas
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (user) {
      next(); 
    } else {
      next('/login'); 
    }
  } else {
    next(); 
  }
});

export default router;