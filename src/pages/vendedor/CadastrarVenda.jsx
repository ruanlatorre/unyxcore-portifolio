import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Send, DollarSign, Calendar, FileText, Layout, User, Percent } from 'lucide-react';

const siteTypes = [
  'Landing Page',
  'Site Institucional',
  'E-commerce',
  'Blog',
  'Sistema Web',
  'Portfólio',
  'Outro',
];

export default function CadastrarVenda() {
  const { user, userName } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: '',
    siteType: '',
    value: '',
    deadline: '',
    description: '',
    commissionPercent: 20, // valor padrão de 20% como no exemplo do usuário
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const grossValue = parseFloat(form.value);
      const commissionPercent = parseFloat(form.commissionPercent);
      const sellerCommissionValue = (grossValue * commissionPercent) / 100;
      const netValue = grossValue - sellerCommissionValue;

      await addDoc(collection(db, 'sales'), {
        clientName: form.clientName,
        siteType: form.siteType,
        value: grossValue,
        deadline: form.deadline,
        description: form.description,
        status: 'disponivel',
        vendedorId: user.uid,
        vendedorNome: userName,
        sellerCommissionPercent: commissionPercent,
        sellerCommissionValue: sellerCommissionValue,
        netValue: netValue,
        devId: null,
        devNome: null,
        collaboratorId: null,
        collaboratorNome: null,
        valueSplit: null,
        deliveryUrl: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Venda cadastrada com sucesso!');
      setForm({ clientName: '', siteType: '', value: '', deadline: '', description: '', commissionPercent: 20 });
    } catch (error) {
      console.error('Erro ao cadastrar venda:', error);
      toast.error('Erro ao cadastrar venda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Cadastrar Nova Venda</h1>
        <p className="text-on-surface-variant mt-1">Registre uma nova venda para que os desenvolvedores possam pegar o projeto.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Name */}
          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <User size={14} /> Nome do Cliente
            </label>
            <input
              id="sale-client-name"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              required
              placeholder="Ex: João da Silva"
              className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          {/* Site Type */}
          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <Layout size={14} /> Tipo do Site
            </label>
            <select
              id="sale-site-type"
              name="siteType"
              value={form.siteType}
              onChange={handleChange}
              required
              className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm appearance-none"
            >
              <option value="" disabled>Selecione o tipo</option>
              {siteTypes.map((type) => (
                <option key={type} value={type} className="bg-surface-container text-on-surface">{type}</option>
              ))}
            </select>
          </div>

          {/* Value & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <DollarSign size={14} /> Valor (R$)
              </label>
              <input
                id="sale-value"
                name="value"
                type="number"
                step="0.01"
                min="0"
                value={form.value}
                onChange={handleChange}
                required
                placeholder="0,00"
                className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Calendar size={14} /> Prazo de Entrega
              </label>
              <input
                id="sale-deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
                className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Comissão do Vendedor Slider */}
          <div className="space-y-3 p-4 bg-surface-container-low/40 rounded-2xl border border-outline-variant/5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <Percent size={14} className="text-primary" /> Comissão do Vendedor ({form.commissionPercent}%)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, commissionPercent: 10 })}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    form.commissionPercent === 10
                      ? 'bg-primary-container text-on-primary-container border-primary/20 font-bold'
                      : 'bg-surface-container text-on-surface-variant/70 border-outline-variant/10'
                  }`}
                >
                  Min (10%)
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, commissionPercent: 20 })}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    form.commissionPercent === 20
                      ? 'bg-primary-container text-on-primary-container border-primary/20 font-bold'
                      : 'bg-surface-container text-on-surface-variant/70 border-outline-variant/10'
                  }`}
                >
                  Max (20%)
                </button>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="20"
              step="1"
              name="commissionPercent"
              value={form.commissionPercent}
              onChange={(e) => setForm({ ...form, commissionPercent: Number(e.target.value) })}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />

            {form.value && !isNaN(parseFloat(form.value)) && (
              <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-outline-variant/5">
                <div>
                  <p className="text-[10px] font-label-caps tracking-wider text-on-surface-variant/60">Sua Comissão ({form.commissionPercent}%)</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    R$ {((parseFloat(form.value) * form.commissionPercent) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-label-caps tracking-wider text-on-surface-variant/60">Valor Líquido Dev ({100 - form.commissionPercent}%)</p>
                  <p className="text-sm font-bold text-on-surface mt-0.5">
                    R$ {((parseFloat(form.value) * (100 - form.commissionPercent)) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-label-caps tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <FileText size={14} /> Descrição / Observações
            </label>
            <textarea
              id="sale-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detalhes sobre o que o cliente precisa..."
              className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            id="sale-submit"
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary-container text-on-primary-container py-3 px-8 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <Send size={16} />
                Cadastrar Venda
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
