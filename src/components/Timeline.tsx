import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Timeline = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timelineEvents = [
    {
      date: 'March 4 - March 10',
      title: 'Phase - 1',
      description: 'Begin your journey ',
    },
    {
      date: '10 March',
      title: 'Workshop Online',
      description: 'World how startup tells',
    },
    {
      date: '12th March',
      title: 'Offline workshop',
      description: 'ticket to entry for phase 2',
    },
    {
      date: '13th march',
      title: 'result Phase 1',
      description: 'Ticket to Phase 1',
    },
    {
      date: '13th march - 2nd April',
      title: 'Phase 2',
      description: 'i know its product',
    },

    {
      date: '4th April',
      title: 'Grand finale',
      description: 'Offline',
    },
  ];

  return (
    <section id="timeline" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Event Timeline</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Follow our carefully planned journey from registration to the grand finale
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line - Hidden on mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 hidden md:block" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    bounce: 0.4
                  }
                } : {}}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center`}
              >
                {/* Mobile Timeline Line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 md:hidden" />

                <div className="w-full md:w-1/2" />
                
                {/* Timeline Dot */}
                <motion.div 
                  className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 z-10"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ 
                    type: "spring",
                    bounce: 0.5,
                    delay: index * 0.1 
                  }}
                >
                  <motion.div 
                    className="absolute w-8 h-8 rounded-full bg-blue-500/50"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5] 
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                <div className={`w-full md:w-1/2 pl-8 md:pl-12 md:pr-12 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <motion.div
                    className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.span 
                      className="text-blue-400 font-semibold block mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {event.date}
                    </motion.span>
                    <motion.h3 
                      className="text-xl font-bold text-white mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {event.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {event.description}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
