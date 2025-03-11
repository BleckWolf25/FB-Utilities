// src/components/common/NavButton.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NavButton Component
 * 
 * A specialized button for navigation with hover effects.
 * Features a subtle background expansion animation and optional dropdown functionality.
 * 
 * Props:
 * - children: Button content
 * - to: Link destination (if using as a router link)
 * - href: External link URL (if using as an external link)
 * - isActive: Whether this nav item is currently active
 * - hasDropdown: Whether this button has a dropdown menu
 * - dropdownItems: Array of dropdown menu items (with label and to/href props)
 * - onClick: Function to call when button is clicked
 * - className: Additional CSS classes
 */
const NavButton = ({
  children,
  to,
  href,
  isActive = false,
  hasDropdown = false,
  dropdownItems = [],
  isDropdownOpen = false,
  onDropdownToggle,
  onClick,
  className = '',
  ...props
}) => {
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (hasDropdown && onDropdownToggle) {
      onDropdownToggle();
    }
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    if (isDropdownOpen) {
      setisDropdownOpen(false);
    }
  };

  // Shared button appearance
  const buttonClasses = `
    relative px-4 py-2 text-base font-medium transition-all duration-200
    rounded-lg group inline-flex items-center
    ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400'}
    ${className}
  `;

  // Background animation element using Framer Motion
  const ButtonBackground = () => (
    <motion.span 
      className="absolute inset-0 w-full h-full rounded-lg bg-indigo-100/0"
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
  // Dropdown arrow with motion
  const DropdownArrow = () => (
    hasDropdown && (
      <motion.svg 
        className="ml-1 h-4"
        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </motion.svg>
    )
  );

  // Dropdown menu with animation
  const Dropdown = () => (
    hasDropdown && (
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {dropdownItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {item.to ? (
                    <Link 
                      to={item.to} 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                      onClick={() => onDropdownToggle()}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a 
                      href={item.href} 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                      onClick={() => onDropdownToggle()}
                    >
                      {item.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    )
  );

  // Render different elements based on props
  if (to) {
    // Internal router link
    return (
      <div className="relative" {...props}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link 
            to={to} 
            className={buttonClasses}
            onClick={(e) => {
              if (onClick) onClick(e);
              if (hasDropdown) {
                e.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <ButtonBackground />
            <span className="relative z-10 flex items-center justify-between w-full">
              <span>{children}</span>
              <DropdownArrow />
            </span>
          </Link>
        </motion.div>
        <Dropdown />
      </div>
    );
  } else if (href) {
    // External link
    return (
      <div className="relative" {...props}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <a 
            href={href}
            className={buttonClasses}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (onClick) onClick(e);
              if (hasDropdown) {
                e.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <ButtonBackground />
            <span className="relative z-10 flex items-center justify-between w-full">
              <span>{children}</span>
              <DropdownArrow />
            </span>
          </a>
        </motion.div>
        <Dropdown />
      </div>
    );
  } else {
    // Plain button
    return (
      <div className="relative" {...props}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <button 
            className={buttonClasses}
            onClick={(e) => {
              if (onClick) onClick(e);
              toggleDropdown();
            }}
          >
            <ButtonBackground />
            <span className="relative z-10 flex items-center justify-between w-full">
              <span>{children}</span>
              <DropdownArrow />
            </span>
          </button>
        </motion.div>
        <Dropdown />
      </div>
    );
  }
};

export default NavButton;