import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { LayoutGrid, List, RotateCcw, Settings, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Configuracoes() {
  const { projectLayout, setProjectLayout, resetSettings } = useSettings();

  const handleReset = () => {
    resetSettings();
    toast.success('Configurações redefinidas para o padrão!', {
      style: {
        background: '#1e1f2a',
        color: '#e2e1f1',
        border: '1px solid #4a4455',
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
        background: '#1e1f2a',
        color: '#e2e1f1',
        border: '1px solid #4a4455',
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6 transition-all duration-300">
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

      {/* Painel de Visualização */}
      <div className="glass-card p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-6 shadow-lg shadow-black/10">
        <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
          <Eye className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-on-background">Visualização de Projetos</h2>
            <p className="text-xs text-on-surface-variant">Escolha como visualizar a fila e seus projetos ativos/em revisão</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Layout Grid (Grade) */}
          <button
            onClick={() => {
              setProjectLayout('grid');
              if (projectLayout !== 'grid') notifyChange('Layout em Grade ativado!');
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
              projectLayout === 'grid'
                ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] text-primary font-semibold'
                : 'border-outline-variant/15 hover:border-primary/20 text-on-surface-variant hover:text-on-background bg-surface-container/20'
            }`}
          >
            <div className={`p-3 rounded-full transition-transform duration-300 ${projectLayout === 'grid' ? 'bg-primary/20 scale-110 text-primary' : 'bg-surface-container/40'}`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-sm">Grade / Cards</span>
          </button>

          {/* Layout List (Lista) */}
          <button
            onClick={() => {
              setProjectLayout('list');
              if (projectLayout !== 'list') notifyChange('Layout em Lista compacta ativado!');
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border gap-3 transition-all duration-300 active:scale-95 cursor-pointer ${
              projectLayout === 'list'
                ? 'border-primary bg-primary-container/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] text-primary font-semibold'
                : 'border-outline-variant/15 hover:border-primary/20 text-on-surface-variant hover:text-on-background bg-surface-container/20'
            }`}
          >
            <div className={`p-3 rounded-full transition-transform duration-300 ${projectLayout === 'list' ? 'bg-primary/20 scale-110 text-primary' : 'bg-surface-container/40'}`}>
              <List className="w-6 h-6" />
            </div>
            <span className="text-sm">Lista Direta</span>
          </button>
        </div>
      </div>

      {/* Ações de Sistema / Reset */}
      <div className="glass-card p-6 rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/10">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-on-background">Redefinir Preferências</h3>
          <p className="text-xs text-on-surface-variant">
            Restaura a visualização para o padrão original de Grade/Cards.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/20 bg-surface hover:bg-surface-bright text-on-background hover:text-primary transition-all duration-300 active:scale-95 group font-medium text-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[-120deg]" />
          <span>Redefinir Padrões</span>
        </button>
      </div>
    </div>
  );
}
