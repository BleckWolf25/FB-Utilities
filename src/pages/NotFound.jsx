// src/pages/NotFound.jsx
import React from 'react';
import { AnimatedElement, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import Button from '../components/common/NavButton';

const NotFound = () => {
  return (
    <div className="container-fluid mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full">
        <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTQgMCA3LjczMi02LjI2OCAxNC0xNCAxNHYyYzkuOTQgMCAxOC04LjA2IDE4LTE4eiIgZmlsbD0icmdiYSgxMDAsMTAwLDEwMCwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>
          
          {/* Accent color block animation */}
          <AnimatedElement 
            variants={slideInVariants} 
            direction="right" 
            delay={0.5}
            className="absolute -right-10 top-1/2 w-6 h-32 bg-indigo-600 dark:bg-indigo-500 rounded-l-lg -translate-y-1/2"
          />
          
          <div className="text-center relative z-10 space-y-8">
            {/* 404 Number with staggered animation */}
            <div className="overflow-hidden">
              <AnimatedElement
                variants={slideInVariants}
                direction="left"
                delay={0}
                className="text-9xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                404
              </AnimatedElement>
            </div>
            
            {/* Message section */}
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={0.8}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100">
                Lost in Digital Space?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The page you're looking for has vanished into the digital void. Don't worry - our gravity will pull you back home.
              </p>
            </AnimatedElement>
            
            {/* Return button */}
            <AnimatedElement 
              variants={scaleInVariants} 
              delay={1.2}
            >
              <Button 
                variant="primary" 
                size="lg"
                href="/"
              >
                Beam Me Home
              </Button>
            </AnimatedElement>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;