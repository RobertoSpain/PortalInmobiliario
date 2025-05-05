import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABcde7nM8mLPxXcU0Yw_yvNG8kx_8sFqU",
  authDomain: "fbclaseprueba.firebaseapp.com",
  projectId: "fbclaseprueba",
  storageBucket: "fbclaseprueba.firebasestorage.app",
  messagingSenderId: "289227959964",
  appId: "1:289227959964:web:c8648867fb850880c2c759",
  measurementId: "G-KXHB67QBSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };