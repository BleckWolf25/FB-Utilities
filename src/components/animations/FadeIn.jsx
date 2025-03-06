// src/components/animations/FadeIn.jsx
import React, { useEffect, useRef, useState } from 'react';

/**
 * FadeIn Component
 * 
 * A wrapper component that adds a fade-in animation to its children
 * when they enter the viewport.
 * 
 * Props:
 * - children: React nodes to be rendered with fade-in effect
 * - delay: Delay before animation starts (in ms, default: 0)
 * - duration: Duration of animation (in ms, default: 600)
 * - className: Additional CSS classes
 * - threshold: Intersection observer threshold (0-1, default: 0.1)
 */
const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 600, 
  className = "", 
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Create an Intersection Observer to detect when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element enters viewport, set visibility to true
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to keep observing
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    // Start observing the element
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup function to remove observer when component unmounts
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  // Construct animation styles based on props
  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div 
      ref={elementRef} 
      style={animationStyles} 
      className={className}
    >
      {children}
    </div>
  );
};

export default FadeIn;