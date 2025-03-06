// src/components/common/Button.jsx
import React from 'react';

/**
 * Button Component
 * 
 * A customizable button component with different variants and sizes.
 * Inspired by modern design systems with subtle animations.
 * 
 * Props:
 * - children: Button content
 * - variant: 'primary', 'secondary', 'outline', 'ghost', 'link' (default: 'primary')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - fullWidth: Makes the button take full width (default: false)
 * - disabled: Disables the button (default: false)
 * - onClick: Function to call when button is clicked
 * - className: Additional CSS classes
 * - icon: Optional icon component to display before text
 * - iconPosition: 'left' or 'right' (default: 'left')
 * - type: Button type attribute ('button', 'submit', 'reset')
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) => {
  // Base button classes
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Size specific classes
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-base px-4 py-2 gap-2",
    lg: "text-lg px-6 py-3 gap-2.5"
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: `bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white 
              focus:ring-indigo-500 active:bg-indigo-800 
              shadow-sm hover:shadow transition-colors duration-200`,
              
    secondary: `bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200
                focus:ring-gray-300 active:bg-gray-300 
                shadow-sm hover:shadow transition-colors duration-200`,
                
    outline: `border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 
              focus:ring-indigo-500 active:bg-indigo-100 transition-colors duration-200`,
              
    ghost: `bg-transparent text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 
            focus:ring-indigo-500 active:bg-indigo-100 transition-colors duration-200`,
            
    link: `bg-transparent text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 
           underline-offset-2 hover:underline focus:ring-indigo-500 
           p-0 shadow-none transition-colors duration-200`
  };

  
  // Disabled classes
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";
  
  // Full width class
  const widthClass = fullWidth ? "w-full" : "";
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${disabled ? disabledClasses : ''}
    ${widthClass}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="button-icon">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="button-icon">{icon}</span>
      )}
    </button>
  );
};

export default Button;