// src/components/animations/FadeIn.jsx
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Animation variants with enhanced customization
 * These configurations can be applied to different components
 */
export const fadeInVariants = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: custom.y ?? 20,
    ...custom
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    ...custom,
    transition: {
      duration: custom.duration ?? 0.5, 
      ease: custom.ease ?? "easeOut",
      delay: custom.delay ?? 0
    }
  })
};

export const scaleInVariants = {
  hidden: (custom = {}) => ({
    opacity: 0,
    scale: custom.initialScale ?? 0.95,
    ...custom
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    ...custom,
    transition: {
      duration: custom.duration ?? 0.6,
      type: custom.type ?? "spring",
      damping: custom.damping ?? 15,
      stiffness: custom.stiffness ?? 100,
      delay: custom.delay ?? 0
    }
  })
};

export const slideInVariants = {
  hidden: (custom = {}) => {
    const direction = custom.direction ?? 'left';
    return {
      opacity: 0,
      x: direction === 'left' ? -(custom.distance ?? 30) : direction === 'right' ? (custom.distance ?? 30) : 0,
      y: direction === 'up' ? (custom.distance ?? 30) : direction === 'down' ? -(custom.distance ?? 30) : 0,
      ...custom
    };
  },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    y: 0,
    ...custom,
    transition: {
      duration: custom.duration ?? 0.6,
      type: custom.type ?? "spring",
      damping: custom.damping ?? 20,
      stiffness: custom.stiffness ?? 120,
      delay: custom.delay ?? 0
    }
  })
};

/**
 * AnimatedElement component
 * A wrapper component that applies animations to its children with enhanced customization
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {Object|Function} props.variants - Animation variants to use
 * @param {number} props.delay - Delay index for staggered animations
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.customAnimation - Custom animation properties to override defaults
 * @param {'left'|'right'|'up'|'down'} props.direction - Direction for slide animations
 * @param {number} props.distance - Distance to travel for slide animations (in pixels)
 * @param {number} props.duration - Override the animation duration (in seconds)
 * @param {string|Object} props.ease - Override the easing function
 * @param {boolean} props.once - Whether animation should only play once
 * @param {string|Object} props.as - Element or component to render instead of div
 */
export const AnimatedElement = ({
  children,
  variants = fadeInVariants,
  delay = 0,
  className = '',
  customAnimation = {},
  direction = 'left',
  distance,
  duration,
  ease,
  once = true,
  as,
  ...props
}) => {
  // Prepare custom animation properties
  const customProps = {
    delay: delay * 0.07,
    direction,
    distance,
    duration,
    ease,
    ...customAnimation
  };

  // Determine which component to render
  const Component = as ? motion[as] || motion(as) : motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      custom={customProps}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * AnimateInView component
 * Animates elements when they enter the viewport with enhanced customization
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {Object|Function} props.variants - Animation variants to use
 * @param {number} props.delay - Delay index for staggered animations
 * @param {number} props.threshold - Intersection threshold (0-1) for triggering animation
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.viewportMargin - Margin around viewport for triggering animation
 * @param {boolean} props.once - Whether animation should only play once
 * @param {Object} props.customAnimation - Custom animation properties to override defaults
 * @param {string|Object} props.as - Element or component to render instead of div
 */
export const AnimateInView = ({
  children,
  variants = fadeInVariants,
  delay = 0,
  threshold = 0.1,
  className = '',
  viewportMargin = "0px 0px -100px 0px",
  once = true,
  customAnimation = {},
  as,
  ...props
}) => {
  // Prepare custom animation properties
  const customProps = {
    delay: delay * 0.07,
    ...customAnimation
  };

  // Determine which component to render
  const Component = as ? motion[as] || motion(as) : motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once, 
        amount: threshold,
        margin: viewportMargin
      }}
      variants={variants}
      custom={customProps}
      {...props}
    >
      {children}
    </Component>
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
 * @param {boolean} props.staggerChildren - Whether to stagger children animations
 * @param {number} props.delayChildren - Delay before starting the first child animation
 * @param {string|Object} props.as - Element or component to render instead of div
 */
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.07,
  className = '',
  staggerChildren = true,
  delayChildren = 0.1,
  as,
  ...props
}) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren ? staggerDelay : 0,
        delayChildren
      }
    }
  };

  // Determine which component to render
  const Component = as ? motion[as] || motion(as) : motion.div;

  return (
    <Component
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * ScrollProgressBar - Shows a progress bar that fills as the user scrolls
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes for styling
 * @param {number} props.height - Height of the progress bar in pixels
 * @param {string} props.color - Color of the progress bar
 * @param {string} props.bgColor - Background color of the progress bar container
 * @param {number} props.stiffness - Spring stiffness for smoother animation
 * @param {number} props.damping - Spring damping for smoother animation
 * @param {string} props.position - Position of the bar (top, bottom)
 */
export const ScrollProgressBar = ({
  className = '',
  height = 4,
  color = 'bg-gradient-to-r from-indigo-500 to-purple-600',
  bgColor = '',
  stiffness = 100,
  damping = 30,
  position = 'top'
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness, damping });
  
  const positionClass = position === 'bottom' ? 'bottom-0' : 'top-0';
  
  return (
    <div className={`fixed ${positionClass} left-0 right-0 ${bgColor} z-50 ${className}`} style={{ height }}>
      <motion.div 
        className={`h-full ${color} origin-left`}
        style={{ scaleX }}
      />
    </div>
  );
};

/**
 * RevealText component
 * Animates text revealing character by character or word by word
 * 
 * @param {Object} props
 * @param {string} props.text - Text to animate
 * @param {boolean} props.byWord - Whether to animate by word instead of by character
 * @param {number} props.staggerDelay - Delay between each character/word
 * @param {number} props.initialDelay - Delay before starting animation
 * @param {string} props.className - Additional CSS classes
 */
export const RevealText = ({
  text,
  byWord = false,
  staggerDelay = 0.025,
  initialDelay = 0,
  className = ''
}) => {
    // If by word, split by spaces, otherwise split by characters
    const elements = byWord ? text.split(' ') : text.split('');

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: initialDelay
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    // If animating by word
    const renderElements = byWord
        ? text.split(/(\s+)/).map((el, i) => {
            // Render spaces as their own elements
            if (el.trim() === "") {
                return <motion.span key={i} className="inline-block" variants={item}>{" "}</motion.span>;
            }
            // Render words with animation
            return <motion.span key={i} className="inline-block" variants={item}>{el}</motion.span>;
        })
        // If animating by character
        : elements.map((el, i) => (
            <motion.span key={i} className="inline-block" variants={item}>
                {el}
            </motion.span>
        ));

    return (
        <motion.span
            className={`inline-block ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {renderElements}
        </motion.span>
    );
};

/**
 * ParallaxContainer component
 * Creates a parallax scrolling effect for its children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {number} props.speed - Speed of parallax effect (negative values move opposite to scroll)
 * @param {string} props.className - Additional CSS classes
 */
export const ParallaxContainer = ({
  children,
  speed = -0.5,
  className = ''
}) => {
  const { scrollYProgress } = useScroll();
  const springValue = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        y: springValue.y * speed * 100
      }}
    >
      {children}
    </motion.div>
  );
};
