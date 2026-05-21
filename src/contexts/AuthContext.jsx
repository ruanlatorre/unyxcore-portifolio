import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

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
    const storedUser = sessionStorage.getItem('unyx_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ uid: parsed.uid, email: parsed.email });
        setUserData(parsed);
      } catch (error) {
        console.error('Erro ao restaurar sessão do usuário:', error);
        sessionStorage.removeItem('unyx_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        const err = new Error('Usuário não encontrado.');
        err.code = 'auth/user-not-found';
        throw err;
      }

      let matchedUser = null;
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.password === password) {
          matchedUser = { uid: docSnap.id, ...data };
        }
      });

      if (!matchedUser) {
        const err = new Error('Senha incorreta.');
        err.code = 'auth/wrong-password';
        throw err;
      }

      // Login bem sucedido
      const userPayload = {
        uid: matchedUser.uid,
        nome: matchedUser.nome,
        email: matchedUser.email,
        role: matchedUser.role,
      };

      setUser({ uid: userPayload.uid, email: userPayload.email });
      setUserData(userPayload);
      sessionStorage.setItem('unyx_auth_user', JSON.stringify(userPayload));
      return userPayload;
    } catch (error) {
      console.error('Erro durante login customizado:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('unyx_auth_user');
      setUser(null);
      setUserData(null);
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
    userName: userData?.nome || user?.email || 'Usuário',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

