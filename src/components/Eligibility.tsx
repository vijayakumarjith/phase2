import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, XCircle } from 'lucide-react';

const Eligibility = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const eligibilityCriteria = [
    'Open to all UG and PG students across disciplines',
    'Teams must have 2-5 members',
    'at least 2 should have technical background',
  ];

  const restrictions = [
    'No multiple team participation',
    'No plagiarized solutions',
    'No changes in team composition after registration',
  ];

  return (
    <section
      id="eligibility"
      className="py-20 bg-gradient-to-b from-black to-purple-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Eligibility Criteria
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Check if you meet our participation requirements
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              Eligibility Criteria
            </h3>
            <ul className="space-y-4">
              {eligibilityCriteria.map((criterion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  {criterion}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <XCircle className="w-6 h-6 text-red-400 mr-2" />
              Restrictions
            </h3>
            <ul className="space-y-4">
              {restrictions.map((restriction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <XCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  {restriction}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Eligibility;
