// src/pages/Home.jsx
import React, { useRef } from 'react';
import { 
  AnimatedElement, 
  AnimateInView, 
  StaggerContainer,
  fadeInVariants, 
  scaleInVariants, 
  slideInVariants,
  RevealText,
  ParallaxContainer,
  ScrollProgressBar
} from '../components/animations/FadeIn';
import Button from '../components/common/NavButton';
import Card from '../components/common/Card';
import VideoPlayer from '../components/common/VideoPlayer';
import LegalWarn from '../components/common/LegalWarn';

/**
 * Home component - Main landing page for FB-Utilities
 * 
 * Features a responsive layout with enhanced animated sections that reveal on scroll,
 * showcasing the main features and benefits of the platform.
 */
const Home = () => {
  // References to sections for smooth scrolling
  const featuresRef = useRef(null);
  const whyChooseUsRef = useRef(null);

  /**
   * Data for the "Why choose us" feature cards
   */
  const features = [
    {
      title: "Open-Source", 
      description: "The code is out. The secrets? Yours to see.",
      icon: "📂",
      color: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Ads-free", 
      description: "Your internet freedom: no interruptions, no worries, no strings attached.",
      icon: "🚫",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Secure", 
      description: "Your digital fortress. No trackers, no traps.",
      icon: "🛡️",
      color: "from-purple-500 to-pink-600"
    }
  ];

  /**
   * Data for the popular features section
   */
  const popularFeatures = [
    {
      title: "File Converter",
      description: "Convert between multiple file formats with ease. Support for images, documents, and more.",
      icon: "🔄",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Coding Utilities",
      description: "Powerful yet simple programmer-oriented utilities making code easier.",
      icon: "⌨️",
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Password Generator",
      description: "Create strong, secure passwords. Customize length and complexity to match your needs.",
      icon: "🔑",
      color: "from-emerald-500 to-green-500"
    },
  ];

  /**
   * Handles smooth scrolling to the specified ref when buttons are clicked
   * @param {React.RefObject} ref - Reference to the target element
   */
  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container-fluid mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-500 overflow-x-hidden">      
      
      {/* Scroll Progress bar */}
      <ScrollProgressBar height={3} color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Legal Warn Toast - No cookie dependencies, always shows */}
      <LegalWarn />
      
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTQgMCA3LjczMi02LjI2OCAxNC0xNCAxNHYyYzkuOTQgMCAxOC04LjA2IDE4LTE4eiIgZmlsbD0icmdiYSgxMDAsMTAwLDEwMCwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>
          
          {/* Accent color blocks with enhanced slide animations */}
          <AnimatedElement 
            variants={slideInVariants} 
            customAnimation={{ 
              direction: 'left', 
              distance: 50,
              duration: 0.8
            }}
            className="absolute -left-10 top-10 w-6 h-32 bg-indigo-600 dark:bg-indigo-500 rounded-r-lg"
          />
          
          <div className="pt-20 md:pt-28 pb-16 relative z-10">
            {/* Hero section with enhanced staggered animations */}
            <StaggerContainer staggerDelay={0.1} delayChildren={0.2}>
              <AnimatedElement variants={fadeInVariants} className="mb-2">
                <RevealText 
                  text="FB-Utilities" 
                  byWord={false}
                  staggerDelay={0.03}
                  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white"
                />
              </AnimatedElement>
              
              <AnimatedElement 
                variants={fadeInVariants} 
                className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6"
              >
                Powerful tools in a single website
              </AnimatedElement>
              
              <AnimatedElement 
                variants={fadeInVariants} 
                className="text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300 mb-8"
              >
                Simplify your workflow with our robust suite of utilities designed for maximum productivity and efficiency. Our platform adapts to your needs, for personal or enterprise level.
              </AnimatedElement>
              
              {/* CTA buttons with enhanced animation */}
              <AnimatedElement 
                variants={scaleInVariants} 
                customAnimation={{ 
                  duration: 0.7,
                  initialScale: 0.9
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => scrollToRef(featuresRef)}
                  aria-label="View popular features"
                >
                  Popular features
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToRef(whyChooseUsRef)}
                  aria-label="Learn why to choose us"
                >
                  Why Choose us?
                </Button>
              </AnimatedElement>
            </StaggerContainer>
          </div>
        </div>
        
        {/* Video Section with enhanced scroll reveal */}
        <div className="mt-32 mb-24">
          <AnimateInView 
            variants={fadeInVariants}
            threshold={0.2}
            customAnimation={{ y: 30 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See it in Action
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Watch how FB-Utilities transforms your digital experience with powerful tools and intuitive design.
            </p>
          </AnimateInView>
          
          <div className="max-w-4xl mx-auto">
            <AnimateInView 
              variants={scaleInVariants}
              threshold={0.1}
              customAnimation={{ 
                initialScale: 0.92,
                duration: 0.8
              }}
            >
              <VideoPlayer 
                src="https://firebasestorage.googleapis.com/v0/b/gitconnected.appspot.com/o/demo-video.mp4?alt=media"
                poster="/path/to/poster-image.jpg"
                autoPlay={false}
                controls={true}
                className="w-full aspect-video shadow-xl rounded-lg"
              />
            </AnimateInView>
          </div>
        </div>
        
        {/* Why choose FB-Utilities section with enhanced scroll-triggered animations */}
        <ParallaxContainer speed={-0.2} className="mt-24 mb-16" ref={whyChooseUsRef} id="why-choose-us">
          <AnimateInView 
            variants={fadeInVariants}
            threshold={0.2}
            customAnimation={{ y: 20 }}
            className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white"
          >
            <h2 style={{ zIndex: 10 }} className="relative">Why choose FB-Utilities</h2>
          </AnimateInView>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimateInView
                key={feature.title}
                variants={slideInVariants}
                threshold={0.1}
                customAnimation={{ 
                  direction: index === 0 ? 'left' : index === 1 ? 'up' : 'right',
                  delay: index * 0.1,
                  distance: 30,
                  duration: 0.7
                }}
                className="h-full"
              >
                <Card 
                  title={feature.title}
                  className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${feature.color}`}>
                      <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                  </div>
                </Card>
              </AnimateInView>
            ))}
          </div>
        </ParallaxContainer>
        
        {/* Popular Features section with enhanced scroll reveal animations */}
        <div className="mt-32 mb-24" ref={featuresRef} id="popular-features">
          <AnimateInView 
            variants={fadeInVariants}
            threshold={0.2}
            customAnimation={{ y: 25 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Popular Features
            </h2>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-4">
              Discover the tools that our users love the most
            </p>
          </AnimateInView>
          
          <StaggerContainer staggerDelay={0.1} delayChildren={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularFeatures.map((feature, _index) => (
                <AnimatedElement
                  key={feature.title}
                  variants={scaleInVariants}
                  customAnimation={{ 
                    initialScale: 0.95,
                    duration: 0.6
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full">
                    <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-gradient-to-r ${feature.color}`}>
                      <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </StaggerContainer>
        </div>
        
        {/* Call to action section with enhanced animations */}
        <AnimateInView 
          variants={slideInVariants}
          threshold={0.2}
          customAnimation={{ 
            direction: 'left',
            distance: 50,
            duration: 0.8
          }}
          className="my-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to boost your workflow?</h2>
              <p className="text-indigo-100">Join thousands of users who trust FB-Utilities for their daily tasks.</p>
            </div>
            <AnimatedElement
              variants={scaleInVariants}
              customAnimation={{ 
                initialScale: 0.95,
                delay: 0.3,
                duration: 0.5
              }}
            >
            </AnimatedElement>
          </div>
        </AnimateInView>
      </div>
    </div>
  );
};

export default Home;