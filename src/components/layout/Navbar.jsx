import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-white text-lg">FBUtilities</span>
              </Link>
            </div>

            {/* Primary Nav - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="py-4 px-3 text-white hover:text-gray-300 transition duration-300">Home</Link>
              <Link to="/about" className="py-4 px-3 text-white hover:text-gray-300 transition duration-300">About</Link>
              <Link to="/contact" className="py-4 px-3 text-white hover:text-gray-300 transition duration-300">Contact</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="outline-none mobile-menu-button"
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen 
                  ? <path d="M6 18L18 6M6 6l12 12" />
                  : <path d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block py-2 px-4 text-white hover:bg-gray-700 rounded">Home</Link>
          <Link to="/about" className="block py-2 px-4 text-white hover:bg-gray-700 rounded">About</Link>
          <Link to="/contact" className="block py-2 px-4 text-white hover:bg-gray-700 rounded">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;