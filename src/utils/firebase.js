import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configurações do Firebase obtidas das variáveis de ambiente do Vite
// Crie um arquivo .env na raiz do projeto com estas chaves para conectar seu próprio projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUpha1HflUdRrxbKeDe_SoWkcBLEwfjjY",
  authDomain: "unyxcoredev.firebaseapp.com",
  projectId: "unyxcoredev",
  storageBucket: "unyxcoredev.firebasestorage.app",
  messagingSenderId: "450020694380",
  appId: "1:450020694380:web:cc10e25aecdcece805bb49",
  measurementId: "G-JZ6HWP947L"
};

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configura o prompt personalizado para forçar seleção de conta no Google OAuth
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
