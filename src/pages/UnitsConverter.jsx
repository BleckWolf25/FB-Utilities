import React, { useState, useEffect } from 'react';
import { FaRuler, FaInfoCircle, FaCode } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const UnitsConverter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // Add more unit state variables
  const [length, setLength] = useState({
    centimeters: '',
    inches: '',
    feet: '',
    meters: '',
    yards: '',
    millimeters: ''
  });
  const [activeUnit, setActiveUnit] = useState('centimeters');
  const [conversionHistory, setConversionHistory] = useState([]);

  // Constants for conversion
  const CONVERSION_RATIOS = {
    // Base unit is centimeters
    centimeters: 1,
    inches: 0.393701,
    feet: 0.0328084,
    meters: 0.01,
    yards: 0.0109361,
    millimeters: 10
  };

  // Handle unit input change
  const handleUnitChange = (value, unit) => {
    // Create a new length object with all values empty
    const newLength = Object.keys(length).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    
    // Update the changed unit
    newLength[unit] = value;
    setActiveUnit(unit);
    
    if (value === '') {
      setLength(newLength);
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Convert to base unit (centimeters)
      let valueInCm;
      if (unit === 'centimeters') {
        valueInCm = numValue;
      } else if (unit === 'millimeters') {
        valueInCm = numValue / CONVERSION_RATIOS.millimeters;
      } else {
        valueInCm = numValue / CONVERSION_RATIOS[unit];
      }
      
      // Convert base unit to all other units
      Object.keys(length).forEach(targetUnit => {
        if (targetUnit === unit) {
          newLength[targetUnit] = value;
        } else if (targetUnit === 'centimeters') {
          newLength[targetUnit] = valueInCm.toFixed(3);
        } else if (targetUnit === 'millimeters') {
          newLength[targetUnit] = (valueInCm * CONVERSION_RATIOS.millimeters).toFixed(3);
        } else {
          newLength[targetUnit] = (valueInCm * CONVERSION_RATIOS[targetUnit]).toFixed(3);
        }
      });
      
      setLength(newLength);
      
      // Add to history
      addToHistory(valueInCm, unit);
    }
  };

  // Add conversion to history
  const addToHistory = (valueInCm, fromUnit) => {
    const newEntry = {
      id: uuidv4(),
      fromUnit,
      fromValue: length[fromUnit],
      valueInCm: valueInCm.toFixed(3),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversionHistory(prevHistory => {
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Get measurement description based on centimeters
  const getMeasurementDescription = (cm) => {
    const length = parseFloat(cm);
    if (isNaN(length)) return '';
    
    if (length < 1) return 'Very small';
    if (length < 10) return 'Small';
    if (length < 50) return 'Medium';
    if (length < 100) return 'Large';
    return 'Very large';
  };

  // Clear inputs
  const handleClear = () => {
    const emptyLength = Object.keys(length).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setLength(emptyLength);
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

  // Commonly used length presets for quick reference
  const lengthPresets = [
    { name: 'Credit Card', cm: 8.56, inches: 3.37 },
    { name: 'A4 Paper (Height)', cm: 29.7, inches: 11.69 },
    { name: 'iPhone 13', cm: 14.67, inches: 5.78 },
    { name: 'Standard Ruler', cm: 30, inches: 11.81 },
    { name: 'US Letter Paper (Width)', cm: 21.59, inches: 8.5 },
    { name: 'Pencil (New)', cm: 19, inches: 7.5 },
    { name: 'DVD/CD', cm: 12, inches: 4.72 },
    { name: 'Dollar Bill', cm: 15.6, inches: 6.14 },
    { name: 'AA Battery', cm: 5, inches: 1.97},
];

  // Apply a preset measurement
  const applyPreset = (preset) => {
    handleUnitChange(preset.cm.toFixed(3), 'centimeters');
  };

  // Get a human-readable unit label
  const getUnitLabel = (unit) => {
    const labels = {
      centimeters: 'Centimeters (cm)',
      inches: 'Inches (in)',
      feet: 'Feet (ft)',
      meters: 'Meters (m)',
      yards: 'Yards (yd)',
      millimeters: 'Millimeters (mm)'
    };
    return labels[unit] || unit;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Units Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert between multiple length units with visual representation
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Units Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaRuler className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Multi-Unit Length Conversion
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Length visual indicator */}
                        <div className="mb-4">
                          <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden mb-2">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-300" 
                              style={{ 
                                width: length.centimeters ? `${Math.min(Math.max(parseFloat(length.centimeters), 0), 100)}%` : '0%' 
                              }}
                            />
                            {/* Ruler marks */}
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i} 
                                className="absolute top-0 h-2 border-l border-gray-400 dark:border-gray-500"
                                style={{ left: `${(i + 1) * 10}%` }}
                              />
                            ))}
                          </div>
                          <div className="text-center mt-2 text-gray-700 dark:text-gray-300">
                            {length.centimeters && getMeasurementDescription(length.centimeters)}
                          </div>
                        </div>

                        {/* Unit Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {Object.keys(length).map((unit) => (
                            <div key={unit}>
                              <label 
                                htmlFor={unit} 
                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                {getUnitLabel(unit)}
                              </label>
                              <input
                                id={unit}
                                type="number"
                                value={length[unit]}
                                onChange={(e) => handleUnitChange(e.target.value, unit)}
                                className={`w-full p-3 border ${
                                  activeUnit === unit ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 dark:border-gray-600'
                                } rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all`}
                                placeholder={`Enter length in ${unit}`}
                                step="0.001"
                              />
                            </div>
                          ))}
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

                      {/* Common Length Presets */}
                      <div className="mt-6 mb-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Common Length Presets
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {lengthPresets.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => applyPreset(preset)}
                              className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors text-sm text-center"
                            >
                              {preset.name}<br />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {preset.cm} cm / {preset.inches} in
                              </span>
                            </button>
                          ))}
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
                                  <th className="py-2 px-4 text-left">From</th>
                                  <th className="py-2 px-4 text-left">Value (cm)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {conversionHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                                      {entry.fromValue} {entry.fromUnit}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.valueInCm} cm</td>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Length Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Length Converter is a precision utility tool that simplifies the conversion between 
                                multiple units of length including centimeters, inches, feet, meters, yards, and millimeters. 
                                With a visual length indicator and real-time conversion, it helps users quickly understand 
                                different measurement scales.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                This tool is perfect for designers, engineers, DIY creators, and anyone who needs to 
                                convert between various length measurements. The built-in presets for common 
                                objects provide helpful reference points for everyday use.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Multi-unit conversion system (6 different units)</li>
                                  <li>Precise bidirectional conversion (3 decimal places)</li>
                                  <li>Visual length indicator with scale markings</li>
                                  <li>Common object presets for quick reference</li>
                                  <li>Comprehensive conversion history tracking</li>
                                  <li>Responsive design that works on all devices</li>
                                  <li>Dark mode support and keyboard shortcuts</li>
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
                                    <ul className="list-disc pl-5 space-y-1">
                                      <li>1 centimeter = 0.393701 inches</li>
                                      <li>1 centimeter = 0.0328084 feet</li>
                                      <li>1 centimeter = 0.01 meters</li>
                                      <li>1 centimeter = 0.0109361 yards</li>
                                      <li>1 centimeter = 10 millimeters</li>
                                    </ul>
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Visual Ruler</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Dynamically updates to show the relative length with tick marks for reference,
                                    providing intuitive understanding of measurement scale.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Common Presets</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Quick-access buttons for common object dimensions allow for instant reference and practical context.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Multi-Unit System</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Convert between six different length units simultaneously:
                                    <ul className="list-disc pl-5 space-y-1 mt-2">
                                      <li>Metric: millimeters, centimeters, meters</li>
                                      <li>Imperial/US: inches, feet, yards</li>
                                    </ul>
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
              <p>The length converter runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaRuler className="inline mr-1" />
                Built with modern web technologies for precise, reliable length conversions
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default UnitsConverter;