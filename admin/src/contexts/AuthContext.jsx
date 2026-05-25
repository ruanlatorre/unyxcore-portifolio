import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

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
    // 1. Tentar restaurar a sessão do sessionStorage primeiro (para suporte a login customizado)
    const storedUser = sessionStorage.getItem('unyx_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ uid: parsed.uid, email: parsed.email });
        setUserData(parsed);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Erro ao restaurar sessão do sessionStorage:', error);
        sessionStorage.removeItem('unyx_auth_user');
      }
    }

    // 2. Fallback: Escuta as mudanças de estado de autenticação do Firebase Auth em tempo real
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userPayload = {
              uid: firebaseUser.uid,
              nome: (data.nome || data.name || 'Usuário').replace(/Unyxcore/gi, 'Unyx Core'),
              email: firebaseUser.email,
              role: data.role || 'user',
            };
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            setUserData(userPayload);
            sessionStorage.setItem('unyx_auth_user', JSON.stringify(userPayload));
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            const fallbackPayload = { role: 'user', nome: 'Usuário', email: firebaseUser.email, uid: firebaseUser.uid };
            setUserData(fallbackPayload);
            sessionStorage.setItem('unyx_auth_user', JSON.stringify(fallbackPayload));
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário no Firestore:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      // Tenta o login oficial usando o Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Busca as informações do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let userPayload;
      if (userDoc.exists()) {
        const data = userDoc.data();
        userPayload = {
          uid: firebaseUser.uid,
          nome: (data.nome || data.name || 'Usuário').replace(/Unyxcore/gi, 'Unyx Core'),
          email: firebaseUser.email,
          role: data.role || 'user',
        };
      } else {
        userPayload = {
          uid: firebaseUser.uid,
          nome: 'Usuário',
          email: firebaseUser.email,
          role: 'user',
        };
      }

      setUser({ uid: userPayload.uid, email: userPayload.email });
      setUserData(userPayload);
      sessionStorage.setItem('unyx_auth_user', JSON.stringify(userPayload));
      return userPayload;
    } catch (error) {
      console.warn('Falha no login oficial do Firebase Auth. Tentando login customizado via Firestore...', error);

      try {
        // Fallback: busca diretamente na coleção 'users' do Firestore (login customizado)
        const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // Lança o erro original do Firebase Auth se não achar o email
          throw error;
        }

        let matchedUser = null;
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.password && data.password === password) {
            matchedUser = { uid: docSnap.id, ...data };
          }
        });

        if (!matchedUser) {
          // Lança o erro original do Firebase Auth se a senha estiver incorreta
          throw error;
        }

        const userPayload = {
          uid: matchedUser.uid,
          nome: (matchedUser.nome || 'Usuário').replace(/Unyxcore/gi, 'Unyx Core'),
          email: matchedUser.email,
          role: matchedUser.role || 'user',
        };

        setUser({ uid: userPayload.uid, email: userPayload.email });
        setUserData(userPayload);
        sessionStorage.setItem('unyx_auth_user', JSON.stringify(userPayload));
        return userPayload;
      } catch (fallbackError) {
        console.error('Erro em ambos os métodos de login:', fallbackError);
        throw error; // Sempre joga o erro oficial do Firebase Auth para a interface
      }
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('unyx_auth_user');
      setUser(null);
      setUserData(null);
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
    userName: (userData?.nome || user?.email || 'Usuário').replace(/Unyxcore/gi, 'Unyx Core'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

