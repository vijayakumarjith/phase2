import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AlertCircle, FileCheck, Users, ExternalLink, Download } from 'lucide-react';
import RegistrationButtons from './RegistrationButtons';

const RegistrationInstructions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const rules = [
    {
      icon: <AlertCircle className="w-6 h-6" />,
      text: 'No AI generated content allowed in submissions',
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: 'Teams will be fixed permanently till the end of grand finale',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      text: 'Complete all phase 1 requirements before registration',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-900">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Phase 1 Instructions
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            In this section you will get the instructions for registration
          </p>
        </div>

        {/* Phase 1 Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Phase 1 Registration
          </h3>
          <p className="text-gray-300 mb-6">
            Click the link below to sign in and register for phase 1. Make
            sure to review all rules and requirements before proceeding.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RegistrationButtons />
            <motion.a
              href="https://docs.google.com/presentation/d/1xTl0W_sa2uf7QMBwoCCPji2dmOJxClD-40S0y_4bkmQ/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5 mr-2" />
              Download PPT Template
            </motion.a>
          </div>
        </motion.div>

        {/* Rules */}
        <div className="grid md:grid-cols-3 gap-8">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-800/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-6"
            >
              <div className="text-purple-400 mb-4">{rule.icon}</div>
              <p className="text-gray-300">{rule.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RegistrationInstructions;
