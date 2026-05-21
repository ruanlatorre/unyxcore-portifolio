import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../utils/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta as mudanças de estado de autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Busca as informações adicionais do usuário (role, nome) no Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userPayload = {
              uid: firebaseUser.uid,
              nome: data.nome || data.name || 'Usuário',
              email: firebaseUser.email,
              role: data.role || 'user',
            };
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            setUserData(userPayload);
          } else {
            // Fallback caso não tenha documento no Firestore ainda
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            setUserData({ role: 'user', nome: 'Usuário', email: firebaseUser.email });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        // Deslogado
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      // Faz o login de forma segura usando o Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erro durante login oficial:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    logout,
    isAdmin: userData?.role === 'admin',
    isVendedor: userData?.role === 'vendedor',
    isDev: userData?.role === 'desenvolvedor',
    role: userData?.role || null,
    userName: userData?.nome || userData?.name || user?.email || 'Usuário',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

