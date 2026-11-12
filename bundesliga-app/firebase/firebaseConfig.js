
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDINQDwW-xgpdUNritJDZWUa76PMPyMbZI",
  authDomain: "nombre-f5579.firebaseapp.com",
  projectId: "nombre-f5579",
  storageBucket: "nombre-f5579.firebasestorage.app",
  messagingSenderId: "883287084137",
  appId: "1:883287084137:web:a8b108d9778f533790e6f8",
  measurementId: "G-284M8VK0NP"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
