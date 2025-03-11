// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavButton from '../common/NavButton';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  
  // Updated navigation items with Unminifier added
  const navItems = [
    {
      label: 'Home',
      to: '/',
    },
    { 
      label: 'Coding', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Minifier', to: '/minifier' },
        { label: 'Unminifier', to: '/unminifier' }
      ]
    },
    { 
      label: 'Time & Temperature', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Time Zone Converter', to: '/timezone' },
        { label: 'Temperature', to: '/temperature' }
      ]
    },
    { 
      label: 'Converters', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'File', to: '/converter' },
        { label: 'Units', to: '/units' }
      ]
    },
    { 
      label: 'Math', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Calculator', to: '/calculator' }
      ]
    },
  ];
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  // Function to toggle a specific dropdown
  const handleDropdownToggle = (index) => {
    // If clicked dropdown is already open, close it
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      // Otherwise close the current one and open the clicked one
      setOpenDropdownIndex(index);
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-gray-800/50' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                FB-Utilities
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center ">
            {navItems.map((item, index) => (
              <NavButton
                key={index}
                to={item.to}
                href={item.href}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
                isActive={location.pathname === item.to}
                className="dark:hover:bg-gray-800/50 dark:text-gray-300"
                isDropdownOpen={openDropdownIndex === index}
                onDropdownToggle={() => handleDropdownToggle(index)}
              >
                {item.label}
              </NavButton>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-700 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-300"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full overflow-y-auto pb-12 px-4">
              <nav className="flex flex-col space-y-1 mt-6">
                {navItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="py-2 border-b border-gray-200 dark:border-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={item.to || '#'} 
                      className="block px-3 py-2 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                    
                    {item.hasDropdown && (
                      <motion.div 
                        className="pl-5 mt-1 space-y-1"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                          <motion.div
                            key={dropdownIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (dropdownIndex * 0.05) }}
                          >
                            <Link 
                              to={dropdownItem.to || dropdownItem.href || '#'} 
                              className="block pl-5 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                              target={dropdownItem.external ? "_blank" : undefined}
                              rel={dropdownItem.external ? "noopener noreferrer" : undefined}
                            >
                              {dropdownItem.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Theme Toggle */}
              <motion.div 
                className="mt-8 px-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={toggleTheme}
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2 dark:text-gray-200">Switch to {isDark ? 'Light' : 'Dark'} Theme</span>
                  {isDark ? (
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-700 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;