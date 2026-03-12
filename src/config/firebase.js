import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlKTAzIhMQs9hlDDYzG3tIWP5FRmyPH30",
  authDomain: "izpit-114b8.firebaseapp.com",
  projectId: "izpit-114b8",
  storageBucket: "izpit-114b8.firebasestorage.app",
  messagingSenderId: "804093807508",
  appId: "1:804093807508:web:bf82a2c1a3a9a36bb95d81"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
