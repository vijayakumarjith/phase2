import React from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const SandParticles = () => {
  const particlesInit = async (engine: Engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Error initializing particles:", error);
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: ["#FFD700", "#FFA500", "#FF8C00"],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          move: {
            enable: true,
            direction: "bottom",
            random: true,
            speed: { min: 1, max: 3 },
            straight: false,
            outModes: {
              default: "out",
              bottom: "out",
              top: "out",
            },
          },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default SandParticles;