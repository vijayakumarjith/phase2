import React from 'react';
import { motion } from 'framer-motion';

interface CursorDotProps {
  mousePosition: { x: number; y: number };
  size: number;
  delay?: number;
  color?: string;
}

const CursorDot: React.FC<CursorDotProps> = ({ 
  mousePosition, 
  size, 
  delay = 0,
  color = "bg-blue-500" 
}) => {
  return (
    <motion.div
      className={`fixed ${color} rounded-full pointer-events-none z-50 mix-blend-difference`}
      style={{ width: size, height: size }}
      animate={{ 
        x: mousePosition.x - size / 2, 
        y: mousePosition.y - size / 2,
        scale: [1, 1.2, 1]
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        delay,
        scale: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
    />
  );
};

export default CursorDot;