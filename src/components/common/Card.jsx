// src/components/common/Card.jsx
import React from 'react';
import FadeIn from '../animations/FadeIn';

/**
 * Card Component
 * 
 * A versatile card component with multiple variants and interactive states.
 * Designed to display content in a contained, visually distinct way.
 * 
 * Props:
 * - children: Card content
 * - title: Card title (optional)
 * - subtitle: Card subtitle (optional)
 * - variant: 'default', 'elevated', 'outlined', 'interactive' (default: 'default')
 * - className: Additional CSS classes
 * - onClick: Function to call when card is clicked (makes card interactive)
 * - href: URL to navigate to when card is clicked
 * - image: URL or component for card image/header
 * - imageAlt: Alt text for image
 * - imagePosition: 'top', 'bottom', 'background' (default: 'top')
 * - footer: Footer content (optional)
 * - animate: Whether to animate the card on entry (default: false)
 */
const Card = ({
  children,
  title,
  subtitle,
  variant = 'default',
  className = '',
  onClick,
  href,
  image,
  imageAlt = '',
  imagePosition = 'top',
  footer,
  animate = false,
  ...props
}) => {
  // Base card classes
  const baseClasses = "overflow-hidden rounded-xl";
  
  // Variant specific classes
  const variantClasses = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/50",
    outlined: "bg-transparent border border-gray-300 dark:border-gray-600",
    interactive: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200",
  };
  
  // Interactive props
  const interactiveProps = onClick || href ? {
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick(e);
      }
    },
    className: `${variantClasses.interactive} cursor-pointer`
  } : {
    className: variantClasses[variant] || variantClasses.default
  };

  // Card content
  const CardContent = () => (
    <>
      {/* Image - Top Position */}
      {image && imagePosition === 'top' && (
        <div className="w-full aspect-video overflow-hidden">
          {typeof image === 'string' ? (
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
          ) : (
            image
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className="p-5">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>}
            {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
        )}
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
      
      {/* Image - Bottom Position */}
      {image && imagePosition === 'bottom' && (
        <div className="w-full aspect-video overflow-hidden">
          {typeof image === 'string' ? (
            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
          ) : (
            image
          )}
        </div>
      )}
      
      {/* Image - Background Position */}
      {image && imagePosition === 'background' && (
        <div className="absolute inset-0 -z-10">
          {typeof image === 'string' ? (
            <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-15" />
          ) : (
            React.cloneElement(image, { 
              className: `${image.props.className || ''} w-full h-full object-cover opacity-15` 
            })
          )}
        </div>
      )}
    </>
  );

  // Determine the outer element based on props
  const CardElement = () => {
    // If href is provided, render as link
    if (href) {
      return (
        <a 
          href={href}
          className={`${baseClasses} ${interactiveProps.className} ${className}`}
          {...props}
        >
          <CardContent />
        </a>
      );
    }
    
    // Otherwise render as div
    return (
      <div 
        className={`${baseClasses} ${interactiveProps.className} ${className} ${imagePosition === 'background' ? 'relative' : ''}`}
        {...interactiveProps}
        {...props}
      >
        <CardContent />
      </div>
    );
  };

  // Apply animation if requested
  if (animate) {
    return (
      <FadeIn>
        <CardElement />
      </FadeIn>
    );
  }
  
  return <CardElement />;
};

export default Card;