// src/components/common/NavButton.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * NavButton Component
 * 
 * A specialized button for navigation with hover effects similar to Framer's website.
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
  onClick,
  className = '',
  ...props
}) => {
  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (hasDropdown) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Shared button appearance
  const buttonClasses = `
    relative px-4 py-2 text-base font-medium transition-all duration-200
    rounded-lg group inline-flex items-center justify-center
    ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400'}
    ${hasDropdown ? 'pr-8' : ''} 
    ${className}
  `;

  // Background animation element
  const ButtonBackground = () => (
    <span className="absolute inset-0 w-full h-full rounded-lg bg-indigo-100/0 group-hover:bg-indigo-100/80 transition-all duration-200"></span>
  );

  // Dropdown arrow
  const DropdownArrow = () => (
    hasDropdown && (
      <svg 
        className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  );

  // Dropdown menu
  const Dropdown = () => (
    hasDropdown && isDropdownOpen && (
      <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700 transition-opacity duration-200">
        <ul className="py-1">
          {dropdownItems.map((item, index) => (
            <li key={index}>
              {item.to ? (
                <Link 
                  to={item.to} 
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  href={item.href} 
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  // Render different elements based on props
  if (to) {
    // Internal router link
    return (
      <div className="relative" {...props}>
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
          <span className="relative z-10 flex items-center">
            {children}
            <DropdownArrow />
          </span>
        </Link>
        <Dropdown />
      </div>
    );
  } else if (href) {
    // External link
    return (
      <div className="relative" {...props}>
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
          <span className="relative z-10 flex items-center">
            {children}
            <DropdownArrow />
          </span>
        </a>
        <Dropdown />
      </div>
    );
  } else {
    // Plain button
    return (
      <div className="relative" {...props}>
        <button 
          className={buttonClasses}
          onClick={(e) => {
            if (onClick) onClick(e);
            toggleDropdown();
          }}
        >
          <ButtonBackground />
          <span className="relative z-10 flex items-center">
            {children}
            <DropdownArrow />
          </span>
        </button>
        <Dropdown />
      </div>
    );
  }
};

export default NavButton;