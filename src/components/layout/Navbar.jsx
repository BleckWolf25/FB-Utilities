// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavButton from '../common/NavButton';
import Button from '../common/Button';

/**
 * Navbar Component
 * 
 * A responsive navigation bar with mobile menu, inspired by modern design patterns.
 * Features smooth transitions, dropdown support, and scroll-aware behavior.
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Navigation items configuration
  const navItems = [
    { 
      label: 'Features', 
      to: '/features',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Overview', to: '/features' },
        { label: 'Components', to: '/features/components' },
        { label: 'Templates', to: '/features/templates' }
      ]
    },
    { 
      label: 'Pricing', 
      to: '/pricing' 
    },
    { 
      label: 'Resources', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Documentation', to: '/docs' },
        { label: 'Blog', to: '/blog' },
        { label: 'Community', href: 'https://community.example.com', external: true }
      ]
    },
    { 
      label: 'About', 
      to: '/about' 
    }
  ];
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);
  
  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-indigo-600" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">FB-Utilities</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <NavButton
                key={index}
                to={item.to}
                href={item.href}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
                isActive={location.pathname === item.to}
              >
                {item.label}
              </NavButton>
            ))}
            
            {/* CTA Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              <Button variant="outline" size="sm">Log In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {/* Hamburger or X icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform ease-in-out duration-300 pt-16 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pb-12 px-4">
          <nav className="flex flex-col space-y-1 mt-6">
            {navItems.map((item, index) => (
              <div key={index} className="py-2 border-b border-gray-200">
                {/* Main nav item */}
                <Link 
                  to={item.to || '#'} 
                  className="block px-3 py-2 text-lg font-medium text-gray-800 hover:text-indigo-600"
                >
                  {item.label}
                </Link>
                
                {/* Dropdown items if any */}
                {item.hasDropdown && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                      <Link 
                        key={dropdownIndex}
                        to={dropdownItem.to || dropdownItem.href || '#'} 
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                        target={dropdownItem.external ? "_blank" : undefined}
                        rel={dropdownItem.external ? "noopener noreferrer" : undefined}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Mobile CTA buttons */}
          <div className="mt-8 space-y-3">
            <Button variant="outline" fullWidth>Log In</Button>
            <Button fullWidth>Get Started</Button>
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;