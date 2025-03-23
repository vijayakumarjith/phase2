import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Building2, Briefcase, Coins, Rocket } from 'lucide-react';

const Prizes = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Pre-incubation Status',
      description:
        'First pre-incubated startups from Rajalakshmi Engineering College',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: '1-Year Lab Access',
      description: 'Dedicated workspace to continue developing your projects',
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'Investor Funding',
      description: 'Potential funding for selected projects',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Seed Fund Opportunity',
      description: 'Fuel your promising projects for growth',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-900 to-black">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Prizes & Benefits
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Compete for extraordinary rewards and opportunities
          </p>
        </div>

        {/* Main Prize */}
        <div className="max-w-md mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="relative group rounded-2xl p-8 bg-gradient-to-br from-purple-800/30 to-blue-900/30 backdrop-blur-lg text-center"
          >
            <div className="text-blue-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Grand Prize</h3>
            <p className="text-purple-400 text-lg">
              Prize worth ₹55,000 + exciting prizes
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Additional Benefits
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-800/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="text-purple-400">{benefit.icon}</div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Prizes;
