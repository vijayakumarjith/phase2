import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, Instagram } from 'lucide-react';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const coordinators = [
    {
      name: 'Nitin V H',
      phone: '+91 86690 98651'
    },
    {
      name: 'Jitheeswaran.V',
      phone: '+91 93440 22155'
    },
    {
      name: 'Jayden',
      phone: '+91 80988 77999'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,80,255,0.1),transparent_70%)]" />
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Contact Our Student Coordinators</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {coordinators.map((coordinator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-6"
            >
              <h4 className="text-xl font-semibold text-white mb-3">{coordinator.name}</h4>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>{coordinator.phone}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center justify-center space-x-2 text-gray-300"
          >
            <Mail className="w-5 h-5" />
            <a href="mailto:startupspark@rajalakshmi.edu.in" className="hover:text-purple-400 transition-colors">
              startupspark@rajalakshmi.edu.in
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center justify-center space-x-2 text-gray-300"
          >
            <Instagram className="w-5 h-5" />
            <a href="https://instagram.com/Edc_rec" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
              @Edc_rec
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;