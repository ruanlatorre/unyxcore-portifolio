import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section id="contact" className="py-32 px-margin-mobile">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-container-max mx-auto glass-card rounded-[40px] p-12 md:p-24 relative overflow-hidden text-center border border-outline-variant/20 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#7c3aed33,transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-display-lg text-display-lg mb-8 leading-tight">Pronto para Escalar as Suas Vendas?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
            Entre em contato conosco hoje mesmo para uma consultoria de negócios. Vamos analisar juntos a melhor estratégia e solução digital para impulsionar a sua empresa no mercado.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-md mx-auto sm:max-w-none">
            <a 
              href="mailto:contact@unyxcore.com?subject=Reuniao de Negocios&body=Olá equipe Unyx Core, gostaria de agendar uma reunião comercial para discutir nosso projeto."
              className="bg-primary text-on-primary px-12 py-5 rounded-xl font-headline-md text-headline-md text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center justify-center font-bold"
            >
              Agendar Reunião Gratuita
            </a>
            <a 
              href="mailto:contact@unyxcore.com?subject=Consulta de Projeto"
              className="bg-surface-container-high text-on-surface px-12 py-5 rounded-xl font-headline-md text-headline-md text-lg hover:bg-surface-bright transition-all flex items-center justify-center font-medium border border-outline-variant/30"
            >
              Falar pelo WhatsApp
            </a>
          </div>
          <div className="mt-16 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 select-none">
            <span className="font-label-code text-label-code border border-outline-variant/30 px-3 py-1.5 rounded bg-surface-container-low text-xs">ATENDIMENTO PREMIUM</span>
            <span className="font-label-code text-label-code border border-outline-variant/30 px-3 py-1.5 rounded bg-surface-container-low text-xs">ENTREGA RÁPIDA</span>
            <span className="font-label-code text-label-code border border-outline-variant/30 px-3 py-1.5 rounded bg-surface-container-low text-xs">CONFORME LGPD</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
