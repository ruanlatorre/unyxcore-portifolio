import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { X, Users, DollarSign, Percent } from 'lucide-react';

export default function ConvidarColaborador({ sale, onClose }) {
  const { user, userName } = useAuth();
  const [devs, setDevs] = useState([]);
  const [selectedDevId, setSelectedDevId] = useState('');
  const [devPercent, setDevPercent] = useState(50);
  const [loading, setLoading] = useState(false);
  const [fetchingDevs, setFetchingDevs] = useState(true);

  const collaboratorPercent = 100 - devPercent;
  const projectBaseValue = sale.netValue !== undefined ? sale.netValue : sale.value;
  const devValue = (projectBaseValue * devPercent) / 100;
  const collaboratorValue = (projectBaseValue * collaboratorPercent) / 100;

  useEffect(() => {
    async function fetchDevs() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'desenvolvedor'));
        const snapshot = await getDocs(q);

        // Busca todas as vendas ativas (em_desenvolvimento ou revisao)
        const salesQuery = query(
          collection(db, 'sales'),
          where('status', 'in', ['em_desenvolvimento', 'revisao'])
        );
        const salesSnapshot = await getDocs(salesQuery);
        const activeSales = salesSnapshot.docs.map((doc) => doc.data());

        const list = snapshot.docs
          .map((doc) => {
            const devData = doc.data();
            const devId = doc.id;
            
            // Projetos onde o dev é o principal (devId) ou colaborador (collaboratorId)
            const activeCount = activeSales.filter(
              (s) => s.devId === devId || s.collaboratorId === devId
            ).length;

            return { id: devId, ...devData, activeCount };
          })
          .filter((d) => d.id !== user?.uid); // Filtra o próprio usuário

        setDevs(list);
      } catch (error) {
        console.error('Erro ao buscar desenvolvedores:', error);
        toast.error('Erro ao carregar lista de desenvolvedores.');
      } finally {
        setFetchingDevs(false);
      }
    }
    fetchDevs();
  }, [user?.uid]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!selectedDevId) {
      toast.error('Selecione um desenvolvedor para convidar.');
      return;
    }

    const selectedDev = devs.find((d) => d.id === selectedDevId);
    if (selectedDev && selectedDev.activeCount >= 3) {
      toast.error('Este desenvolvedor já atingiu o limite máximo de 3 projetos ativos.');
      return;
    }

    setLoading(true);

    try {
      // Cria o convite em 'invites'
      await addDoc(collection(db, 'invites'), {
        saleId: sale.id,
        clientName: sale.clientName,
        siteType: sale.siteType,
        totalValue: sale.value,
        netValue: projectBaseValue,
        sellerCommissionPercent: sale.sellerCommissionPercent !== undefined ? sale.sellerCommissionPercent : 0,
        sellerCommissionValue: sale.sellerCommissionValue !== undefined ? sale.sellerCommissionValue : 0,
        fromDevId: user?.uid,
        fromDevNome: userName,
        toDevId: selectedDevId,
        toDevNome: selectedDev.nome || selectedDev.email,
        valueSplit: {
          dev: devValue,
          collaborator: collaboratorValue,
          devPercent: devPercent,
          collaboratorPercent: collaboratorPercent,
        },
        status: 'pendente',
        createdAt: serverTimestamp(),
      });

      toast.success(`Convite enviado com sucesso para ${selectedDev.nome || selectedDev.email}!`);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar o convite de colaboração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/10 shadow-2xl animate-scale-in">
        
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-1.5 rounded-full hover:bg-surface-container-high/50 text-on-surface-variant hover:text-on-surface transition-all"
        >
          <X size={18} />
        </button>

        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Users size={22} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">Convidar Colaborador</h3>
            <p className="text-xs text-on-surface-variant/70 mt-0.5">Projeto: {sale.clientName} ({sale.siteType})</p>
          </div>
        </div>

        <form onSubmit={handleInvite} className="space-y-6">
          {/* Selecionar Dev */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              Desenvolvedor Disponível
            </label>
            {fetchingDevs ? (
              <div className="w-full h-11 bg-surface-container/50 border border-outline-variant/20 rounded-xl flex items-center justify-center text-xs text-on-surface-variant/50">
                Carregando desenvolvedores...
              </div>
            ) : devs.length === 0 ? (
              <div className="w-full p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                Nenhum outro desenvolvedor cadastrado no sistema.
              </div>
            ) : (
              <select
                value={selectedDevId}
                onChange={(e) => setSelectedDevId(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm cursor-pointer"
                required
              >
                <option value="">Selecione um desenvolvedor...</option>
                {devs.map((d) => {
                  const isLimitReached = d.activeCount >= 3;
                  return (
                    <option key={d.id} value={d.id} disabled={isLimitReached}>
                      {d.nome} ({d.email}){isLimitReached ? ' - [Limite de Projetos 3/3 Atingido]' : ` (${d.activeCount}/3 ativos)`}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Detalhes Financeiros do Projeto */}
          <div className="p-4 bg-surface-container-low/40 rounded-2xl border border-outline-variant/5 space-y-2">
            <div className="flex justify-between items-center text-xs text-on-surface-variant/70">
              <span>Valor Bruto do Projeto</span>
              <span className="font-semibold text-on-surface/80">
                R$ {sale.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            {sale.sellerCommissionPercent !== undefined && sale.sellerCommissionValue !== undefined && (
              <div className="flex justify-between items-center text-xs text-rose-400/80">
                <span>Comissão do Vendedor ({sale.sellerCommissionPercent}%)</span>
                <span>
                  - R$ {sale.sellerCommissionValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/5">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                {sale.netValue !== undefined ? 'Valor Líquido Dev' : 'Valor Total para Rateio'}
              </span>
              <span className="text-lg font-bold text-primary flex items-center">
                <DollarSign size={16} />
                {projectBaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Divisão de Valores */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                <Percent size={14} className="text-primary" /> Divisão do Valor
              </label>
              <button
                type="button"
                onClick={() => setDevPercent(50)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Resetar 50/50
              </button>
            </div>

            {/* Slider de Porcentagem */}
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={devPercent}
                onChange={(e) => setDevPercent(Number(e.target.value))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-xs text-on-surface-variant/50">
                <span>10% dev</span>
                <span>50/50</span>
                <span>90% dev</span>
              </div>
            </div>

            {/* Resumo Financeiro da Divisão */}
            <div className="grid grid-cols-2 gap-4">
              {/* Dev Criador (Você) */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Sua Parte ({devPercent}%)</p>
                  <p className="text-xs text-on-surface-variant/60 mt-0.5">Como criador</p>
                </div>
                <p className="text-lg font-bold text-on-surface mt-2 flex items-center">
                  <span className="text-xs text-on-surface-variant/70 font-normal mr-1">R$</span>
                  {devValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Colaborador */}
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Colaborador ({collaboratorPercent}%)</p>
                  <p className="text-xs text-on-surface-variant/60 mt-0.5">Parceiro convidado</p>
                </div>
                <p className="text-lg font-bold text-on-surface mt-2 flex items-center">
                  <span className="text-xs text-on-surface-variant/70 font-normal mr-1">R$</span>
                  {collaboratorValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || devs.length === 0 || !selectedDevId}
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:brightness-110 disabled:brightness-70 text-on-primary py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Enviando...' : 'Enviar Convite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
