import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Rocket, PackageCheck, Users, Clock, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/admin/StatusBadge';

export default function AdminDashboard() {
  const { isVendedor, isDev, isAdmin, userName, user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    disponivel: 0,
    em_desenvolvimento: 0,
    entregue_dev: 0,
    entregue_cliente: 0,
  });
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const q = collection(db, 'sales');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sales = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      setStats({
        total: sales.length,
        disponivel: sales.filter((s) => s.status === 'disponivel').length,
        em_desenvolvimento: sales.filter((s) => s.status === 'em_desenvolvimento').length,
        entregue_dev: sales.filter((s) => s.status === 'entregue_dev').length,
        entregue_cliente: sales.filter((s) => s.status === 'entregue_cliente').length,
      });

      // Filtra vendas recentes por role
      let filtered = sales;
      if (isDev) {
        filtered = sales.filter((s) => s.devId === user?.uid || s.status === 'disponivel');
      } else if (isVendedor) {
        filtered = sales.filter((s) => s.vendedorId === user?.uid);
      }
      
      setRecentSales(
        filtered
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, 5)
      );
    });

    return () => unsubscribe();
  }, [isDev, isVendedor, user?.uid]);

  const statCards = isAdmin || isVendedor
    ? [
        { label: 'Total de Vendas', value: stats.total, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary-container/10' },
        { label: 'Disponíveis', value: stats.disponivel, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Em Desenvolvimento', value: stats.em_desenvolvimento, icon: Rocket, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Entregas Pendentes', value: stats.entregue_dev, icon: PackageCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Concluídas', value: stats.entregue_cliente, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary-container/10' },
      ]
    : [
        { label: 'Projetos Disponíveis', value: stats.disponivel, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Em Desenvolvimento', value: stats.em_desenvolvimento, icon: Rocket, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Entregues', value: stats.entregue_dev + stats.entregue_cliente, icon: PackageCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
          Olá, <span className="text-primary">{userName}</span> 👋
        </h1>
        <p className="text-on-surface-variant mt-1">
          {isVendedor ? 'Acompanhe suas vendas e entregas.' : isDev ? 'Veja os projetos disponíveis e seus andamentos.' : 'Visão geral do sistema.'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">{card.value}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-on-surface mb-4">Atividade Recente</h3>
        {recentSales.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-on-surface-variant">Nenhuma atividade ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container/30 border border-outline-variant/5 hover:border-primary/10 transition-all">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{sale.clientName}</p>
                  <p className="text-xs text-on-surface-variant">{sale.siteType} · R$ {sale.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <StatusBadge status={sale.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
