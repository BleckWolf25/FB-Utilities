// src/pages/TermsOfService.jsx
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
 * TermsOfService component - Legal page for FB-Utilities
 * 
 * Features a responsive layout with enhanced animated sections that reveal on scroll,
 * presenting the terms of service in a clear, structured format.
 */
const TermsOfService = () => {
  // Set page title when component mounts
  useEffect(() => {
    document.title = "Terms of Service | FB-Utilities";
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
                  text="Terms-of-Service" 
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
        
        {/* Terms of Service Content */}
        <div className="mt-8 mb-24">
          <ParallaxContainer speed={-0.05} className="space-y-12">
            {/* Section 1: Acceptance of Terms */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing or using this website (the "Service"), you agree to be bound by these Terms of Service ("Terms") and all incorporated policies. If you do not agree to these Terms, please do not use the Service.
              </p>
            </AnimateInView>
            
            {/* Section 2: Description of the Service */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of the Service</h2>
              <p className="text-gray-700 dark:text-gray-300">
                This website is an open-source, advertisement-free, and tracker-free utility platform designed to provide free and open-source solutions for personal and enterprise use. All code and content featured on the site are released under the MIT License. The Service is provided on an "AS IS" basis without warranties of any kind.
              </p>
            </AnimateInView>
            
            {/* Section 3: Open-Source Licensing */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Open-Source Licensing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">MIT License:</span> All project content and code are made available under the <a href="https://opensource.org/licenses/MIT" className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">MIT License</a>. This means you are free to use, modify, and distribute the code as long as you comply with the terms of the MIT License. A copy of the license is included with the project.
                </li>
                <li>
                  <span className="font-medium">Attribution:</span> When using our code, please retain any existing copyright notices and attribute the source as required by the MIT License.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 4: Data Privacy and No Tracking */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Privacy and No Tracking</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">No Data Collection:</span> The Service is designed not to collect any personal or usage data from its users. We do not employ trackers, analytics, or advertisement cookies.
                </li>
                <li>
                  <span className="font-medium">Third-Party Data Concerns:</span> In the unlikely event that any data collection occurs, please note that it is not affiliated with our original website. Such activity might result from unauthorized modifications, third-party scripts, or a technical error. If you notice any deviations from our stated practices, please contact us immediately.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 5: User Responsibilities and Acceptable Use */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. User Responsibilities and Acceptable Use</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">Proper Usage:</span> You agree to use the Service only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use of the Service.
                </li>
                <li>
                  <span className="font-medium">No Malicious Activities:</span> You agree not to engage in activities that compromise the security or integrity of the website or its users.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 6: Disclaimers */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Disclaimers</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">No Warranties:</span> The Service provided is "AS IS," with no warranties—express or implied—including, but not limited to, any warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </li>
                <li>
                  <span className="font-medium">No Guarantee of Continuous Service:</span> We do not guarantee the continuity, timeliness, or accuracy of the Service. Use the website at your own risk.
                </li>
              </ul>
            </AnimateInView>
            
            {/* Section 7: Limitation of Liability */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall the website, its owners, or contributors be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use the Service—even if advised of the possibility of such damages. This includes any issues that may arise from data breaches or third-party activities on the website.
              </p>
            </AnimateInView>
            
            {/* Section 8: Modifications and Termination */}
            <AnimateInView 
              variants={fadeInVariants}
              threshold={0.1}
              customAnimation={{ y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Modifications and Termination</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">Changes to the Terms:</span> We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting. Users are advised to review the Terms periodically.
                </li>
                <li>
                  <span className="font-medium">Termination:</span> We reserve the right to terminate or suspend access to the Service without prior notice if you breach these Terms or for any other reason deemed necessary.
                </li>
              </ul>
            </AnimateInView>
          </ParallaxContainer>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;