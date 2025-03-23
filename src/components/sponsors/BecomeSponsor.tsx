import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const BecomeSponsor = () => {
  return (
    <div className="mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80"
            alt="Startup"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-lg p-12 text-center">
          <h3 className="text-3xl font-bold gradient-text mb-6">
            Become a Sponsor
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join us in shaping the future of innovation. Partner with SPARK 2025
            and connect with the brightest minds in technology.
          </p>
          <motion.a
            href="/sponsorship-deck.pdf"
            download
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Sponsorship Deck
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeSponsor;
