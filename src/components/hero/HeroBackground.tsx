import React from 'react';
import SandParticles from '../particles/SandParticles';
import GlowParticles from '../particles/GlowParticles';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0">
      <div className="relative h-full w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80)',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black/70 to-blue-900/50" />
        <SandParticles />
        <GlowParticles />
      </div>
    </div>
  );
};

export default HeroBackground;