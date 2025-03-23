import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DNAParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const ClickRipple = () => {
  const [particles, setParticles] = useState<DNAParticle[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const particleCount = 12; // Number of particles in the DNA helix
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: counter + i,
        x: e.clientX,
        y: e.clientY,
        rotation: (360 / particleCount) * i,
      }));

      setParticles(prev => [...prev, ...newParticles]);
      setCounter(prev => prev + particleCount);

      // Remove particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [counter]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              scale: 0,
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: 0.8,
            }}
            animate={{ 
              scale: 1,
              x: particle.x + Math.cos(particle.rotation * Math.PI / 180) * 50,
              y: particle.y + Math.sin(particle.rotation * Math.PI / 180) * 50,
              rotate: particle.rotation + 360,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut",
            }}
            className="absolute w-2 h-2"
          >
            <div className="w-full h-full relative">
              {/* DNA Base Pair */}
              <div className="absolute inset-0 bg-purple-500 rounded-full" />
              <div className="absolute w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent origin-left" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickRipple;