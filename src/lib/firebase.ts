import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7WbCEqrM6nkO-HPHBlHLa3BMQg5N42ZQ",
  authDomain: "edcrec-1b825.firebaseapp.com",
  databaseURL: "https://edcrec-1b825-default-rtdb.firebaseio.com",
  projectId: "edcrec-1b825",
  storageBucket: "edcrec-1b825.appspot.com",
  messagingSenderId: "448340287337",
  appId: "1:448340287337:web:a7ca1e2e481fc4fd8767f8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);