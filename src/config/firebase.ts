import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCtIoARhb8kD0T6FdfdHmvswBr3v_GXv8U",
  authDomain: "trip-aec33.firebaseapp.com",
  projectId: "trip-aec33",
  storageBucket: "trip-aec33.firebasestorage.app",
  messagingSenderId: "463160491883",
  appId: "1:463160491883:web:db314f3afd0e6f89e8d62e",
  measurementId: "G-BGZ0CXVLNZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 
export const storage = getStorage(app); 