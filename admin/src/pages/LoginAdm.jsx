import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, Terminal, AlertCircle } from 'lucide-react';

export default function LoginAdm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-email': 'Email inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/invalid-credential': 'Credenciais inválidas. Verifique email e senha.',
      };
      setError(messages[err.code] || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(210,187,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(210,187,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center border border-outline-variant/30 tech-glow">
            <img alt="Logo" className="w-full h-full object-cover object-top scale-[1.3] origin-top" src="/logo.png" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-on-surface">Unyx Core</h1>
            <p className="text-xs font-label-caps tracking-wider text-primary">Painel Administrativo</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-primary-container/5">
          <div className="flex items-center gap-2 mb-6">
            <Terminal size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Acesso Restrito</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl mb-6 animate-pulse">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-label-caps tracking-wider text-on-surface-variant">Senha</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-xl py-3 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Acessar Painel</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-on-surface-variant/40 mt-6">
            Acesso somente para colaboradores autorizados
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-on-surface-variant/20 mt-6">
          © {new Date().getFullYear()} Unyx Core — Sistema Interno
        </p>
      </div>
    </div>
  );
}
