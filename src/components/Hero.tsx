import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import HeroBackground from './hero/HeroBackground';
import HeroTitle from './hero/HeroTitle';
import HeroButtons from './hero/HeroButtons';
import CountdownTimer from './CountdownTimer';

const Hero = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: [
        'Welcome to Startup Spark Grand Challenge 2025',
        'Ignite Your Innovation',
        'Join the Grand Challenge',
        'Shape the Future'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });

    return () => typed.destroy();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black">
      <HeroBackground />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center">
          <HeroTitle typedRef={typedRef} />
          <CountdownTimer />
          <HeroButtons />
        </div>
      </div>
    </section>
  );
};

export default Hero;