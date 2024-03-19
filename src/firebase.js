import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCvLVuq-hbwK7_UFB2OlkW6RgLH3E6TRmM',
  authDomain: 'admin-4aebb.firebaseapp.com',
  projectId: 'admin-4aebb',
  storageBucket: 'admin-4aebb.appspot.com',
  messagingSenderId: '890665850409',
  appId: '1:890665850409:web:5869039be34257d4432e38',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporting individual Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Adding Firebase Storage instance

