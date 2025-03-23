import React from 'react';
import { motion } from 'framer-motion';
import SponsorCard from './SponsorCard';
import { SponsorCategory } from '../../types/sponsors';

interface SponsorGridProps {
  sponsors: SponsorCategory[];
  category: string;
}

const SponsorGrid: React.FC<SponsorGridProps> = ({ sponsors = [], category }) => {
  if (!sponsors.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-400">No sponsors available for this category.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sponsors.map((sponsor, index) => (
        <SponsorCard key={index} sponsor={sponsor} index={index} />
      ))}
    </div>
  );
};

export default SponsorGrid;