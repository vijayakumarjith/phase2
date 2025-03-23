import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Mail,
  Instagram,
  CheckCircle2,
  LineChart,
  Presentation,
  Rocket,
} from 'lucide-react';

const Instructions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const instructions = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Updates & Communication',
      description:
        'All updates and instructions will be shared via Email and Instagram. Stay tuned!',
      social: <Instagram className="w-6 h-6 text-pink-400 ml-2" />,
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: 'Phase 1',
      description:
        'If selected for Phase 2 you can start to work for next phase 2',
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: 'Evaluation Metrics',
      description:
        "Detailed criteria will be provided, so you know exactly what we're looking for.",
    },
    {
      icon: <Presentation className="w-8 h-8" />,
      title: 'Final Presentation',
      description:
        'Submit a 7-slide PowerPoint to showcase your startup ideas and youtube link. Template available on our website.',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Grand Challenge',
      description:
        'Pitch your product to potential investors and take your startup to the next level!',
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
            Instructions
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Follow these steps to participate in SPARK 2025
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructions.map((instruction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-purple-400">{instruction.icon}</div>
                {instruction.social && (
                  <div className="ml-auto">{instruction.social}</div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {instruction.title}
              </h3>
              <p className="text-gray-300">{instruction.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Instructions;
