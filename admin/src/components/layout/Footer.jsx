import { Globe, Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full py-16 border-t border-outline-variant/5 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.08),transparent_70%)]">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-1 flex items-center justify-center border border-outline-variant/30 tech-glow select-none">
              <img 
                alt="Logo Unyx Core" 
                className="w-full h-full object-cover object-top scale-[1.3] origin-top" 
                src="/logo.png" 
              />
            </div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">Unyx Core</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            © {new Date().getFullYear()} Unyx Core. Inteligência Digital e Resultados de Alto Impacto.
          </p>
          <div className="flex gap-4">
            <span className="text-outline hover:text-primary cursor-pointer transition-colors p-1 hover:scale-110 active:scale-95 duration-200">
              <Globe size={24} />
            </span>
            <span className="text-outline hover:text-primary cursor-pointer transition-colors p-1 hover:scale-110 active:scale-95 duration-200">
              <Terminal size={24} />
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 md:mt-0">
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps text-primary">Serviços</div>
            <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
              <li>
                <a href="#services" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Sistemas Web</a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Landing Pages</a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Estratégia</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="font-label-caps text-label-caps text-primary">Empresa</div>
            <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
              <li>
                <a href="#services" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Evolução Stack</a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Sobre Nós</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-primary-fixed-dim underline-offset-4 hover:underline transition-all cursor-pointer">Casos de Sucesso</a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-end justify-start md:justify-end mt-4 md:mt-0">
            <div className="text-left md:text-right">
              <div className="font-label-code text-label-code text-outline uppercase mb-2">Disponibilidade</div>
              <div className="flex items-center gap-2 justify-start md:justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-label-code text-label-code text-on-surface">Atendimento Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
