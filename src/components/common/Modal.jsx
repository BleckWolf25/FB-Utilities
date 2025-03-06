// src/components/common/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import FadeIn from '../animations/FadeIn';

/**
 * Modal Component
 * 
 * A customizable modal dialog that appears on top of the main content.
 * Features smooth animations and responsive design.
 * 
 * Props:
 * - isOpen: Controls whether the modal is visible
 * - onClose: Function to call when modal should close
 * - title: Modal title (optional)
 * - children: Modal content
 * - size: 'sm', 'md', 'lg', 'xl', 'full' (default: 'md')
 * - closeOnClickOutside: Whether clicking outside closes the modal (default: true)
 * - showCloseButton: Whether to show the X close button (default: true)
 * - className: Additional CSS classes for the modal
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle clicks outside the modal content
  const handleBackdropClick = (e) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full m-4"
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // Create portal to render modal at the end of the document body
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <FadeIn duration={300}>
        <div 
          ref={modalRef}
          className={`
            ${sizeClasses[size] || sizeClasses.md}
            w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden
            flex flex-col max-h-[90vh] ${className}
            transition-colors duration-200
          `}
        >
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Modal content */}
          <div className="p-6 overflow-y-auto">{children}
            {children} 
          </div>
        </div>
      </FadeIn>
    </div>,
    document.body
  );
};

export default Modal;