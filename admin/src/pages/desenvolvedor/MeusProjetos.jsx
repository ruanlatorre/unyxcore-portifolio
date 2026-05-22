import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import StatusBadge from '../../components/admin/StatusBadge';
import ConvidarColaborador from './ConvidarColaborador';
import toast from 'react-hot-toast';
import { Send, Link2, Users, Calendar, DollarSign, ExternalLink, Inbox, Check, X, AlertTriangle } from 'lucide-react';

export default function MeusProjetos() {
  const { user, userName } = useAuth();
  const { projectLayout } = useSettings();
  const [projects, setProjects] = useState([]);
  const [invites, setInvites] = useState([]);
  const [deliveryUrls, setDeliveryUrls] = useState({});
  const [inviteModalSale, setInviteModalSale] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'projetos'); // 'projetos', 'revisao' ou 'convites'

  // Sincroniza a aba ativa reativamente se a URL mudar (por exemplo, clicando no menu lateral)
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('projetos');
    }
  }, [tabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Projetos ativos combinados (status == em_desenvolvimento ou revisao)
  const activeProjectsCount = projects.filter(
    (s) => s.status === 'em_desenvolvimento' || s.status === 'revisao'
  ).length;

  const activeDevProjects = projects.filter(
    (s) => s.status === 'em_desenvolvimento' || s.status === 'entregue_dev'
  );

  const reviewProjects = projects.filter(
    (s) => s.status === 'revisao'
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sales'), (snapshot) => {
      const all = snapshot.docs.map((d) => {
        const data = d.data();
        if (data.vendedorNome) data.vendedorNome = data.vendedorNome.replace(/Unyxcore/gi, 'Unyx Core');
        if (data.devNome) data.devNome = data.devNome.replace(/Unyxcore/gi, 'Unyx Core');
        if (data.collaboratorNome) data.collaboratorNome = data.collaboratorNome.replace(/Unyxcore/gi, 'Unyx Core');
        return { id: d.id, ...data };
      });
      const mine = all.filter(
        (s) =>
          (s.devId === user?.uid || s.collaboratorId === user?.uid) &&
          (s.status === 'em_desenvolvimento' || s.status === 'entregue_dev' || s.status === 'revisao')
      );
      setProjects(mine);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Escuta os convites recebidos pendentes
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'invites'),
      where('toDevId', '==', user.uid),
      where('status', '==', 'pendente')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.fromDevNome) data.fromDevNome = data.fromDevNome.replace(/Unyxcore/gi, 'Unyx Core');
        if (data.toDevNome) data.toDevNome = data.toDevNome.replace(/Unyxcore/gi, 'Unyx Core');
        return { id: doc.id, ...data };
      });
      setInvites(list);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleDeliver = async (sale) => {
    const url = deliveryUrls[sale.id];
    if (!url || !url.trim()) {
      toast.error('Insira o link do site antes de entregar.');
      return;
    }

    try {
      await updateDoc(doc(db, 'sales', sale.id), {
        status: 'entregue_dev',
        deliveryUrl: url.trim(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Projeto entregue com sucesso!');
      setDeliveryUrls((prev) => ({ ...prev, [sale.id]: '' }));
    } catch (error) {
      toast.error('Erro ao entregar projeto.');
    }
  };

  const handleAcceptInvite = async (invite) => {
    if (activeProjectsCount >= 3) {
      toast.error('Você atingiu o limite máximo de 3 projetos ativos (próprios + convites). Conclua algum para aceitar.');
      return;
    }

    try {
      // 1. Atualizar o convite no Firestore
      await updateDoc(doc(db, 'invites', invite.id), {
        status: 'aceito',
        updatedAt: serverTimestamp(),
      });

      // 2. Atualizar a venda para adicionar o colaborador e o valueSplit
      await updateDoc(doc(db, 'sales', invite.saleId), {
        collaboratorId: user.uid,
        collaboratorNome: userName,
        valueSplit: invite.valueSplit,
        updatedAt: serverTimestamp(),
      });

      toast.success(`Parceria aceita para o projeto "${invite.clientName}"!`);
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      toast.error('Erro ao aceitar o convite de colaboração.');
    }
  };

  const handleRejectInvite = async (invite) => {
    try {
      await updateDoc(doc(db, 'invites', invite.id), {
        status: 'recusado',
        updatedAt: serverTimestamp(),
      });
      toast.success('Convite recusado com sucesso.');
    } catch (error) {
      console.error('Erro ao recusar convite:', error);
      toast.error('Erro ao recusar o convite.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Meus Projetos</h1>
          <p className="text-on-surface-variant mt-1">Gerencie seus projetos ativos e convites de colaboração.</p>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
          activeProjectsCount >= 3 ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${activeProjectsCount >= 3 ? 'bg-rose-400' : 'bg-blue-400'} animate-pulse`}></span>
          {activeProjectsCount}/3 projetos ativos
        </div>
      </div>

      {activeProjectsCount >= 3 && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
          <p className="text-sm text-rose-400">
            Você atingiu a capacidade máxima de 3 projetos ativos. Você não poderá pegar novos projetos nem aceitar convites até concluir ou entregar algum.
          </p>
        </div>
      )}

      {/* Abas de Navegação */}
      <div className="flex border-b border-outline-variant/10 gap-6">
        <button
          onClick={() => handleTabChange('projetos')}
          className={`pb-4 text-sm font-semibold tracking-wide border-b-2 transition-all relative ${
            activeTab === 'projetos'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Projetos Ativos ({activeDevProjects.length})
        </button>
        <button
          onClick={() => handleTabChange('revisao')}
          className={`pb-4 text-sm font-semibold tracking-wide border-b-2 transition-all relative ${
            activeTab === 'revisao'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Revisão ({reviewProjects.length})
        </button>
        <button
          onClick={() => handleTabChange('convites')}
          className={`pb-4 text-sm font-semibold tracking-wide border-b-2 transition-all relative flex items-center gap-2 ${
            activeTab === 'convites'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Convites Recebidos
          {invites.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
              {invites.length}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo da Aba Projetos */}
      {activeTab === 'projetos' && (
        <>
          {activeDevProjects.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <p className="text-on-surface-variant text-lg font-medium">Nenhum projeto em andamento</p>
              <p className="text-on-surface-variant/50 text-sm mt-1">Vá até a Fila de Projetos para pegar um.</p>
            </div>
          ) : projectLayout === 'list' ? (
            <div className="flex flex-col gap-3">
              {activeDevProjects.map((sale) => (
                <div
                  key={sale.id}
                  className="glass-card rounded-xl p-4 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 truncate">
                          {sale.clientName}
                        </h3>
                        <StatusBadge status={sale.status} />
                        <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">
                          {sale.siteType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                          <DollarSign size={14} className="text-primary" />
                          <span>
                            R$ {sale.valueSplit
                              ? (sale.devId === user?.uid ? sale.valueSplit.dev : sale.valueSplit.collaborator)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : (sale.netValue !== undefined ? sale.netValue : sale.value)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                            }
                          </span>
                          {sale.valueSplit && <span className="text-xs text-on-surface-variant/50 font-normal">(sua parte)</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          <span>Prazo: {sale.deadline || '—'}</span>
                        </div>
                        {sale.collaboratorNome && (
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                            <Users size={12} className="text-blue-400" />
                            <span>Parceiro: {sale.collaboratorNome}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links/Status para visualizadores ou não-titulares */}
                    {(sale.status !== 'em_desenvolvimento' || sale.devId !== user?.uid) && (
                      <div className="flex items-center gap-3">
                        {sale.collaboratorId === user?.uid && (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
                            Colaborador
                          </span>
                        )}
                        {sale.deliveryUrl && (
                          <a
                            href={sale.deliveryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary-container/10 px-3 py-1.5 rounded-lg font-medium"
                          >
                            <ExternalLink size={14} /> Ver Site
                          </a>
                        )}
                      </div>
                    )}

                    {/* Ações rápidas */}
                    {sale.status === 'em_desenvolvimento' && sale.devId === user?.uid && (
                      <div className="flex flex-wrap items-center gap-2">
                        {!sale.collaboratorId && (
                          <button
                            onClick={() => setInviteModalSale(sale)}
                            className="flex items-center justify-center gap-1.5 bg-blue-500/20 text-blue-400 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-blue-500/30 transition-all active:scale-95 flex-shrink-0"
                          >
                            <Users size={14} />
                            Convidar
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {sale.description && (
                    <p className="text-xs text-on-surface-variant/60 line-clamp-1 border-l-2 border-outline-variant/30 pl-2">
                      {sale.description}
                    </p>
                  )}

                  {/* Input de entrega inline elegante */}
                  {sale.status === 'em_desenvolvimento' && sale.devId === user?.uid && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-outline-variant/10">
                      <div className="flex-1 flex items-center gap-2 bg-surface-container/30 border border-outline-variant/10 rounded-xl px-3 py-1.5">
                        <Link2 size={14} className="text-on-surface-variant/50" />
                        <input
                          value={deliveryUrls[sale.id] || ''}
                          onChange={(e) => setDeliveryUrls((prev) => ({ ...prev, [sale.id]: e.target.value }))}
                          placeholder="Insira o link do site para entregar (https://...)"
                          className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleDeliver(sale)}
                        className="flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-500/30 transition-all active:scale-95 whitespace-nowrap"
                      >
                        <Send size={14} />
                        Entregar Site
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {activeDevProjects.map((sale) => (
                <div key={sale.id} className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-on-surface">{sale.clientName}</h3>
                        <StatusBadge status={sale.status} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">{sale.siteType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={14} className="text-primary" />
                          <span className="font-semibold text-on-surface">
                            R$ {sale.valueSplit
                              ? (sale.devId === user?.uid ? sale.valueSplit.dev : sale.valueSplit.collaborator)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : (sale.netValue !== undefined ? sale.netValue : sale.value)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                            }
                          </span>
                          {sale.valueSplit ? (
                            <span className="text-xs text-on-surface-variant/50">(sua parte)</span>
                          ) : (
                            sale.netValue !== undefined && (
                              <span className="text-xs text-on-surface-variant/50">(Líquido Dev)</span>
                            )
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <Calendar size={14} className="text-primary" />
                          <span>{sale.deadline || '—'}</span>
                        </div>
                      </div>

                      {sale.description && (
                        <p className="text-sm text-on-surface-variant bg-surface-container/30 rounded-xl p-3 mb-4">
                          {sale.description}
                        </p>
                      )}

                      {/* Info de Colaborador */}
                      {sale.collaboratorNome && (
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                          <Users size={14} className="text-blue-400" />
                          <span>Colaborador: <strong className="text-on-surface">{sale.collaboratorNome}</strong></span>
                          {sale.valueSplit && (
                            <span className="text-xs text-on-surface-variant/50">
                              (Dev: {sale.valueSplit.devPercent}% · Colab: {sale.valueSplit.collaboratorPercent}%)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Caso o próprio logado seja o colaborador convidado */}
                      {sale.collaboratorId === user?.uid && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400 mb-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-2 w-fit">
                          <Users size={14} />
                          <span>Você está atuando como <strong>Colaborador Convidado</strong> neste projeto</span>
                        </div>
                      )}

                      {sale.deliveryUrl && (
                        <a href={sale.deliveryUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                          <ExternalLink size={14} /> {sale.deliveryUrl}
                        </a>
                      )}
                    </div>

                    {/* Ações */}
                    {sale.status === 'em_desenvolvimento' && sale.devId === user?.uid && (
                      <div className="flex flex-col gap-3 md:w-72 flex-shrink-0">
                        {/* Link de Entrega */}
                        <div className="space-y-2">
                          <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
                            <Link2 size={12} /> Link do Site
                          </label>
                          <input
                            value={deliveryUrls[sale.id] || ''}
                            onChange={(e) => setDeliveryUrls((prev) => ({ ...prev, [sale.id]: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                          />
                        </div>

                        <button
                          onClick={() => handleDeliver(sale)}
                          className="flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/30 transition-all active:scale-95"
                        >
                          <Send size={14} />
                          Entregar Projeto
                        </button>

                        {!sale.collaboratorId && (
                          <button
                            onClick={() => setInviteModalSale(sale)}
                            className="flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-500/30 transition-all active:scale-95"
                          >
                            <Users size={14} />
                            Convidar Colaborador
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Conteúdo da Aba Revisão */}
      {activeTab === 'revisao' && (
        <>
          {reviewProjects.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-on-surface-variant text-lg font-medium">Nenhum projeto em revisão</p>
              <p className="text-on-surface-variant/50 text-sm mt-1">Quando projetos precisarem de ajustes, eles aparecerão aqui.</p>
            </div>
          ) : projectLayout === 'list' ? (
            <div className="flex flex-col gap-3">
              {reviewProjects.map((sale) => (
                <div
                  key={sale.id}
                  className="glass-card rounded-xl p-4 hover:border-primary/20 transition-all duration-300 flex flex-col gap-3 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-bold text-on-surface flex items-center gap-2 truncate">
                          {sale.clientName}
                        </h3>
                        <StatusBadge status={sale.status} />
                        <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">
                          {sale.siteType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                          <DollarSign size={14} className="text-primary" />
                          <span>
                            R$ {sale.valueSplit
                              ? (sale.devId === user?.uid ? sale.valueSplit.dev : sale.valueSplit.collaborator)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : (sale.netValue !== undefined ? sale.netValue : sale.value)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                            }
                          </span>
                          {sale.valueSplit && <span className="text-xs text-on-surface-variant/50 font-normal">(sua parte)</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          <span>Prazo: {sale.deadline || '—'}</span>
                        </div>
                        {sale.collaboratorNome && (
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                            <Users size={12} className="text-blue-400" />
                            <span>Parceiro: {sale.collaboratorNome}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Links para colaboradores ou não titulares */}
                    {(sale.devId !== user?.uid) && (
                      <div className="flex items-center gap-3">
                        {sale.collaboratorId === user?.uid && (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
                            Colaborador
                          </span>
                        )}
                        {sale.deliveryUrl && (
                          <a
                            href={sale.deliveryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary-container/10 px-3 py-1.5 rounded-lg font-medium"
                          >
                            <ExternalLink size={14} /> Ver Última Entrega
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {sale.adjustmentsDescription && (
                    <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                      <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Ajustes Solicitados:</span>
                        <p className="mt-0.5 text-on-surface-variant">{sale.adjustmentsDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Input de re-entrega inline */}
                  {sale.devId === user?.uid && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-outline-variant/10">
                      <div className="flex-1 flex items-center gap-2 bg-surface-container/30 border border-outline-variant/10 rounded-xl px-3 py-1.5">
                        <Link2 size={14} className="text-on-surface-variant/50" />
                        <input
                          value={deliveryUrls[sale.id] || ''}
                          onChange={(e) => setDeliveryUrls((prev) => ({ ...prev, [sale.id]: e.target.value }))}
                          placeholder="Insira o novo link do site para re-entregar (https://...)"
                          className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleDeliver(sale)}
                        className="flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-500/30 transition-all active:scale-95 whitespace-nowrap"
                      >
                        <Send size={14} />
                        Re-entregar Site
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {reviewProjects.map((sale) => (
                <div key={sale.id} className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-on-surface">{sale.clientName}</h3>
                        <StatusBadge status={sale.status} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">{sale.siteType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={14} className="text-primary" />
                          <span className="font-semibold text-on-surface">
                            R$ {sale.valueSplit
                              ? (sale.devId === user?.uid ? sale.valueSplit.dev : sale.valueSplit.collaborator)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : (sale.netValue !== undefined ? sale.netValue : sale.value)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                            }
                          </span>
                          {sale.valueSplit ? (
                            <span className="text-xs text-on-surface-variant/50">(sua parte)</span>
                          ) : (
                            sale.netValue !== undefined && (
                              <span className="text-xs text-on-surface-variant/50">(Líquido Dev)</span>
                            )
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <Calendar size={14} className="text-primary" />
                          <span>{sale.deadline || '—'}</span>
                        </div>
                      </div>

                      {sale.description && (
                        <p className="text-sm text-on-surface-variant bg-surface-container/30 rounded-xl p-3 mb-4">
                          {sale.description}
                        </p>
                      )}

                      {/* Motivo da Revisão / Ajustes */}
                      {sale.adjustmentsDescription && (
                        <div className="flex items-start gap-2 text-sm text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 mb-4">
                          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold">Ajustes Solicitados:</span>
                            <p className="mt-1 text-on-surface-variant">{sale.adjustmentsDescription}</p>
                          </div>
                        </div>
                      )}

                      {/* Info de Colaborador */}
                      {sale.collaboratorNome && (
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                          <Users size={14} className="text-blue-400" />
                          <span>Colaborador: <strong className="text-on-surface">{sale.collaboratorNome}</strong></span>
                          {sale.valueSplit && (
                            <span className="text-xs text-on-surface-variant/50">
                              (Dev: {sale.valueSplit.devPercent}% · Colab: {sale.valueSplit.collaboratorPercent}%)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Caso o próprio logado seja o colaborador convidado */}
                      {sale.collaboratorId === user?.uid && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400 mb-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-2 w-fit">
                          <Users size={14} />
                          <span>Você está atuando como <strong>Colaborador Convidado</strong> neste projeto</span>
                        </div>
                      )}

                      {sale.deliveryUrl && (
                        <a href={sale.deliveryUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                          <ExternalLink size={14} /> {sale.deliveryUrl}
                        </a>
                      )}
                    </div>

                    {/* Ações */}
                    {sale.devId === user?.uid && (
                      <div className="flex flex-col gap-3 md:w-72 flex-shrink-0">
                        {/* Link de Entrega */}
                        <div className="space-y-2">
                          <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
                            <Link2 size={12} /> Novo Link do Site
                          </label>
                          <input
                            value={deliveryUrls[sale.id] || ''}
                            onChange={(e) => setDeliveryUrls((prev) => ({ ...prev, [sale.id]: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                          />
                        </div>

                        <button
                          onClick={() => handleDeliver(sale)}
                          className="flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500/30 transition-all active:scale-95"
                        >
                          <Send size={14} />
                          Re-entregar Projeto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Conteúdo da Aba Convites */}
      {activeTab === 'convites' && (
        <div className="space-y-6">
          {invites.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Inbox size={48} className="text-on-surface-variant/30 mx-auto mb-4" />
              <p className="text-on-surface-variant text-lg font-medium">Nenhum convite pendente</p>
              <p className="text-on-surface-variant/50 text-sm mt-1">Quando outros desenvolvedores convidarem você para colaborar, aparecerá aqui.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {invites.map((invite) => (
                <div key={invite.id} className="glass-card rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-label-caps tracking-wider text-primary bg-primary-container/10 px-3 py-1 rounded-full">
                        {invite.siteType}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">
                        Pendente
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                      <Users size={18} className="text-on-surface-variant" />
                      {invite.clientName}
                    </h3>

                    <div className="space-y-3 p-4 bg-surface-container-low/40 rounded-2xl border border-outline-variant/5 mb-4">
                      <div className="flex justify-between items-center text-xs text-on-surface-variant/70">
                        <span>Valor Total do Projeto</span>
                        <span className="font-semibold text-on-surface/80">
                          R$ {invite.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {invite.sellerCommissionValue !== undefined && invite.sellerCommissionValue > 0 && (
                        <div className="flex justify-between items-center text-xs text-rose-400/80">
                          <span>Comissão do Vendedor (-{invite.sellerCommissionPercent}%)</span>
                          <span>
                            - R$ {invite.sellerCommissionValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-outline-variant/5">
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Sua Cota ({invite.valueSplit?.collaboratorPercent}%)
                        </span>
                        <span className="text-base font-extrabold text-emerald-400">
                          R$ {invite.valueSplit?.collaborator?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-on-surface-variant/70 mb-4">
                      Convidado por: <strong className="text-on-surface">{invite.fromDevNome}</strong>
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleRejectInvite(invite)}
                      className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <X size={15} className="text-rose-400" />
                      Recusar
                    </button>
                    <button
                      onClick={() => handleAcceptInvite(invite)}
                      disabled={activeProjectsCount >= 3}
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:brightness-110 disabled:brightness-70 text-on-primary py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 active:scale-95 disabled:cursor-not-allowed"
                    >
                      <Check size={15} />
                      Aceitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de convite */}
      {inviteModalSale && (
        <ConvidarColaborador
          sale={inviteModalSale}
          onClose={() => setInviteModalSale(null)}
        />
      )}
    </div>
  );
}
