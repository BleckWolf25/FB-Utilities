import React from 'react';
import { FaCalculator, FaInfoCircle, FaCode, FaGlobe, FaGithub } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';

const Calculator = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Calculator Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              A powerful calculator utility with advanced mathematical functions
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Calculator Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaCalculator className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Calculator Utility
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="relative h-[1000px] w-full flex justify-center overflow-hidden">
                        <iframe 
                          src="https://bleckwolf25.github.io/TheGreatCalculator/index.html" 
                          height="1000" 
                          width="500" 
                          title="The Great Calculator"
                          className="mx-auto bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                          scrolling="no"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentation Column */}
                <div className="lg:w-1/2">
                  <AnimateInView variants={slideInVariants} direction="right">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex">
                          <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                              activeTab === 'overview'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                          >
                            <FaInfoCircle className="inline mr-1" /> Overview
                          </button>
                          <button
                            onClick={() => setActiveTab('features')}
                            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                              activeTab === 'features'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                          >
                            <FaCode className="inline mr-1" /> Features
                          </button>
                        </nav>
                      </div>

                      <div className="p-6">
                        {activeTab === 'overview' && (
                          <StaggerContainer>
                            <AnimatedElement variants={fadeInVariants}>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About The Great Calculator</h3>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Great Calculator is a powerful web-based calculator that provides both basic arithmetic 
                                functions and advanced mathematical operations. Built with modern web technologies, it offers 
                                a responsive interface that works across devices.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you need to perform simple calculations or complex mathematical operations, 
                                this calculator has you covered with its intuitive interface and comprehensive feature set.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Browser-based - no installation required</li>
                                  <li>Mobile-friendly responsive design</li>
                                  <li>Supports both basic and scientific calculations</li>
                                  <li>Memory functions for complex calculations</li>
                                  <li>Dark mode support for reduced eye strain</li>
                                  <li>Supports Keyboard usage for convenience</li>
                                </ul>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}

                        {activeTab === 'features' && (
                          <StaggerContainer>
                            <AnimatedElement variants={fadeInVariants}>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Calculator Features</h3>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Basic Operations</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Addition, subtraction, multiplication, division, percentages, and square roots.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Scientific Functions</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Trigonometric functions (sin, cos, tan), logarithms, exponentials, and constants like π and e.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Memory Functions</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Store and recall values with MC, MR, M+, and M- operations for complex calculations.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">History Log</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    View previous calculations with a scrollable history log for reference and reuse.
                                  </p>
                                </div>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}
                      </div>
                    </div>
                  </AnimateInView>

                  {/* Improved Source code/Live website links */}
                  <AnimatedElement variants={fadeInVariants} delay={2} className="mt-4 text-center">
                    <div className="flex justify-center gap-8">
                      <a 
                        href="https://github.com/bleckwolf25/TheGreatCalculator" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group inline-flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 
                          hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-300"
                      >
                        <FaGithub className="mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                        <span className="font-medium">Source Code</span>
                      </a>
                      <a 
                        href="https://bleckwolf25.github.io/TheGreatCalculator/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group inline-flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 
                          hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-300"
                      >
                        <FaGlobe className="mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                        <span className="font-medium">Live Website</span>
                      </a>
                    </div>
                  </AnimatedElement>
                </div>
              </div>
            </AnimateInView>
          </div>

          {/* Technical specs */}
          <AnimateInView variants={fadeInVariants} className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="space-y-2">
              <p>The calculator runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaCalculator className="inline mr-1" />
                Built with modern web technologies for fast, reliable calculations
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Calculator;