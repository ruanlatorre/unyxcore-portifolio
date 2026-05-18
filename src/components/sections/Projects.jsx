import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Plataforma E-commerce Premium",
    description: "Desenvolvimento de loja virtual integrada de alta conversão, resultando em um aumento de 60% nas vendas online.",
    tag: "E-COMMERCE",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDxhc0SQpQErJPc3OMLWwa2za_hv_SeOayxasbBiAawcot3GmbMAfMHJNyFUPV9APJzMZfF0O2wivTkbqnvf6nkb0Iiw6kM_57W46ijoXCwo4czMqut1If_H3Ngb83kCDDRy2dlQr5iUdEJyPrHgxaK8Sdmk8j36wN8urcUrH1jRWvoJMwhflOVoGay7uHi_OgU6Byo-hvjYMFLW_ZLf-hLO7904XUEjE1_aJVlt_NkxrlaqBEl_-EkapAAIvCTU6Y_MbZTvOU9zt8"
  },
  {
    title: "Portal Corporativo & Captação",
    description: "Criação de website otimizado e focado em atração de clientes qualificados, triplicando os contatos mensais da empresa.",
    tag: "DESIGN & CONVERSÃO",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0zE2Tof0ze_sd1Xz5FYzsIHK0OWALTp1vBi2HRCRaFVmgu60QptnYa6-7QbNoolJxglSO3s0m62XFGG4YHNYLaw5s59X78wkjzzDCSWpmcMu_jiIq8F8XpS4-XBGRLqsFo1qIHQQSpdDo7krNLm2KyirOZXwYTVr6hQGJU3_fXtUivbIstJnzu_JU9x9s6GuJFO6vmJQqCJkuop17eFpk3jlttQxiipTsuaFjJ6WsF7cmfywpY3quXeBwBHdIdu3BP1GmXR3KN9jw"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-headline-lg text-headline-lg mb-4"
          >
            Casos de Sucesso
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant"
          >
            Soluções reais que transformam negócios e geram conversões extraordinárias.
          </motion.p>
        </div>

        <div className="flex gap-gutter overflow-x-auto pb-12 snap-x no-scrollbar">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="min-w-[320px] md:min-w-[600px] snap-center glass-card rounded-3xl group cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none" 
                  alt={project.title} 
                  src={project.image}
                  loading="lazy"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full font-label-code text-label-code text-primary border border-primary/25 shadow-md">
                    {project.tag}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="font-headline-md text-headline-md mb-2 group-hover:text-primary transition-colors duration-300">{project.title}</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">{project.description}</p>
                <button className="flex items-center gap-2 text-primary font-bold font-label-caps text-label-caps group-hover:gap-4 transition-all tracking-wider text-sm duration-300">
                  VER PROJETO <ArrowRight size={16} className="tech-glow" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
