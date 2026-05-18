import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Layers, Cloud, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Sistemas & Apps",
    description: "Sistemas web customizados, CRMs e aplicativos internos planejados para otimizar a operação do seu negócio.",
    icon: Layers,
    tech: ["Sistemas Web ERP/CRM", "Integrações de API"]
  },
  {
    title: "Sites & Conversão",
    description: "Sites corporativos premium e Landing Pages de alta conversão criados para atrair leads qualificados e gerar vendas.",
    icon: Cloud,
    tech: ["Landing Pages de Venda", "E-commerces Modernos"]
  },
  {
    title: "Estratégia Digital",
    description: "Planejamento e estruturação de funis de vendas, automação de marketing e otimização para captação de clientes.",
    icon: Shield,
    tech: ["Automação de Contatos", "Otimização de Conversão"]
  },
  {
    title: "Consultoria & Stack",
    description: "Acompanhamento estratégico para escolher as melhores ferramentas, reduzir custos de software e modernizar sua empresa.",
    icon: Activity,
    tech: ["Análise de Tecnologias", "Segurança da Informação"]
  }
];

const Services = () => {
  const tiltRefs = useRef([]);

  useEffect(() => {
    tiltRefs.current.forEach(ref => {
      if (ref) {
        VanillaTilt.init(ref, {
          max: 10,
          speed: 400,
          glare: true,
          "max-glare": 0.15,
        });
      }
    });
    
    return () => {
      tiltRefs.current.forEach(ref => {
        if (ref && ref.vanillaTilt) {
          ref.vanillaTilt.destroy();
        }
      });
    };
  }, []);

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-label-code text-label-code text-primary mb-4 block uppercase tracking-widest">// Soluções Completas</span>
            <h2 className="font-headline-lg text-headline-lg">Como Ajudamos Sua Empresa</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body-md text-body-md text-on-surface-variant max-w-xs text-right hidden md:block leading-relaxed"
          >
            Combinamos design impecável e tecnologia sob medida para gerar resultados reais e vendas diárias.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {services.map((service, index) => (
            <motion.div
              key={index}
              ref={el => tiltRefs.current[index] = el}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group hover:border-primary/50 transition-all cursor-pointer select-none"
            >
              <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-container transition-all shadow-inner">
                <service.icon className="text-primary group-hover:text-white transition-colors duration-300 w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-headline-md mb-4 text-xl group-hover:text-primary transition-colors duration-300">{service.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 font-label-code text-label-code text-outline border-t border-outline-variant/10 pt-4">
                {service.tech.map((tech, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
