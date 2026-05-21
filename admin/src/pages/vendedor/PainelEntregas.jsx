import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/admin/StatusBadge';
import toast from 'react-hot-toast';
import { CheckCircle, RotateCcw, ExternalLink, Package } from 'lucide-react';

export default function PainelEntregas() {
  const { user, isAdmin } = useAuth();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sales'), (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((s) => s.status === 'entregue_dev' || s.status === 'revisao')
        .filter((s) => isAdmin || s.vendedorId === user?.uid);
      setSales(data);
    });
    return () => unsubscribe();
  }, [user?.uid, isAdmin]);

  const handleApprove = async (sale) => {
    try {
      await updateDoc(doc(db, 'sales', sale.id), {
        status: 'entregue_cliente',
        updatedAt: serverTimestamp(),
      });
      toast.success(`Entrega de "${sale.clientName}" aprovada!`);
    } catch (error) {
      toast.error('Erro ao aprovar entrega.');
    }
  };

  const handleRequestRevision = async (sale) => {
    try {
      await updateDoc(doc(db, 'sales', sale.id), {
        status: 'em_desenvolvimento',
        updatedAt: serverTimestamp(),
      });
      toast.success('Revisão solicitada ao desenvolvedor.');
    } catch (error) {
      toast.error('Erro ao solicitar revisão.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Painel de Entregas</h1>
        <p className="text-on-surface-variant mt-1">Sites entregues pelos desenvolvedores aguardando sua aprovação.</p>
      </div>

      {sales.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Package size={48} className="text-on-surface-variant/30 mx-auto mb-4" />
          <p className="text-on-surface-variant text-lg font-medium">Nenhuma entrega pendente</p>
          <p className="text-on-surface-variant/50 text-sm mt-1">Quando um desenvolvedor entregar um site, ele aparecerá aqui.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sales.map((sale) => (
            <div key={sale.id} className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-on-surface">{sale.clientName}</h3>
                    <StatusBadge status={sale.status} />
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {sale.siteType} · <span className="text-primary font-semibold">R$ {sale.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    {sale.sellerCommissionValue !== undefined && (
                      <span className="text-xs text-emerald-400 font-semibold ml-2">
                        (Comissão {sale.sellerCommissionPercent}%: R$ {sale.sellerCommissionValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-on-surface-variant/60 mt-1">
                    Dev: <span className="text-on-surface">{sale.devNome || '—'}</span>
                    {sale.collaboratorNome && <> · Colaborador: <span className="text-on-surface">{sale.collaboratorNome}</span></>}
                  </p>
                  {sale.deliveryUrl && (
                    <a
                      href={sale.deliveryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                    >
                      <ExternalLink size={14} />
                      Ver site entregue
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(sale)}
                    className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/30 transition-all active:scale-95"
                  >
                    <CheckCircle size={16} />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleRequestRevision(sale)}
                    className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-500/30 transition-all active:scale-95"
                  >
                    <RotateCcw size={16} />
                    Revisão
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
