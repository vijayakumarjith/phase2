import React from 'react';
import { motion } from 'framer-motion';

interface CursorRingProps {
  mousePosition: { x: number; y: number };
  size: number;
  delay?: number;
  borderColor?: string;
}

const CursorRing: React.FC<CursorRingProps> = ({ 
  mousePosition, 
  size, 
  delay = 0,
  borderColor = "border-purple-500" 
}) => {
  return (
    <motion.div
      className={`fixed border-2 ${borderColor} rounded-full pointer-events-none z-50 mix-blend-difference`}
      style={{ width: size, height: size }}
      animate={{ 
        x: mousePosition.x - size / 2, 
        y: mousePosition.y - size / 2,
        rotate: [0, 180],
        scale: [1, 1.1, 1]
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        delay,
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
    />
  );
};

export default CursorRing;