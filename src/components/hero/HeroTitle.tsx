import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeInUp } from '../../utils/animations';

interface HeroTitleProps {
  typedRef: React.RefObject<HTMLSpanElement>;
}

const HeroTitle = ({ typedRef }: HeroTitleProps) => {
  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center mb-6"
      >
        <Sparkles className="text-yellow-400 w-8 h-8 sm:w-12 sm:h-12 mr-2" />
      </motion.div>

      <div className="min-h-[4rem] sm:min-h-[6rem] md:min-h-[8rem] mb-6">
        <span
          ref={typedRef}
          className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
        />
      </div>

      <motion.p
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12"
      >
        Transform Your Ideas into Successful Ventures
      </motion.p>
    </>
  );
};

export default HeroTitle;