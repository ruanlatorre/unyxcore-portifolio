import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserPlus, Shield, ShoppingCart, Rocket, Trash2, Mail, Lock, User, Check, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GerenciarUsuarios() {
  const { user: loggedUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newNome, setNewNome] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('desenvolvedor');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.nome) {
          data.nome = data.nome.replace(/Unyxcore/gi, 'Unyx Core');
        }
        return {
          id: doc.id,
          ...data,
        };
      });
      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao listar usuários:", error);
      toast.error("Erro ao carregar colaboradores.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === loggedUser?.uid) {
      toast.error("Você não pode alterar seu próprio papel.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
      toast.success("Cargo atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar cargo.");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === loggedUser?.uid) {
      toast.error("Você não pode remover a si mesmo.");
      return;
    }

    if (window.confirm(`Tem certeza que deseja revogar o acesso de ${userName}? O documento do Firestore será removido.`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success(`Acesso de ${userName} revogado com sucesso!`);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao remover usuário.");
      }
    }
  };

  const handleCreateColaborador = async (e) => {
    e.preventDefault();
    if (!newNome.trim() || !newEmail.trim() || !newPassword.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSubmitLoading(true);
    
    try {
      // 1. Verificar se o e-mail já existe na base de dados
      const emailQuery = query(collection(db, 'users'), where('email', '==', newEmail.trim().toLowerCase()));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        toast.error("Este email já está em uso.");
        setSubmitLoading(false);
        return;
      }

      // 2. Gerar documento no Firestore com ID automático
      const newUserRef = doc(collection(db, 'users'));
      const newUid = newUserRef.id;

      // 3. Cadastrar dados na coleção 'users' no Firestore principal
      await setDoc(newUserRef, {
        nome: newNome.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        password: newPassword,
        createdAt: serverTimestamp(),
      });

      toast.success(`Colaborador ${newNome} cadastrado com sucesso!`);
      setIsModalOpen(false);
      
      // Limpar campos
      setNewNome('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('desenvolvedor');
    } catch (err) {
      console.error("Erro ao cadastrar colaborador:", err);
      toast.error(err.message || "Erro ao criar colaborador.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // KPIs
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    vendedores: users.filter(u => u.role === 'vendedor').length,
    devs: users.filter(u => u.role === 'desenvolvedor').length,
  };

  // Filtragem e busca
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.nome?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleIconAndBadge = (role) => {
    switch (role) {
      case 'admin':
        return { icon: Shield, style: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Admin' };
      case 'vendedor':
        return { icon: ShoppingCart, style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Vendedor' };
      case 'desenvolvedor':
        return { icon: Rocket, style: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Dev' };
      default:
        return { icon: Users, style: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20', label: 'Colaborador' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gerenciar Usuários</h1>
          <p className="text-on-surface-variant mt-1">Controle de acessos e cargos dos colaboradores.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20"
        >
          <UserPlus size={18} />
          Novo Colaborador
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 hover:border-primary/20 transition-all duration-300">
          <p className="text-2xl font-extrabold text-on-surface">{stats.total}</p>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">Total de Colaboradores</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover:border-rose-500/20 transition-all duration-300">
          <p className="text-2xl font-extrabold text-rose-400">{stats.admins}</p>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">Administradores</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
          <p className="text-2xl font-extrabold text-emerald-400">{stats.vendedores}</p>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">Vendedores</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300">
          <p className="text-2xl font-extrabold text-blue-400">{stats.devs}</p>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">Desenvolvedores</p>
        </div>
      </div>

      {/* Filters and List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
            >
              <option value="todos">Todos os Cargos</option>
              <option value="admin">Administradores</option>
              <option value="vendedor">Vendedores</option>
              <option value="desenvolvedor">Desenvolvedores</option>
            </select>
          </div>
        </div>

        {/* User Table / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 border-4 border-primary-container border-t-primary rounded-full animate-spin"></div>
            <p className="text-on-surface-variant text-sm font-label-caps tracking-wider">Carregando colaboradores...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-on-surface-variant text-lg font-medium">Nenhum colaborador encontrado</p>
            <p className="text-on-surface-variant/50 text-sm mt-1">Experimente limpar os filtros ou criar um novo usuário.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar -mx-6 md:-mx-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant/10 text-xs font-label-caps tracking-wider text-on-surface-variant/70">
                  <th className="py-3 px-6">Nome</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Cargo</th>
                  <th className="py-3 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredUsers.map((colaborador) => {
                  const badge = getRoleIconAndBadge(colaborador.role);
                  const BadgeIcon = badge.icon;
                  const isLogged = colaborador.id === loggedUser?.uid;

                  return (
                    <tr key={colaborador.id} className="hover:bg-surface-container-high/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-primary-container/20 text-primary border border-primary/20`}>
                            {colaborador.nome ? colaborador.nome.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <span className="font-semibold text-on-surface flex items-center gap-1.5">
                              {colaborador.nome}
                              {isLogged && (
                                <span className="text-[10px] font-label-caps bg-primary-container/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">
                                  Você
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-on-surface-variant/80">
                        {colaborador.email}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.style}`}>
                            <BadgeIcon size={12} />
                            {badge.label}
                          </span>
                          
                          {/* Cargo Selector dropdown */}
                          {!isLogged && (
                            <select
                              value={colaborador.role || 'desenvolvedor'}
                              onChange={(e) => handleRoleChange(colaborador.id, e.target.value)}
                              className="bg-surface-container border border-outline-variant/10 hover:border-primary/30 rounded-lg py-1 px-2 text-xs text-on-surface focus:outline-none transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <option value="admin">Tornar Admin</option>
                              <option value="vendedor">Tornar Vendedor</option>
                              <option value="desenvolvedor">Tornar Dev</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isLogged && (
                          <button
                            onClick={() => handleDeleteUser(colaborador.id, colaborador.nome)}
                            className="text-on-surface-variant/40 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                            title="Revogar acesso"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Novo Colaborador */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="glass-card rounded-2xl w-full max-w-md shadow-2xl p-6 border border-outline-variant/20 relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant/50 hover:text-on-surface p-1 rounded-lg transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-primary" size={22} />
              <h2 className="text-lg font-bold text-on-surface">Adicionar Colaborador</h2>
            </div>

            <form onSubmit={handleCreateColaborador} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1">
                <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Nome Completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                  <input
                    type="text"
                    required
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    placeholder="João Silva"
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Email de Login</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="colaborador@unyxcore.com"
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Senha Inicial</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="•••••••• (mín. 6 caracteres)"
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Cargo */}
              <div className="space-y-1">
                <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Cargo / Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-2.5 px-4 text-on-surface text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                >
                  <option value="desenvolvedor">Desenvolvedor (Dev)</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 mt-2"
              >
                {submitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin"></div>
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Cadastrar Colaborador</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
