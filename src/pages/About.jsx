// src/pages/About.jsx
import React from 'react';
import { 
  AnimatedElement, 
  fadeInVariants, 
  scaleInVariants, 
  slideInVariants,
  StaggerContainer,
  AnimateInView
} from '../components/animations/FadeIn';
import Button from '../components/common/NavButton';
import Card from '../components/common/Card';

const About = () => {
  // Team members data
  const teamMembers = [
    { 
      name: "mmesquita23", 
      role: "Developer & Contributor",
      bio: "Passionate about web-development.",
      avatar: "👨‍💻",
      color: "from-blue-500 to-purple-600"
    },
    { 
      name: "BleckWolf25", 
      role: "Founder & Lead Developer",
      bio: "Passionate about creating new unique projects and future technology.",
      avatar: "👨‍💻",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  // FB-Utilities values data
  const FbValues = [
    {
      title: "Transparency",
      description: "We believe in being open about our code, our processes, and our practices.",
      icon: "🔍"
    },
    {
      title: "User Privacy",
      description: "Your data belongs to you. We don't track, collect, or sell any personal information.",
      icon: "🔒"
    },
    {
      title: "Accessibility",
      description: "Our tools are designed to be usable by everyone, regardless of ability or skill.",
      icon: "♿"
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
              About Us
            </AnimatedElement>
            
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={1}
              className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6"
            >
              The duo behind FB-Utilities
            </AnimatedElement>
            
            <AnimatedElement 
              variants={fadeInVariants} 
              delay={2}
              className="text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300 mb-8"
            >
              Project big mission: creating powerful, open-source utilities that respect your privacy and simplify your digital life. No ads, no tracking, just useful tools.
            </AnimatedElement>
          </div>
        </div>
        
        {/* Our Story section */}
        <div className="mt-16 mb-24">
          <AnimateInView 
            delay={0}
            className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white"
          >
            Our Story
          </AnimateInView>
          
          <div className="grid md:grid-cols-2 gap-8">
            <AnimateInView delay={1}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How We Started</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  FB-Utilities began in February 26 2025 when us (the developers) became frustrated with the lack of ad-free and open-source utility tools available online.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Our commitment to open-source development means that our code is transparent and can be verified by anyone. We believe that powerful tools should be accessible to everyone without compromising on privacy or functionality.
                </p>
              </div>
            </AnimateInView>
            
            <AnimateInView delay={2}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We're on a mission to create a suite of powerful, privacy-respecting utilities that help people work more efficiently and take control of their digital lives.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Unlike many online tools that monetize through ads and data collection, we're committed to a different approach: creating exceptional tools that respect your internet without interruptions and put your needs first.
                </p>
              </div>
            </AnimateInView>
          </div>
        </div>
        
        {/* Team section with scroll-triggered animations */}
        <div className="mt-24 mb-16">
          <AnimateInView 
            delay={0}
            className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white"
          >
            Meet Our Team
          </AnimateInView>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <AnimateInView
                key={member.name}
                delay={index + 1}
              >
                <Card 
                  title={member.name}
                  className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-gradient-to-r ${member.color} mx-auto`}>
                      <span className="text-3xl">{member.avatar}</span>
                    </div>
                    <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2 text-center">{member.role}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center">{member.bio}</p>
                  </div>
                </Card>
              </AnimateInView>
            ))}
          </div>
        </div>
        
        {/* Values section */}
        <div className="mt-24 mb-16">
          <AnimateInView 
            delay={0}
            className="text-2xl font-semibold text-center mb-12 text-gray-900 dark:text-white"
          >
            Our Values
          </AnimateInView>
          
          <div className="grid md:grid-cols-3 gap-8">
            {FbValues.map((value, index) => (
              <AnimateInView
                key={value.title}
                delay={index + 1}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-4xl mb-4 text-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">{value.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-center">{value.description}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
        
        {/* CTA section */}
        <AnimatedElement 
          variants={scaleInVariants} 
          delay={4}
          className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-8 md:p-12 mt-16 mb-8 relative overflow-hidden"
        >
          {/* Decorative dots */}
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
            <div className="absolute w-2 h-2 rounded-full bg-white top-8 right-8"></div>
            <div className="absolute w-2 h-2 rounded-full bg-white top-8 right-16"></div>
            <div className="absolute w-2 h-2 rounded-full bg-white top-16 right-8"></div>
            <div className="absolute w-2 h-2 rounded-full bg-white top-16 right-16"></div>
          </div>
          
          <StaggerContainer className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Want to join our mission?</h3>
            <p className="text-indigo-100 max-w-2xl mb-6">We're always looking for volunteer developers, designers, and contributors who share our vision for ad-free and, open-source tools.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="ghost" 
                size="lg"
                className="bg-opacity-20 bg-white hover:bg-opacity-30 text-white border-white"
                href={'https://github.com/BleckWolf25/FB-Utilities'}
              >
                Contribute on GitHub
              </Button>
            </div>
          </StaggerContainer>
        </AnimatedElement>
      </div>
    </div>
  );
};

export default About;