import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// --- Landing Page Imports ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import Metrics from './components/sections/Metrics';
import Testimonials from './components/sections/Testimonials';
import CTA from './components/sections/CTA';

// --- Admin Imports ---
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoginAdm from './pages/LoginAdm';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import CadastrarVenda from './pages/vendedor/CadastrarVenda';
import PainelEntregas from './pages/vendedor/PainelEntregas';
import HistoricoVendas from './pages/vendedor/HistoricoVendas';
import FilaProjetos from './pages/desenvolvedor/FilaProjetos';
import MeusProjetos from './pages/desenvolvedor/MeusProjetos';
import Configuracoes from './pages/Configuracoes';
import { SettingsProvider } from './contexts/SettingsContext';

import './admin.css';

gsap.registerPlugin(ScrollTrigger);

// --- Componente da Landing Page ---
function LandingPage() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // 1. Smooth Scroll Setup (Lenis)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Click to Scroll to Anchor Links with Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const targetId = target.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            lenis.scrollTo(targetElement, {
              offset: -80, // Offset para compensar o Navbar fixo (h-20 = 80px)
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };

    window.addEventListener('click', handleAnchorClick, { capture: true });

    // 3. Custom Cursor Motion logic
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 4. Custom Cursor Hover Expansion Effect
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .glass-card, .cursor-pointer');
      if (cursorRef.current) {
        if (target) {
          gsap.to(cursorRef.current, {
            scale: 1.8,
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            borderColor: "rgba(210, 187, 255, 0.9)",
            duration: 0.3
          });
        } else {
          gsap.to(cursorRef.current, {
            scale: 1,
            backgroundColor: "rgba(124, 58, 237, 0.3)",
            borderColor: "rgba(210, 187, 255, 0.5)",
            duration: 0.3
          });
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Cleanup listeners
    return () => {
      lenis.destroy();
      window.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Premium Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-primary-container/30 border border-primary/50 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm tech-glow hidden md:block"
        style={{ mixBlendMode: 'screen' }}
      ></div>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <TechStack />
        <Projects />
        <Metrics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

// --- Componente Principal ---
export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/loginadm" element={<LoginAdm />} />

            {/* Painel Administrativo Protegido */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Visível para Todos os Logados */}
              <Route index element={<AdminDashboard />} />

              {/* Rota de Configurações Visível para Todos os Logados */}
              <Route
                path="configuracoes"
                element={
                  <ProtectedRoute>
                    <Configuracoes />
                  </ProtectedRoute>
                }
              />

              {/* Rotas exclusivas de Vendedores e Administradores */}
              <Route
                path="cadastrar-venda"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <CadastrarVenda />
                  </ProtectedRoute>
                }
              />
              <Route
                path="entregas"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <PainelEntregas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="historico"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                    <HistoricoVendas />
                  </ProtectedRoute>
                }
              />

              {/* Rotas exclusivas de Desenvolvedores e Administradores */}
              <Route
                path="fila-projetos"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'desenvolvedor']}>
                    <FilaProjetos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="meus-projetos"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'desenvolvedor']}>
                    <MeusProjetos />
                  </ProtectedRoute>
                }
              />

              {/* Rota exclusiva do Administrador */}
              <Route
                path="gerenciar-usuarios"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GerenciarUsuarios />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirecionar rotas não encontradas para a página inicial */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
