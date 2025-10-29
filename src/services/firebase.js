import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your actual Firebase config from Step 3
const firebaseConfig = {
  apiKey: "AIzaSyBsfxsJVuGSHSCKnf8cK7HotodeZxMyjCg",
  authDomain: "tms-website-22f31.firebaseapp.com",
  projectId: "tms-website-22f31",
  storageBucket: "tms-website-22f31.firebasestorage.app",
  messagingSenderId: "17815987329",
  appId: "1:17815987329:web:525859c3256b5596c81980",
  measurementId: "G-F8CZFJLJSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;