import { initializeApp } from "firebase/app";
// Importa la autenticación y el proveedor de Google
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Importa la base de datos Firestore
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABcde7nM8mLPxXcU0Yw_yvNG8kx_8sFqU",
  authDomain: "fbclaseprueba.firebaseapp.com", 
  projectId: "fbclaseprueba", 
  storageBucket: "fbclaseprueba.firebasestorage.app", 
  messagingSenderId: "289227959964", 
  appId: "1:289227959964:web:c8648867fb850880c2c759", 
  measurementId: "G-KXHB67QBSN" 
};

// Inicializa la app de Firebase con la configuración
const app = initializeApp(firebaseConfig);

// Inicializa los servicios de Firebase que vas a usar
const auth = getAuth(app); // Servicio de autenticación
const db = getFirestore(app); // Base de datos Firestore
const googleProvider = new GoogleAuthProvider(); // Proveedor de login con Google

// Exporta los servicios para usarlos en otros archivos
export { auth, db, googleProvider };