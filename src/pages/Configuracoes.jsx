import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Sun, Moon, LayoutGrid, List, RotateCcw, Settings, Eye, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Configuracoes() {
  const { theme, setTheme, projectLayout, setProjectLayout, resetSettings } = useSettings();

  const handleReset = () => {
    resetSettings();
    toast.success('Configurações redefinidas para o padrão!', {
      style: {
        background: theme === 'light' ? '#ffffff' : '#1e1f2a',
        color: theme === 'light' ? '#1e1d24' : '#e2e1f1',
        border: '1px solid var(--outline-variant)',
      },
      iconTheme: {
        primary: '#7c3aed',
        secondary: '#ffffff',
      },
    });
  };

  const notifyChange = (message) => {
    toast.success(message, {
      duration: 1500,
      style: {
        background: theme === 'light' ? '#ffffff' : '#1e1f2a',
        color: theme === 'light' ? '#1e1d24' : '#e2e1f1',
        border: '1px solid var(--outline-variant)',
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-container/20 border border-primary/20 text-primary">
            <Settings className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-background">Configurações</h1>
            <p className="text-sm text-on-surface-variant">
              Personalize sua experiência de uso no painel administrativo do Unyx Core.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Painel do Tema */}
        <div className="glass-card p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <Palette className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-on-background">Tema Visual</h2>
              <p className="text-xs text-on-surface-variant">Alterne entre o modo claro e escuro</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Modo Escuro */}
            <button
              onClick={() => {
                setTheme('dark');
                if (theme !== 'dark') notifyChange('Modo Escuro ativado!');
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
                theme === 'dark'
                  ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] text-primary'
                  : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant hover:text-on-background bg-surface-container/30'
              }`}
            >
              <div className={`p-3 rounded-full transition-transform duration-500 ${theme === 'dark' ? 'bg-primary/20 rotate-[360deg]' : 'bg-surface-container/50'}`}>
                <Moon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Modo Escuro</span>
            </button>

            {/* Modo Claro */}
            <button
              onClick={() => {
                setTheme('light');
                if (theme !== 'light') notifyChange('Modo Claro ativado!');
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
                theme === 'light'
                  ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(98,0,238,0.15)] text-primary'
                  : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant hover:text-on-background bg-surface-container/30'
              }`}
            >
              <div className={`p-3 rounded-full transition-transform duration-500 ${theme === 'light' ? 'bg-primary/20 rotate-[180deg]' : 'bg-surface-container/50'}`}>
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Modo Claro</span>
            </button>
          </div>
        </div>

        {/* Modo de Exibição */}
        <div className="glass-card p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-6 shadow-lg shadow-black/10">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-on-background">Visualização de Projetos</h2>
              <p className="text-xs text-on-surface-variant">Escolha como visualizar a fila e seus projetos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Layout Grid (Grade) */}
            <button
              onClick={() => {
                setProjectLayout('grid');
                if (projectLayout !== 'grid') notifyChange('Layout em Grade ativado!');
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
                projectLayout === 'grid'
                  ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] text-primary'
                  : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant hover:text-on-background bg-surface-container/30'
              }`}
            >
              <div className={`p-3 rounded-full transition-transform duration-300 ${projectLayout === 'grid' ? 'bg-primary/20 scale-110' : 'bg-surface-container/50'}`}>
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Grade / Cards</span>
            </button>

            {/* Layout List (Lista) */}
            <button
              onClick={() => {
                setProjectLayout('list');
                if (projectLayout !== 'list') notifyChange('Layout em Lista compacta ativado!');
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
                projectLayout === 'list'
                  ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] text-primary'
                  : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant hover:text-on-background bg-surface-container/30'
              }`}
            >
              <div className={`p-3 rounded-full transition-transform duration-300 ${projectLayout === 'list' ? 'bg-primary/20 scale-110' : 'bg-surface-container/50'}`}>
                <List className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Lista Direta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ações de Sistema / Reset */}
      <div className="glass-card p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/10">
        <div>
          <h3 className="text-base font-semibold text-on-background">Redefinir Preferências</h3>
          <p className="text-xs text-on-surface-variant">
            Restaura as configurações de tema e visualização para os padrões originais (Escuro + Grade).
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-bright text-on-background hover:text-primary transition-all duration-300 active:scale-95 group font-medium text-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[-120deg]" />
          <span>Redefinir Padrões</span>
        </button>
      </div>
    </div>
  );
}
