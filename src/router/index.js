import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/layout/Home.vue'), // Lazy loading para Home
    },
    {
      path: '/offers',
      name: 'offers',
      component: () => import('../components/layout/Offers.vue'), // Lazy loading para Offers
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../components/layout/Profile.vue'), // Lazy loading para Profile
      meta: { requiresAuth: true }, // Ruta protegida
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/layout/Login.vue'), // Lazy loading para Login
    },
    {
      path: '/alta-inmueble',
      name: 'alta-inmueble',
      component: () => import('../components/layout/AltaInmueble.vue'), // Lazy loading para AltaInmueble
      meta: { requiresAuth: true }, // Ruta protegida
    },
  ],
});

// Protección de rutas (verifica autenticación)
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