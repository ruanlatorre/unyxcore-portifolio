import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/admin/StatusBadge';
import { Search, DollarSign, TrendingUp, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';

export default function HistoricoVendas() {
  const { user, isAdmin } = useAuth();
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sales'), (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((s) => isAdmin || s.vendedorId === user?.uid)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setSales(data);
    });
    return () => unsubscribe();
  }, [user?.uid, isAdmin]);

  // Cálculos financeiros de resumo específicos para as vendas associadas a este vendedor
  const stats = sales.reduce(
    (acc, cur) => {
      acc.totalGross += cur.value || 0;
      acc.totalCommission += cur.sellerCommissionValue || 0;
      if (cur.status === 'entregue_cliente') {
        acc.completed++;
      } else if (cur.status === 'em_desenvolvimento' || cur.status === 'revisao') {
        acc.inProgress++;
      }
      return acc;
    },
    { totalGross: 0, totalCommission: 0, completed: 0, inProgress: 0 }
  );

  const filtered = sales
    .filter((s) => filter === 'todos' || s.status === filter)
    .filter((s) =>
      search === '' ||
      s.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      s.siteType?.toLowerCase().includes(search.toLowerCase())
    );

  const filters = [
    { value: 'todos', label: 'Todos' },
    { value: 'disponivel', label: 'Disponíveis' },
    { value: 'em_desenvolvimento', label: 'Em Dev' },
    { value: 'revisao', label: 'Em Revisão' },
    { value: 'entregue_dev', label: 'Entregue Dev' },
    { value: 'entregue_cliente', label: 'Concluídas' },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return '—';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Histórico de Vendas</h1>
          <p className="text-on-surface-variant mt-1">Acompanhe suas vendas, comissões acumuladas e status dos projetos.</p>
        </div>
      </div>

      {/* Resumo de Métricas (Estatísticas Premium) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-label-caps tracking-wider text-on-surface-variant/70">Total Faturado (Bruto)</p>
            <p className="text-2xl font-extrabold text-on-surface mt-2">
              R$ {stats.totalGross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-on-surface-variant/40 mt-1">{sales.length} vendas registradas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-label-caps tracking-wider text-emerald-400">Minha Comissão Total</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-2">
              R$ {stats.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-emerald-400/40 mt-1">Ganhos acumulados</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-label-caps tracking-wider text-amber-400">Em Desenvolvimento</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-2">{stats.inProgress}</p>
            <p className="text-xs text-on-surface-variant/40 mt-1">Sites em produção ou revisão</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Briefcase size={22} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-label-caps tracking-wider text-blue-400">Vendas Concluídas</p>
            <p className="text-2xl font-extrabold text-blue-400 mt-2">{stats.completed}</p>
            <p className="text-xs text-on-surface-variant/40 mt-1">Entregues ao cliente final</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            id="history-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente ou tipo..."
            className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                filter === f.value
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'bg-surface-container/50 text-on-surface-variant hover:bg-surface-container-high/50 border border-outline-variant/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Cliente</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Tipo</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Valor</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Prazo</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Equipe Técnica</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Status</th>
                <th className="text-left px-6 py-4 text-xs font-label-caps tracking-wider text-on-surface-variant">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-on-surface-variant">Nenhuma venda encontrada.</td>
                </tr>
              ) : (
                filtered.map((sale) => (
                  <tr key={sale.id} className="border-b border-outline-variant/5 hover:bg-surface-container/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{sale.clientName}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{sale.siteType}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-primary">
                        R$ {sale.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      {sale.sellerCommissionValue !== undefined && (
                        <div className="text-[10px] text-emerald-400 font-medium mt-0.5 whitespace-nowrap">
                          Comissão ({sale.sellerCommissionPercent}%): R$ {sale.sellerCommissionValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{sale.deadline || '—'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      <div>{sale.devNome || '—'}</div>
                      {sale.collaboratorNome && (
                        <div className="text-[10px] text-blue-400 font-medium mt-0.5">
                          Colab: {sale.collaboratorNome}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={sale.status} /></td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(sale.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
