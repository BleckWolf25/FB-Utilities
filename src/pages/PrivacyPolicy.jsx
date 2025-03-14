// src/pages/PrivacyPolicy.jsx
import React, { useEffect } from 'react';
import { 
  AnimatedElement, 
  AnimateInView, 
  StaggerContainer,
  fadeInVariants, 
  slideInVariants,
  RevealText,
  ParallaxContainer,
  ScrollProgressBar
} from '../components/animations/FadeIn';

/**
 * PrivacyPolicy component - Legal page for FB-Utilities
 * 
 * Features a responsive layout with enhanced animated sections that reveal on scroll,
 * presenting the privacy policy in a clear, structured format following the same
 * design patterns as the Terms of Service page.
 */
const PrivacyPolicy = () => {
  // Set page title when component mounts
  useEffect(() => {
    document.title = "Privacy Policy | FB-Utilities";
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Get current date for the effective date
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className="container-fluid mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-500 overflow-x-hidden">      
      
      {/* Scroll Progress bar */}
      <ScrollProgressBar height={3} color="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="max-w-4xl mx-auto">
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
          
          <div className="pt-20 md:pt-28 pb-8 relative z-10">
            {/* Header section with enhanced staggered animations */}
            <StaggerContainer staggerDelay={0.1} delayChildren={0.2}>
              <AnimatedElement variants={fadeInVariants} className="mb-2">
                <RevealText 
                  text="Privacy-Policy" 
                  byWord={false}
                  staggerDelay={0.03}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center"
                />
              </AnimatedElement>
              
              <AnimatedElement 
                variants={fadeInVariants} 
                className="text-lg md:text-xl text-center text-indigo-600 dark:text-indigo-400 mb-8"
              >
                Effective Date: {formattedDate}
              </AnimatedElement>
            </StaggerContainer>
          </div>
        </div>
        
        {/* Privacy Policy Content */}
        <div className="mt-8 mb-24">
          <ParallaxContainer speed={-0.05} className="space-y-12">
            {/* Section 1: Overview */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Overview</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information (if any) we collect, how we use any information that is collected, and the steps we take to ensure your data remains secure. Our website offers free and open-source utility solutions for both enterprise and personal use, and it is designed to be free of trackers, advertisements, and intentional data collection. The entire project is open-source and licensed under the MIT License, ensuring full transparency.
              </p>
            </AnimateInView>
            
            {/* Section 2: Information We Collect */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-4 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">No Intentional Collection:</span> Our website is built to operate without collecting any personal or identifying data from its users. We do not use cookies or any tracking technologies designed for data collection.
                </li>
                <li>
                  <span className="font-medium">Unintentional Data Collection:</span> In the rare event that data is collected unexpectedly—be it through an unauthorized script or a technical anomaly—please note that such collection is not part of our intended design or practices. If you observe behavior that indicates unexpected data collection, contact us immediately.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 3: Cookies and Tracking Technologies */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Cookies and Tracking Technologies</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">No Cookies or Trackers:</span> We do not employ cookies, web beacons, or any other tracking technologies to collect personal information.
                </li>
                <li>
                  <span className="font-medium">Third-Party Scripts:</span> Should any third-party scripts appear on our website without our knowledge, they do not reflect our adherence to privacy. We encourage you to notify us if you suspect any such script, so we can take appropriate action.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 4: Data Usage and Sharing */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Usage and Sharing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">External Links:</span> Our website may include links to external sites. These sites have their own privacy policies, and we are not responsible for their practices. Please review their policies before providing any personal data.
                </li>
              </ul>
            </AnimateInView>
            
            
            {/* Section 5: Your Rights and Choices */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Rights and Choices</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">Access and Correction:</span> As we do not intentionally collect personal information, requests to access data will never be accepted since we don't collect any data.
                </li>
                <li>
                  <span className="font-medium">Opt-Out:</span> Should you encounter any unexpected data collection, you may opt to stop using our services. We welcome your feedback if you believe our website is not operating according to these stated policies.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 6: Updates to This Privacy Policy */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Updates to This Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. All changes will be posted on this page along with a new effective date. We encourage you to review our Privacy Policy periodically to stay informed about our practices.
              </p>
            </AnimateInView>
          </ParallaxContainer>
        </div>
      </div>
    </div>
    );
};

export default PrivacyPolicy;