import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Lightbulb } from 'lucide-react';

const Domains = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="domains" className="py-20 bg-gradient-to-b from-purple-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Innovation Domain
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Create impactful solutions that shape the future
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="max-w-2xl mx-auto px-4"
        >
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-gradient-to-br from-purple-800/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <motion.div 
              className="text-blue-400 mb-6 transform transition-transform duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Open Innovation
            </h3>
            <p className="text-gray-300 text-lg text-center">
              Build solutions in any domain that drives meaningful impact. Let your creativity and innovation shine through as you develop solutions that address real-world challenges.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Domains;