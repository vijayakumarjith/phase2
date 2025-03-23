import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const InteractiveSand = () => {
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="interactiveSand"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              area: 800
            }
          },
          color: {
            value: ["#FFD700", "#FFA500", "#FF8C00"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: {
              enable: true,
              speed: 1,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 3 }
          },
          move: {
            enable: true,
            speed: { min: 1, max: 3 },
            direction: "bottom",
            random: true,
            straight: false,
            outModes: {
              default: "out"
            },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              },
              onClick: {
                enable: true,
                mode: "push"
              },
              resize: true
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              }
            }
          }
        },
        background: {
          color: {
            value: "transparent"
          }
        }
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default InteractiveSand;