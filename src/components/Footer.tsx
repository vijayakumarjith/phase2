import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Footer = () => {
  return (
    <footer className="bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,80,255,0.15),transparent_70%)]" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          variants={fadeInUp}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex justify-center items-center">
            <p className="text-gray-400">
              © 2024 E-Cell, REC & Stark Industries. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
