import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Users, Lightbulb, Globe, Award, Rocket } from 'lucide-react';

const Benefits = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Industry Recognition',
      description:
        'Get recognized by leading tech companies and industry experts',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Networking',
      description:
        'Connect with like-minded innovators and industry professionals',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Mentorship',
      description:
        'Receive guidance from experienced mentors throughout the journey',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Exposure',
      description: 'Showcase your innovation to a worldwide audience',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Certificates',
      description: 'Earn certificates and Prizes for your achievements',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Incubation Support',
      description:
        'Get support to transform your idea into a successful startup',
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
          <h2 className="text-4xl font-bold gradient-text mb-6">Benefits</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Join SPARK 2025 and unlock a world of opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="text-purple-400 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Benefits;
