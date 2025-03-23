import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface SponsorCardProps {
  sponsor: {
    name: string;
    logo: string;
    description: string;
    website?: string;
  };
  index: number;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <motion.div
        whileHover={{ y: -5 }}
        className="relative bg-black/50 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div className="relative h-48">
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="p-6">
          <h4 className="text-xl font-semibold text-white mb-2">{sponsor.name}</h4>
          <p className="text-gray-300 text-sm mb-4">{sponsor.description}</p>
          {sponsor.website && (
            <motion.a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              Visit Website <ExternalLink className="w-4 h-4 ml-1" />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SponsorCard;