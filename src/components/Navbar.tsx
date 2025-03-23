import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  onAuthClick: () => void;
  isAuthenticated?: boolean;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onAuthClick,
  isAuthenticated = false,
  userName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { title: 'Home', href: '#home' },
    { title: 'About Event', href: '#about' },
    { title: 'Domains', href: '#domains' },
    { title: 'Timeline', href: '#timeline' },
    { title: 'Eligibility', href: '#eligibility' },
    { title: 'Contact', href: '#contact' },
  ];

  const handleAuthClick = () => {
    onAuthClick();
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white font-bold text-xl"
          >
            Startup Spark Grand Challenge 2025
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.title}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  className="flex items-center text-purple-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="truncate max-w-[120px]">{userName}</span>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={handleAuthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </motion.button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </a>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-purple-400 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 flex items-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="w-full px-3 py-2 flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
