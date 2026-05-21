import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, ShoppingCart, PackageCheck, History,
  FolderKanban, Rocket, Users, LogOut, Shield, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

const menuVendedor = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Cadastrar Venda', icon: ShoppingCart, path: '/admin/cadastrar-venda' },
  { label: 'Painel de Entregas', icon: PackageCheck, path: '/admin/entregas' },
  { label: 'Histórico', icon: History, path: '/admin/historico' },
];

const menuDev = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Fila de Projetos', icon: FolderKanban, path: '/admin/fila-projetos' },
  { label: 'Meus Projetos', icon: Rocket, path: '/admin/meus-projetos' },
  { label: 'Revisão', icon: AlertTriangle, path: '/admin/meus-projetos?tab=revisao' },
];

const menuAdmin = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Gerenciar Usuários', icon: Users, path: '/admin/gerenciar-usuarios' },
  { label: 'Cadastrar Venda', icon: ShoppingCart, path: '/admin/cadastrar-venda' },
  { label: 'Painel de Entregas', icon: PackageCheck, path: '/admin/entregas' },
  { label: 'Histórico', icon: History, path: '/admin/historico' },
  { label: 'Fila de Projetos', icon: FolderKanban, path: '/admin/fila-projetos' },
  { label: 'Meus Projetos', icon: Rocket, path: '/admin/meus-projetos' },
  { label: 'Revisão', icon: AlertTriangle, path: '/admin/meus-projetos?tab=revisao' },
];

export default function AdminSidebar() {
  const { role, userName, logout, isAdmin, isVendedor, isDev } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = isAdmin ? menuAdmin : isVendedor ? menuVendedor : isDev ? menuDev : [];

  const roleLabel = isAdmin ? 'Administrador' : isVendedor ? 'Vendedor' : isDev ? 'Desenvolvedor' : 'Usuário';
  const roleColor = isAdmin ? 'text-rose-400' : isVendedor ? 'text-emerald-400' : 'text-blue-400';

  const handleLogout = async () => {
    await logout();
    navigate('/loginadm');
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} min-h-screen bg-surface-container-low/80 backdrop-blur-xl border-r border-outline-variant/10 flex flex-col transition-all duration-300 relative`}>
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:brightness-110 transition-all z-10 shadow-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className="p-5 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-on-surface truncate">{userName}</h2>
              <p className={`text-xs font-label-caps tracking-wider ${roleColor}`}>{roleLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          // Diferenciação inteligente de link ativo para suportar query parameters (?tab=revisao)
          const isItemActive = item.path.includes('?')
            ? location.pathname + location.search === item.path
            : location.pathname === item.path && !location.search;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isItemActive
                  ? 'bg-primary-container/20 text-primary border border-primary/20 shadow-sm shadow-primary-container/10'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface border border-transparent'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-outline-variant/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group`}
        >
          <LogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
