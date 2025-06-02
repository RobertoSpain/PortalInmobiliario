import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './firebasej';
import router from './router';

// Crea la app de Vue, le añade el router y la monta en el elemento con id 'app'
createApp(App).use(router).mount('#app');