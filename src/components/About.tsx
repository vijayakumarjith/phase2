import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInUp, staggerContainer } from '../utils/animations';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-black to-purple-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,80,255,0.1),transparent_70%)]" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="initial"
        animate={inView ? 'animate' : 'initial'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            About STARTUP SPARK 2025 GRAND CHALLENGE
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Startup Spark 2025 Grand Challenge is a student-driven initiative to
            encourage innovation and entrepreneurship. The event offers an
            opportunity to showcase business ideas and prototypes with a chance
            for commercial development
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
