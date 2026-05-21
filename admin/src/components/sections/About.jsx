import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-32 bg-surface-container-lowest relative">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-headline-lg text-headline-lg mb-8 leading-tight">
            Transformação Digital <br/>
            <span className="text-outline">Para Sua Empresa.</span>
          </h2>
          <div className="space-y-6 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            <p>Na Unyx Core, somos especializados em converter objetivos de negócios em plataformas digitais de alta performance. Desenvolvemos desde sites corporativos sofisticados até sistemas internos sob medida para automatizar seus processos e maximizar seus lucros.</p>
            <p>Nossa equipe de especialistas atua em parceria estreita com sua empresa para criar designs memoráveis, experiências de uso impecáveis e tecnologias integradas que preparam sua marca para crescer de maneira acelerada e consistente no mercado atual.</p>
          </div>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="font-headline-md text-headline-md text-primary font-bold">100%</div>
              <div className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Personalizado</div>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-primary font-bold">FOCO</div>
              <div className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Em Resultados Reais</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-square glass-card rounded-3xl overflow-hidden group">
            <img 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105 duration-700" 
              alt="Sala de reuniões moderna e elegante de uma agência digital com luzes azuis e roxas." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOsYcZGoVfyPBtor5MfDWMoQJ7TTBgpbB4qmSypJDell3GIgeU0HT_VF1ocisWfmxQA0ay2d6NWIdupi7NE0mXQ2lVCPicqhUDwOHdqXrN2cOH9IkcaqiGXYYKaq8LtqD5jhxM7yjkIp6EkK9i2Pjy8_7SQGA-psvnzKAxkJujt8cB2itU1dFmubhaRglk_Y3apb7X7UU1FZDkQtjGiFBrzYCgTDm-cVE_BD06EAZdpGW7m1WK8sjdSb8gS3AGDWwfr69EJAxrtF0d" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          <motion.div 
            className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl max-w-xs shadow-xl border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ShieldCheck className="text-primary mb-3 tech-glow" size={32} />
            <p className="font-label-code text-label-code leading-normal">Segurança de dados e excelência comercial em cada entrega.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
