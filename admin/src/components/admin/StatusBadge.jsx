export default function StatusBadge({ status }) {
  const config = {
    disponivel: { label: 'Disponível', bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    em_desenvolvimento: { label: 'Em Desenvolvimento', bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
    entregue_dev: { label: 'Entregue pelo Dev', bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
    entregue_cliente: { label: 'Entregue ao Cliente', bg: 'bg-primary-container/20', text: 'text-primary', dot: 'bg-primary' },
    revisao: { label: 'Em Revisão', bg: 'bg-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-400' },
  };

  const s = config[status] || { label: status, bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`}></span>
      {s.label}
    </span>
  );
}
