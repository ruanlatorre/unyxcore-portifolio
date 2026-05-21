import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUpha1HflUdRrxbKeDe_SoWkcBLEwfjjY",
  authDomain: "unyxcoredev.firebaseapp.com",
  projectId: "unyxcoredev",
  storageBucket: "unyxcoredev.firebasestorage.app",
  messagingSenderId: "450020694380",
  appId: "1:450020694380:web:cc10e25aecdcece805bb49",
  measurementId: "G-JZ6HWP947L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
