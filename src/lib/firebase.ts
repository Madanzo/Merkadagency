import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDfGn-4IR0oXBY-BDwLJg1gXLmc_wxUbJw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "merkadagency-dd2aa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "merkadagency-dd2aa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "merkadagency-dd2aa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "178054107670",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:178054107670:web:9713e11516f0978ad79b37",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VZ97CVHQCF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Export a flag to check if Firebase is initialized
export const isFirebaseInitialized = () => !!app;
