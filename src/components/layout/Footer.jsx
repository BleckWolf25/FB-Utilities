// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Footer Component
 * 
 * A comprehensive footer with multiple sections, responsive design,
 * newsletter signup, and social links.
 */
const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Footer navigation sections
  const footerSections = [
    {
      title: 'Resources',
      links: [
/*      { label: 'Documentation', to: '/docs' },
        { label: 'Tutorials', to: '/tutorials' },
        { label: 'Blog', to: '/blog' },
        { label: 'Community', href: 'https://community.example.com' }, */
      ]
    },
    {
      title: 'FB-Utilities',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
      ]
    },
    {
      title: 'ToS',
      links: [
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
      ]
    },
  ];
  
  // Social media links
  const socialLinks = [
    { 
      name: 'GitHub', 
      href: 'https://github.com/BleckWolf25/FB-Utilities', 
      icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    },
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
            <svg 
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">FB-Utilities</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tools and components to build beautiful interfaces with speed and precision.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-3">
                Stay updated
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <Button variant="outline">Subscribe</Button>
              </div>
            </div>
          </div>
          
          {/* Navigation Sections */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.to ? (
                        <Link 
                          to={link.to} 
                          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a 
                          href={link.href} 
                          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar with Copyright and Social Links */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} FB-Utilities. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;