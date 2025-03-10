// src/pages/Home.jsx
import React from 'react';
import { AnimatedElement, fadeInVariants, scaleInVariants, slideInVariants, AnimateInView } from '../components/animations/FadeIn';
import Button from '../components/common/NavButton';
import Card from '../components/common/Card';

const Home = () => {
  // Features data
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

  return (
    <div className="container-fluid mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTQgMCA3LjczMi02LjI2OCAxNC0xNCAxNHYyYzkuOTQgMCAxOC04LjA2IDE4LTE4eiIgZmlsbD0icmdiYSgxMDAsMTAwLDEwMCwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>
          
          {/* Accent color block with slide animation */}
          <AnimatedElement 
            variants={slideInVariants} 
            direction="left" 
            delay={1}
            className="absolute -left-10 top-10 w-6 h-32 bg-indigo-600 dark:bg-indigo-500 rounded-r-lg"
          />
          
          <div className="pt-20 md:pt-28 pb-16 relative z-10">
            {/* Hero section with staggered animations */}
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={0}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2"
            >
              FB-Utilities
            </AnimatedElement>
            
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={1}
              className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6"
            >
              Powerful tools in a single website
            </AnimatedElement>
            
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={2}
              className="text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300 mb-8"
            >
              Simplify your workflow with our robust suite of utilities designed for maximum productivity and efficiency. Our platform adapts to your needs, for personal or enterprise level.
            </AnimatedElement>
            
            {/* CTA buttons with staggered animation */}
            <AnimatedElement 
              variants={scaleInVariants} 
              delay={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                variant="primary" 
                size="lg"
              >
                Get to know the features
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
              >
                Learn More About Us
              </Button>
            </AnimatedElement>
          </div>
        </div>
        
        {/* Features section with scroll-triggered animations */}
        <div className="mt-24 mb-16">
          <AnimateInView 
            delay={0}
            className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white"
          >
            About FB-Utilities
          </AnimateInView>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimateInView
                key={feature.title}
                delay={index + 1}
              >
                <Card 
                  title={feature.title}
                  className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${feature.color}`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                  </div>
                </Card>
              </AnimateInView>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;