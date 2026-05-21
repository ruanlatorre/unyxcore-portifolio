import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden mesh-bg">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-container/5 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-container-max mx-auto px-margin-desktop text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant/20 bg-surface-container-lowest/50 mb-8 cursor-pointer hover:border-primary/45 transition-colors"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-label-code text-label-code text-primary uppercase text-xs tracking-wider">Disponível para novos projetos</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-display-lg text-display-lg mb-6 leading-tight max-w-4xl mx-auto"
        >
          Soluções Digitais Premium que <span className="text-primary tech-glow">Geram Resultados</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10"
        >
          Desenvolvemos sistemas sob medida, plataformas web de alta conversão e estratégias digitais inteligentes para impulsionar suas vendas e escalar o seu negócio de forma sólida.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <a 
            href="#contact" 
            className="bg-primary-container text-on-primary-container px-10 py-4 rounded-xl font-label-caps text-label-caps font-extrabold text-lg shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            Falar com Consultor
          </a>
          <a 
            href="#services" 
            className="glass-card px-10 py-4 rounded-xl font-label-caps text-label-caps font-bold text-lg hover:bg-surface-variant/20 transition-all border border-outline-variant/30 flex items-center justify-center"
          >
            Nossos Serviços
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none select-none hidden md:block"
      >
        <div className="glass-card rounded-t-3xl h-64 border-b-0 p-8 flex flex-col gap-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-2 bg-outline-variant/20 rounded-full w-full"></div>
            <div className="h-2 bg-outline-variant/20 rounded-full w-3/4"></div>
            <div className="h-2 bg-outline-variant/20 rounded-full w-full"></div>
            <div className="h-2 bg-outline-variant/20 rounded-full w-1/2"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
