import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import LoginAdm from './pages/LoginAdm';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Configuracoes from './pages/Configuracoes';
import { SettingsProvider } from './contexts/SettingsContext';

// Páginas do Vendedor
import CadastrarVenda from './pages/vendedor/CadastrarVenda';
import PainelEntregas from './pages/vendedor/PainelEntregas';
import HistoricoVendas from './pages/vendedor/HistoricoVendas';

// Páginas do Desenvolvedor
import FilaProjetos from './pages/desenvolvedor/FilaProjetos';
import MeusProjetos from './pages/desenvolvedor/MeusProjetos';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/loginadm" element={<LoginAdm />} />

            {/* Painel Administrativo Protegido */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Visível para Todos os Logados */}
              <Route index element={<AdminDashboard />} />

              {/* Rota de Configurações Visível para Todos os Logados */}
              <Route
                path="configuracoes"
                element={
                  <ProtectedRoute>
                    <Configuracoes />
                  </ProtectedRoute>
                }
              />

              {/* Rotas exclusivas de Vendedores e Administradores */}
              <Route
                path="cadastrar-venda"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <CadastrarVenda />
                  </ProtectedRoute>
                }
              />
              <Route
                path="entregas"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <PainelEntregas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="historico"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <HistoricoVendas />
                  </ProtectedRoute>
                }
              />

              {/* Rotas exclusivas de Desenvolvedores e Administradores */}
              <Route
                path="fila-projetos"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'desenvolvedor']}>
                    <FilaProjetos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="meus-projetos"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'desenvolvedor']}>
                    <MeusProjetos />
                  </ProtectedRoute>
                }
              />

              {/* Rota exclusiva do Administrador */}
              <Route
                path="gerenciar-usuarios"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GerenciarUsuarios />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirecionar rotas não encontradas para a página inicial */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
