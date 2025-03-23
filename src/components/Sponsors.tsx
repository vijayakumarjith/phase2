import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Award, Star, Shield, Zap } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  category: string;
}

const Sponsors = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Categories with their icons and colors
  const categories = [
    { id: 'All', icon: <Award />, color: 'from-purple-600 to-blue-600' },
    { id: 'Diamond', icon: <Star />, color: 'from-yellow-400 to-amber-500' },
    { id: 'Gold', icon: <Shield />, color: 'from-yellow-500 to-amber-400' },
    { id: 'Silver', icon: <Zap />, color: 'from-gray-400 to-gray-300' },
    { id: 'Basic', icon: <Award />, color: 'from-green-500 to-emerald-400' }
  ];

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const sponsorsSnapshot = await getDocs(collection(db, 'sponsors'));
        const sponsorsData: Sponsor[] = [];
        sponsorsSnapshot.forEach((doc) => {
          sponsorsData.push({ id: doc.id, ...doc.data() } as Sponsor);
        });
        setSponsors(sponsorsData);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Filter sponsors based on active category
  const filteredSponsors = activeCategory === 'All' 
    ? sponsors
    : sponsors.filter(sponsor => sponsor.category === activeCategory);

  return (
    <section id="sponsors" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,80,255,0.1),transparent_70%)]" />
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Our Sponsors
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Powered by industry-leading companies and organizations
          </p>
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto pb-4 mb-8 md:flex-wrap md:justify-center md:gap-4 md:pb-0 md:mb-12 hide-scrollbar">
          <div className="flex space-x-2 md:flex-wrap md:justify-center md:gap-4 md:space-x-0 px-1">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="relative px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-semibold transition-all duration-300 flex items-center space-x-2 flex-shrink-0 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeSponsorTab"
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-full`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 flex items-center ${activeCategory === category.id ? 'text-white' : 'text-gray-400'}`}>
                  {category.icon && <span className="inline-block w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2">{category.icon}</span>}
                  <span>{category.id}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sponsors Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredSponsors.length > 0 ? (
              filteredSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 ${getCategoryGlowColor(sponsor.category)} rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-100`} />
                  <motion.a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    className={`relative block bg-black/50 backdrop-blur-xl rounded-xl overflow-hidden ${getCategoryBorderColor(sponsor.category)} transition-all duration-300 h-full`}
                  >
                    <div className="relative h-40 sm:h-48">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-full h-full object-contain object-center p-4 bg-black/70 transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(sponsor.category)}`}>
                          {sponsor.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-6">
                      <h4 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300 line-clamp-1">
                        {sponsor.name}
                      </h4>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 h-10">{sponsor.description}</p>
                      <div className={`flex items-center ${getCategoryTextColor(sponsor.category)} transition-colors`}>
                        <span className="mr-2 text-sm md:text-base">Visit Website</span>
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                No sponsors available in this category yet.
              </div>
            )}
          </div>
        )}

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 md:mt-20 relative overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-lg"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          
          <div className="relative p-6 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: "spring", bounce: 0.4, delay: 0.6 }}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center"
            >
              <Award className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4 md:mb-6">Become a Sponsor</h3>
            <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
              Join us in shaping the future of innovation. Partner with Startup Spark 2025 and connect 
              with the brightest minds in technology.
            </p>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-base md:text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Contact Us to Sponsor
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Helper functions for category-specific styling
const getCategoryGlowColor = (category: string) => {
  switch (category) {
    case 'Diamond':
      return 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20';
    case 'Gold':
      return 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20';
    case 'Silver':
      return 'bg-gradient-to-r from-gray-500/20 to-gray-400/20';
    case 'Basic':
      return 'bg-gradient-to-r from-blue-600/20 to-blue-500/20';
    default:
      return 'bg-gradient-to-r from-purple-600/20 to-blue-600/20';
  }
};

const getCategoryBorderColor = (category: string) => {
  switch (category) {
    case 'Diamond':
      return 'border border-yellow-500/30 hover:border-yellow-500/60';
    case 'Gold':
      return 'border border-yellow-500/30 hover:border-yellow-500/60';
    case 'Silver':
      return 'border border-gray-400/30 hover:border-gray-400/60';
    case 'Basic':
      return 'border border-blue-500/30 hover:border-blue-500/60';
    default:
      return 'border border-purple-500/30 hover:border-purple-500/60';
  }
};

const getCategoryTextColor = (category: string) => {
  switch (category) {
    case 'Diamond':
      return 'text-yellow-400 group-hover:text-yellow-300';
    case 'Gold':
      return 'text-yellow-400 group-hover:text-yellow-300';
    case 'Silver':
      return 'text-gray-400 group-hover:text-gray-300';
    case 'Basic':
      return 'text-blue-400 group-hover:text-blue-300';
    default:
      return 'text-purple-400 group-hover:text-purple-300';
  }
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'Diamond':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'Gold':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'Silver':
      return 'bg-gray-500/20 text-gray-300';
    case 'Basic':
      return 'bg-blue-500/20 text-blue-300';
    default:
      return 'bg-purple-500/20 text-purple-300';
  }
};

export default Sponsors;