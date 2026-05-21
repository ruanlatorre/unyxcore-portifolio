import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "A Unyx Core desenvolveu nossa nova plataforma de e-commerce. O número de vendas aumentou na primeira semana e a velocidade do site ficou sensacional. A experiência do cliente está impecável.",
    name: "James Dalton",
    role: "Diretor Comercial, NexaFlow",
    initials: "JD"
  },
  {
    quote: "A reformulação de design e tecnologia que fizeram no nosso portal corporativo triplicou os contatos mensais de novos clientes interessados. Foi o melhor investimento que fizemos no ano.",
    name: "Sarah Liao",
    role: "Diretora de Marketing, SkyScale",
    initials: "SL",
    highlight: true
  },
  {
    quote: "Profissionais extraordinários. Entregaram nosso aplicativo corporativo no prazo e com um design moderno e extremamente elegante que superou todas as expectativas da nossa diretoria.",
    name: "Marcus Reed",
    role: "Head de Produto, SecureNode",
    initials: "MR"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 relative">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-headline-lg text-headline-lg text-center mb-16"
        >
          Depoimentos de Sucesso
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-10 rounded-2xl relative transition-all duration-300 hover:border-primary/40 select-none hover:-translate-y-1.5 duration-300 ${
                t.highlight ? "border-primary/20 shadow-lg shadow-primary-container/5" : ""
              }`}
            >
              <Quote className="text-outline-variant absolute top-6 right-6 opacity-30 w-8 h-8 tech-glow" />
              <p className="font-body-lg text-body-lg italic mb-8 text-on-surface leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center font-bold text-primary shadow-inner">
                  {t.initials}
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-sm tracking-wider font-semibold">{t.name}</div>
                  <div className="font-label-code text-[10px] text-outline mt-0.5">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
