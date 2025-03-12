// src/components/animations/FadeIn.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animation variants for staggered animations
 * These configurations can be applied to different components
 */
export const fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, 
      // Framer Motion's built-in easing functions for smoother animations
      ease: "easeOut",
      delay: custom * 0.07
    }
  })
};

export const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6, 
      // Using spring physics for more natural motion
      type: "spring",
      damping: 15,
      stiffness: 100,
      delay: custom * 0.07 
    }
  })
};

export const slideInVariants = {
  hidden: (direction = 'left') => ({
    opacity: 0,
    x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
    y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0
  }),
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6, 
      // Spring with slight bounce for dynamic feel
      type: "spring",
      damping: 20,
      stiffness: 120,
      delay: custom * 0.07 
    }
  })
};

/**
 * AnimatedElement component
 * A wrapper component that applies animations to its children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {Object} props.variants - Animation variants to use (fadeInVariants, scaleInVariants, or slideInVariants)
 * @param {number} props.delay - Delay index for staggered animations
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.custom - Custom properties for variants
 * @param {'left'|'right'|'up'|'down'} props.direction - Direction for slide animations
 * @param {number} props.duration - Override the animation duration (in seconds)
 * @param {string|Object} props.ease - Override the easing function
 * @param {boolean} props.once - Whether animation should only play once (true) or every time element enters viewport (false)
 */
export const AnimatedElement = ({
  children,
  variants = fadeInVariants,
  delay = 0,
  className = '',
  custom = null,
  direction = 'left',
  duration,
  ease,
  once = true,
  ...props
}) => {
  // Determine initial variant based on direction prop
  const initialVariant = variants === slideInVariants ? variants.hidden(direction) : variants.hidden;

  // Apply custom animation properties if provided
  const customizedVariants = React.useMemo(() => {
    if (!duration && !ease) return variants;
    
    // Create a deep copy of variants to avoid mutating the original
    const customVariants = {
      hidden: { ...initialVariant },
      visible: { ...variants.visible(0) }
    };
    
    // Override transition properties if specified
    if (typeof customVariants.visible.transition === 'object') {
      if (duration) customVariants.visible.transition.duration = duration;
      if (ease) customVariants.visible.transition.ease = ease;
    }
    
    return customVariants;
  }, [variants, initialVariant, duration, ease]);

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={customizedVariants}
      custom={custom !== null ? custom : delay}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimateInView component
 * Animates elements when they enter the viewport
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {Object} props.variants - Animation variants to use
 * @param {number} props.delay - Delay index for staggered animations
 * @param {number} props.threshold - Intersection threshold (0-1) for triggering animation
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.viewportMargin - Margin around viewport for triggering animation (e.g., "-100px")
 * @param {boolean} props.once - Whether animation should only play once (true) or every time element enters viewport (false)
 */
export const AnimateInView = ({
  children,
  variants = fadeInVariants,
  delay = 0,
  threshold = 0.1,
  className = '',
  viewportMargin = "0px 0px -100px 0px",
  once = true,
  ...props
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        amount: threshold,
        margin: viewportMargin
      }}
      variants={variants}
      custom={delay}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer component
 * Container that automatically staggers the animations of its children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.staggerDelay - Delay between each child animation (in seconds)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.staggerChildren - Whether to stagger children animations (true) or animate them all at once (false)
 * @param {number} props.delayChildren - Delay before starting the first child animation (in seconds)
 */
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.07,
  className = '',
  staggerChildren = true,
  delayChildren = 0.1,
  ...props
}) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        // If staggerChildren is false, all children animate at once
        staggerChildren: staggerChildren ? staggerDelay : 0,
        delayChildren
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
};
