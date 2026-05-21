import { motion } from 'framer-motion';

const TechStack = () => {
  const techs = ["HTML/CSS", "REACT", "NODE.JS", "PHP", "FIREBASE", "NUVEM"];

  return (
    <section id="techstack" className="py-24 bg-surface-container-lowest/50 border-y border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-label-caps text-label-caps text-center text-outline mb-12 uppercase tracking-[0.25em]"
        >
          Tecnologias de Alto Desempenho para seu Negócio
        </motion.p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-12 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
          {techs.map((tech, i) => (
            <motion.span 
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="font-label-code text-label-code text-2xl font-extrabold tracking-tighter text-on-surface hover:text-primary transition-colors cursor-default select-none"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
