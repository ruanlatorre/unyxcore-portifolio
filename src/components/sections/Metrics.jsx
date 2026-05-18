import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Counter = ({ value, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    let animationFrameId;
    if (isInView) {
      let start = 0;
      // Extract numeric value
      const target = parseFloat(value.replace(/[^0-9.]/g, ''));
      const isFloat = value.includes('.');
      const increment = target / (duration * 60); // 60fps
      
      const updateCounter = () => {
        start += increment;
        if (start < target) {
          setCount(isFloat ? parseFloat(start.toFixed(1)) : Math.floor(start));
          animationFrameId = requestAnimationFrame(updateCounter);
        } else {
          setCount(target);
        }
      };
      
      animationFrameId = requestAnimationFrame(updateCounter);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, value, duration]);

  const prefix = value.startsWith('+') ? '+' : '';

  return (
    <span ref={ref} className="font-display-lg text-display-lg text-primary tech-glow">
      {prefix}{count}{suffix}
    </span>
  );
};

const Metrics = () => {
  const metrics = [
    { value: "+200", suffix: "", label: "Projetos Entregues" },
    { value: "+50", suffix: "", label: "Empresas Parceiras" },
    { value: "+98", suffix: "%", label: "Satisfação dos Clientes" }
  ];

  return (
    <section id="metrics" className="py-24 bg-surface-container-low border-y border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {metrics.map((metric, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-center items-baseline gap-1">
              <Counter value={metric.value} suffix={metric.suffix} />
            </div>
            <div className="font-label-caps text-label-caps text-outline uppercase tracking-[0.2em] text-xs">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Metrics;
