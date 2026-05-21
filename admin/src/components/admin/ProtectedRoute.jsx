import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-container border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant text-sm font-label-caps tracking-wider">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/loginadm" replace />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Acesso Negado</h2>
          <p className="text-on-surface-variant">Sua conta não foi configurada pelo administrador. Entre em contato com o ADM.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
