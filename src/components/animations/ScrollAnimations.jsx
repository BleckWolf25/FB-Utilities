// src/components/animations/ScrollAnimations.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

/**
 * ParallaxSection - Creates a section with parallax scrolling effect
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display
 * @param {number} props.strength - Strength of the parallax effect (0-1)
 * @param {string} props.className - Additional CSS classes
 */
export const ParallaxSection = ({ children, strength = 0.2, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, strength * 100]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div 
      ref={ref}
      className={`relative ${className}`}
      style={{ y: springY }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollFadeUp - Fades and moves up an element as it enters the viewport
 * Different from FadeIn as it's specifically triggered by scrolling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.yOffset - Distance to move in pixels
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation
 */
export const ScrollFadeUp = ({ 
  children, 
  className = '', 
  yOffset = 50,
  duration = 0.8,
  threshold = 0.2
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{ 
        duration, 
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother motion
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollReveal - Reveals content with a masking effect on scroll
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {string} props.className - Additional CSS classes
 * @param {'left'|'right'|'top'|'bottom'} props.direction - Direction of reveal
 * @param {number} props.duration - Animation duration in seconds
 */
export const ScrollReveal = ({ 
  children, 
  className = '', 
  direction = 'left',
  duration = 0.8
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Calculate initial and animate values based on direction
  const getVariants = () => {
    switch(direction) {
      case 'left':
        return {
          hidden: { clipPath: 'inset(0 100% 0 0)' },
          visible: { clipPath: 'inset(0 0 0 0)' }
        };
      case 'right':
        return {
          hidden: { clipPath: 'inset(0 0 0 100%)' },
          visible: { clipPath: 'inset(0 0 0 0)' }
        };
      case 'top':
        return {
          hidden: { clipPath: 'inset(100% 0 0 0)' },
          visible: { clipPath: 'inset(0 0 0 0)' }
        };
      case 'bottom':
        return {
          hidden: { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0 0)' }
        };
      default:
        return {
          hidden: { clipPath: 'inset(0 100% 0 0)' },
          visible: { clipPath: 'inset(0 0 0 0)' }
        };
    }
  };
  
  const variants = getVariants();
  
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ 
        duration,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * VideoReveal - Specifically designed for revealing video content with a staggered effect
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Video element to reveal
 * @param {string} props.className - Additional CSS classes
 */
export const VideoReveal = ({ children, className = '' }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const videoVariants = {
    hidden: { 
      scale: 0.95,
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Expo ease out for dramatic effect
      }
    }
  };
  
  const overlayVariants = {
    hidden: { 
      opacity: 0.8,
      scale: 1
    },
    visible: { 
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div 
        variants={videoVariants}
        className="rounded-lg overflow-hidden"
      >
        {children}
      </motion.div>
      <motion.div 
        variants={overlayVariants}
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg pointer-events-none"
      />
    </motion.div>
  );
};

/**
 * ScrollProgressBar - Shows a progress bar at the top of the page that fills as the user scrolls
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 z-50 origin-left"
      style={{ scaleX }}
    />
  );
};