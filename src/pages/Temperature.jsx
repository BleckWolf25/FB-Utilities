import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaInfoCircle, FaCode } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const Temperature = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [activeUnit, setActiveUnit] = useState('celsius');
  const [conversionHistory, setConversionHistory] = useState([]);

  // Handle Celsius input change
  const handleCelsiusChange = (value) => {
    setCelsius(value);
    setActiveUnit('celsius');
    
    if (value === '') {
      setFahrenheit('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Convert Celsius to Fahrenheit: (C × 9/5) + 32
      const fahrenheitValue = (numValue * 9/5) + 32;
      setFahrenheit(fahrenheitValue.toFixed(2));
      
      // Add to history
      addToHistory(numValue, fahrenheitValue, 'C to F');
    }
  };

  // Handle Fahrenheit input change
  const handleFahrenheitChange = (value) => {
    setFahrenheit(value);
    setActiveUnit('fahrenheit');
    
    if (value === '') {
      setCelsius('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Convert Fahrenheit to Celsius: (F - 32) × 5/9
      const celsiusValue = (numValue - 32) * 5/9;
      setCelsius(celsiusValue.toFixed(2));
      
      // Add to history
      addToHistory(celsiusValue, numValue, 'F to C');
    }
  };

  // Add conversion to history
  const addToHistory = (celsiusValue, fahrenheitValue, direction) => {
    const newEntry = {
      id: uuidv4(),
      celsius: celsiusValue.toFixed(2),
      fahrenheit: fahrenheitValue.toFixed(2),
      direction,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversionHistory(prevHistory => {
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Get temperature description
  const getTemperatureDescription = (celsius) => {
    const temp = parseFloat(celsius);
    if (isNaN(temp)) return '';
    
    if (temp < 0) return 'Freezing';
    if (temp < 10) return 'Very Cold';
    if (temp < 20) return 'Cool';
    if (temp < 30) return 'Warm';
    if (temp < 40) return 'Hot';
    return 'Very Hot';
  };

  // Get color based on temperature
  const getTemperatureColor = (celsius) => {
    const temp = parseFloat(celsius);
    if (isNaN(temp)) return 'bg-gray-200 dark:bg-gray-700';
    
    if (temp < 0) return 'bg-blue-500';
    if (temp < 10) return 'bg-blue-300';
    if (temp < 20) return 'bg-green-300';
    if (temp < 30) return 'bg-yellow-300';
    if (temp < 40) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Clear inputs
  const handleClear = () => {
    setCelsius('');
    setFahrenheit('');
  };

  // Handle key press events for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Temperature Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert between Celsius and Fahrenheit with real-time visualization
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Temperature Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaThermometerHalf className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Temperature Utility
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Temperature visual indicator */}
                        <div className="mb-4">
                          <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getTemperatureColor(celsius)} transition-all duration-300`} 
                              style={{ width: celsius ? `${Math.min(Math.max(parseFloat(celsius) + 30, 0), 100)}%` : '3%' }}
                            />
                          </div>
                          <div className="text-center mt-2 text-gray-700 dark:text-gray-300">
                            {celsius && getTemperatureDescription(celsius)}
                          </div>
                        </div>

                        {/* Celsius Input */}
                        <div className="mb-4">
                          <label 
                            htmlFor="celsius" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Celsius (°C)
                          </label>
                          <input
                            id="celsius"
                            type="number"
                            value={celsius}
                            onChange={(e) => handleCelsiusChange(e.target.value)}
                            className={`w-full p-3 border ${
                              activeUnit === 'celsius' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all`}
                            placeholder="Enter temperature in Celsius"
                          />
                        </div>

                        {/* Fahrenheit Input */}
                        <div className="mb-4">
                          <label 
                            htmlFor="fahrenheit" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Fahrenheit (°F)
                          </label>
                          <input
                            id="fahrenheit"
                            type="number"
                            value={fahrenheit}
                            onChange={(e) => handleFahrenheitChange(e.target.value)}
                            className={`w-full p-3 border ${
                              activeUnit === 'fahrenheit' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all`}
                            placeholder="Enter temperature in Fahrenheit"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleClear}
                            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Conversion History */}
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Conversion History
                        </h3>
                        <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {conversionHistory.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                <tr>
                                  <th className="py-2 px-4 text-left">Time</th>
                                  <th className="py-2 px-4 text-left">Celsius</th>
                                  <th className="py-2 px-4 text-left">Fahrenheit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {conversionHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.celsius}°C</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.fahrenheit}°F</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No conversion history yet
                            </div>
                          )}
                        </div>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Temperature Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Temperature Converter is a user-friendly utility that allows you to quickly convert 
                                temperatures between Celsius and Fahrenheit scales. With a visual temperature indicator 
                                and real-time conversion, it makes understanding temperature scales intuitive and efficient.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you're planning a trip abroad, cooking with international recipes, or studying weather 
                                patterns, this tool provides instant and accurate temperature conversions with a convenient 
                                history log to track your recent calculations.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Real-time bidirectional conversion</li>
                                  <li>Visual temperature indicator with color coding</li>
                                  <li>Conversion history tracking</li>
                                  <li>Responsive design for all devices</li>
                                  <li>Dark mode support for reduced eye strain</li>
                                  <li>Keyboard shortcuts for quick actions</li>
                                </ul>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}

                        {activeTab === 'features' && (
                          <StaggerContainer>
                            <AnimatedElement variants={fadeInVariants}>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Converter Features</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Conversion Formulas</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Celsius to Fahrenheit: (°C × 9/5) + 32<br />
                                    Fahrenheit to Celsius: (°F - 32) × 5/9
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Visual Indicator</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Color-coded temperature gauge provides intuitive understanding of temperature ranges from freezing (blue) to very hot (red).
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Conversion History</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Tracks your recent temperature conversions with timestamps for easy reference and comparison.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Esc</span> - Clear all inputs
                                  </p>
                                </div>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}
                      </div>
                    </div>
                  </AnimateInView>
                </div>
              </div>
            </AnimateInView>
          </div>

          {/* Technical specs */}
          <AnimateInView variants={fadeInVariants} className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="space-y-2">
              <p>The temperature converter runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaThermometerHalf className="inline mr-1" />
                Built with modern web technologies for fast, accurate temperature conversions
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Temperature;