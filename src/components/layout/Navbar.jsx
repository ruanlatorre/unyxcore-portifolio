import { useState, useEffect } from 'react';
import { Terminal, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "#home" },
    { label: "Engenharia", href: "#about" },
    { label: "Serviços", href: "#services" },
    { label: "Projetos", href: "#projects" },
    { label: "Depoimentos", href: "#testimonials" },
  ];

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 h-20 flex items-center transition-all duration-300",
      scrolled || mobileMenuOpen
        ? "bg-surface/80 dark:bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-2xl"
        : "bg-transparent border-transparent"
    )}>
      <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center w-full relative z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1.5 flex items-center justify-center border border-outline-variant/30 tech-glow select-none">
            <img
              alt="Logo Unyx Core"
              className="w-full h-full object-cover object-top scale-[1.3] origin-top"
              src="/logo.png"
            />
          </div>
          <span className="font-headline-md text-headline-md font-extrabold tracking-tighter text-on-surface dark:text-white">
            Unyx Core
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="text-on-surface-variant dark:text-on-surface-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300 font-label-caps text-label-caps tracking-wider relative group"
              href={link.href}
            >
              {link.label}
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="text-primary cursor-pointer active:scale-95 transition-transform hover:opacity-80 p-2 hidden sm:block"
            title="Abrir terminal de contato"
          >
            <Terminal size={24} className="tech-glow" />
          </a>
          <a
            href="#contact"
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-label-caps text-label-caps font-bold hover:brightness-110 active:scale-95 transition-all text-sm hidden md:block shadow-md shadow-primary-container/20"
          >
            Falar com Unyx Core
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface p-2 focus:outline-none hover:text-primary transition-colors"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic) */}
      <div className={cn(
        "fixed inset-0 w-full h-screen bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-in-out z-40 flex flex-col justify-center px-8 md:hidden border-b border-outline-variant/10",
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <nav className="flex flex-col gap-8 text-center">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "font-headline-md text-headline-md hover:text-primary transition-colors duration-300 font-bold tracking-wider",
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${index * 100}ms`, transitionDuration: '400ms' }}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-4 mt-8 max-w-xs mx-auto w-full">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary-container text-on-primary-container px-6 py-4 rounded-xl font-label-caps text-label-caps font-extrabold hover:brightness-110 active:scale-95 transition-all text-center shadow-lg shadow-primary-container/20"
            >
              Falar com Unyx Core
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
