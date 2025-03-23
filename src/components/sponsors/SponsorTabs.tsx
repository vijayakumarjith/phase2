import React from 'react';
import { motion } from 'framer-motion';

interface SponsorTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const SponsorTabs: React.FC<SponsorTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: 'basic', color: 'from-green-400 to-emerald-500' },
    { id: 'Gold', color: 'from-yellow-400 to-amber-300' },
    { id: 'Silver', color: 'from-gray-400 to-gray-300' },
    { id: 'Bronze', color: 'from-amber-700 to-yellow-800' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map(({ id, color }) => (
        <motion.button
          key={id}
          onClick={() => onCategoryChange(id)}
          className={`relative px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300
            ${
              activeCategory === id
                ? `bg-gradient-to-r ${color} text-black`
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeCategory === id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{id}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default SponsorTabs;
