import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/admin/StatusBadge';
import toast from 'react-hot-toast';
import { Grab, AlertTriangle, Calendar, DollarSign, User, FileText } from 'lucide-react';

const MAX_OWN_PROJECTS = 2;
const MAX_COMBINED_PROJECTS = 3;

export default function FilaProjetos() {
  const { user, userName } = useAuth();
  const [sales, setSales] = useState([]);
  const [ownCount, setOwnCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sales'), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Projetos disponíveis
      const available = all.filter((s) => s.status === 'disponivel');
      setSales(available);

      // Projetos Próprios Ativos (onde ele é o dev titular e status é em_desenvolvimento ou revisao)
      const own = all.filter(
        (s) => s.devId === user?.uid && (s.status === 'em_desenvolvimento' || s.status === 'revisao')
      ).length;

      // Projetos Convidados Ativos (onde ele é colaborador e status é em_desenvolvimento ou revisao)
      const collab = all.filter(
        (s) => s.collaboratorId === user?.uid && (s.status === 'em_desenvolvimento' || s.status === 'revisao')
      ).length;

      setOwnCount(own);
      setTotalCount(own + collab);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleGrab = async (sale) => {
    if (ownCount >= MAX_OWN_PROJECTS) {
      toast.error(`Você já atingiu o limite de ${MAX_OWN_PROJECTS} projetos próprios ativos simultâneos. Entregue um deles para liberar espaço.`);
      return;
    }
    if (totalCount >= MAX_COMBINED_PROJECTS) {
      toast.error(`Você atingiu o limite de carteira combinada (${MAX_COMBINED_PROJECTS} projetos ativos). Entregue algum antes de assumir novos.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'sales', sale.id), {
        status: 'em_desenvolvimento',
        devId: user.uid,
        devNome: userName,
        updatedAt: serverTimestamp(),
      });
      toast.success(`Projeto "${sale.clientName}" atribuído a você!`);
    } catch (error) {
      toast.error('Erro ao pegar projeto.');
    }
  };

  const atOwnLimit = ownCount >= MAX_OWN_PROJECTS;
  const atTotalLimit = totalCount >= MAX_COMBINED_PROJECTS;
  const anyLimitReached = atOwnLimit || atTotalLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Fila de Projetos</h1>
          <p className="text-on-surface-variant mt-1">Sites disponíveis para desenvolvimento.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            atOwnLimit ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${atOwnLimit ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
            Próprios: {ownCount}/{MAX_OWN_PROJECTS}
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            atTotalLimit ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${atTotalLimit ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
            Total Ativos: {totalCount}/{MAX_COMBINED_PROJECTS}
          </div>
        </div>
      </div>

      {anyLimitReached && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-400">
            {atOwnLimit && atTotalLimit 
              ? `Você atingiu o limite máximo de projetos próprios (${MAX_OWN_PROJECTS}/2) e a capacidade total de projetos ativos (${MAX_COMBINED_PROJECTS}/3). Conclua algum trabalho para liberar espaço.`
              : atOwnLimit 
                ? `Você atingiu o limite de ${MAX_OWN_PROJECTS} projetos próprios ativos simultâneos. Entregue um deles para pegar outro da fila.`
                : `Você atingiu o limite de carteira combinada de ${MAX_COMBINED_PROJECTS} projetos ativos. Conclua ou entregue algum deles para assumir novos.`
            }
          </p>
        </div>
      )}

      {sales.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-on-surface-variant text-lg font-medium">Nenhum projeto na fila</p>
          <p className="text-on-surface-variant/50 text-sm mt-1">Quando vendedores cadastrarem novas vendas, elas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sales.map((sale) => (
            <div key={sale.id} className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-3 py-1 rounded-full">
                  {sale.siteType}
                </span>
                <StatusBadge status={sale.status} />
              </div>

              <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                <User size={18} className="text-on-surface-variant" />
                {sale.clientName}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <DollarSign size={15} className="text-primary" />
                  <span className="font-semibold text-on-surface">
                    R$ {(sale.netValue !== undefined ? sale.netValue : sale.value)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {sale.netValue !== undefined && (
                    <span className="text-xs text-on-surface-variant/50">
                      (Líquido Dev · {100 - sale.sellerCommissionPercent}% do valor)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Calendar size={15} className="text-primary" />
                  <span>Prazo: {sale.deadline || 'Não definido'}</span>
                </div>
                {sale.description && (
                  <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <FileText size={15} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{sale.description}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-on-surface-variant/50 mb-4">
                Vendedor: {sale.vendedorNome}
              </p>

              <button
                onClick={() => handleGrab(sale)}
                disabled={anyLimitReached}
                className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary-container/20"
              >
                <Grab size={16} />
                Pegar Projeto
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
