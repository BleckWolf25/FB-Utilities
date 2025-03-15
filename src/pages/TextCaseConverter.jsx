import React, { useState, useEffect } from 'react';
import { FaFont, FaInfoCircle, FaCode, FaHistory } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

/**
 * TextCase - A utility for converting text between different cases
 * Supports: Lowercase, Uppercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case
 */
const TextCaseConverter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedCase, setSelectedCase] = useState('uppercase');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');

  // Process text based on the selected case
  const processText = (text, caseType) => {
    if (!text) return '';
    
    switch (caseType) {
      case 'lowercase':
        return text.toLowerCase();
      case 'uppercase':
        return text.toUpperCase();
      case 'titlecase':
        return text
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'sentencecase':
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'camelcase':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      case 'pascalcase':
        return text
          .toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());
      case 'snakecase':
        return text
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
      case 'kebabcase':
        return text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
      default:
        return text;
    }
  };

  // Handle text input change
  const handleTextChange = (value) => {
    setInputText(value);
    const processed = processText(value, selectedCase);
    setOutputText(processed);
    
    // Only add to history if there's actual text
    if (value.trim()) {
      addToHistory(value, processed, selectedCase);
    }
  };

  // Handle case selection change
  const handleCaseChange = (caseType) => {
    setSelectedCase(caseType);
    const processed = processText(inputText, caseType);
    setOutputText(processed);
    
    // Only add to history if there's actual text
    if (inputText.trim()) {
      addToHistory(inputText, processed, caseType);
    }
  };

  // Copy output text to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      })
      .catch(err => {
        setCopyStatus('Failed to copy');
        console.error('Could not copy text: ', err);
      });
  };

  // Add conversion to history
  const addToHistory = (input, output, caseType) => {
    // Don't add if no change or empty text
    if (!input.trim() || input === output) return;
    
    const formattedType = caseType
      .replace('case', ' Case')
      .replace(/^([a-z])/, match => match.toUpperCase());
    
    const newEntry = {
      id: uuidv4(),
      input: input.length > 20 ? input.substring(0, 20) + '...' : input,
      output: output.length > 20 ? output.substring(0, 20) + '...' : output,
      caseType: formattedType,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversionHistory(prevHistory => {
      // Check if this is essentially the same as the last conversion
      if (prevHistory.length > 0 && 
          prevHistory[0].input === newEntry.input && 
          prevHistory[0].caseType === newEntry.caseType) {
        return prevHistory;
      }
      
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Get description for the case type
  const getCaseDescription = (caseType) => {
    switch (caseType) {
      case 'lowercase':
        return 'Converts all characters to lowercase';
      case 'uppercase':
        return 'Converts all characters to uppercase';
      case 'titlecase':
        return 'Capitalizes the first letter of each word';
      case 'sentencecase':
        return 'Capitalizes the first letter of each sentence';
      case 'camelcase':
        return 'Removes spaces and capitalizes all words except the first';
      case 'pascalcase':
        return 'Removes spaces and capitalizes all words including the first';
      case 'snakecase':
        return 'Replaces spaces with underscores and lowercases all';
      case 'kebabcase':
        return 'Replaces spaces with hyphens and lowercases all';
      default:
        return '';
    }
  };

  // Clear inputs
  const handleClear = () => {
    setInputText('');
    setOutputText('');
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
              Text Case Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Change text to uppercase, lowercase, title case, and more
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Text Case Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaFont className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Text Case Utility
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Case selection tabs */}
                        <div className="flex flex-wrap mb-4 bg-white dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
                          {[
                            { id: 'uppercase', label: 'UPPER' },
                            { id: 'lowercase', label: 'lower' },
                            { id: 'titlecase', label: 'Title Case' },
                            { id: 'sentencecase', label: 'Sentence case' },
                            { id: 'camelcase', label: 'camelCase' },
                            { id: 'pascalcase', label: 'PascalCase' },
                            { id: 'snakecase', label: 'snake_case' },
                            { id: 'kebabcase', label: 'kebab-case' }
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleCaseChange(item.id)}
                              className={`px-3 py-2 text-sm whitespace-nowrap rounded-md transition-all duration-200 ${
                                selectedCase === item.id 
                                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium' 
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Case description */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
                          {getCaseDescription(selectedCase)}
                        </div>

                        {/* Input Text Area */}
                        <div className="mb-4">
                          <label 
                            htmlFor="inputText" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Input Text
                          </label>
                          <textarea
                            id="inputText"
                            value={inputText}
                            onChange={(e) => handleTextChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all h-32"
                            placeholder="Type or paste your text here"
                          />
                        </div>

                        {/* Output Text Area */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <label 
                              htmlFor="outputText" 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Result
                            </label>
                            <button
                              onClick={handleCopy}
                              disabled={!outputText}
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                outputText 
                                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {copyStatus || 'Copy'}
                            </button>
                          </div>
                          <textarea
                            id="outputText"
                            value={outputText}
                            readOnly
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none transition-all h-32"
                            placeholder="Converted text will appear here"
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
                        <div className="flex items-center mb-2">
                          <FaHistory className="text-gray-600 dark:text-gray-400 mr-2" size={14} />
                          <h3 className="text-md font-medium text-gray-800 dark:text-white">
                            Conversion History
                          </h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {conversionHistory.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                <tr>
                                  <th className="py-2 px-4 text-left">Time</th>
                                  <th className="py-2 px-4 text-left">Original</th>
                                  <th className="py-2 px-4 text-left">Converted</th>
                                  <th className="py-2 px-4 text-left">Case</th>
                                </tr>
                              </thead>
                              <tbody>
                                {conversionHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.input}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.output}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.caseType}</td>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Text Case Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Text Case Converter is a versatile utility that allows you to quickly transform text 
                                between different case formats. Whether you're preparing code, formatting titles, or 
                                standardizing text, this tool provides instant and accurate case conversions.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                With support for eight different text cases including camelCase, PascalCase, and snake_case, 
                                this utility helps developers, writers, and content creators maintain consistent text formatting 
                                across their projects. The conversion history feature allows you to track and reference your 
                                recent transformations.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Instant conversion between eight text cases</li>
                                  <li>One-click copy functionality for quick workflow</li>
                                  <li>Conversion history tracking</li>
                                  <li>Responsive design for all devices</li>
                                  <li>Dark mode support for reduced eye strain</li>
                                  <li>Keyboard shortcuts for productivity</li>
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
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Supported Text Cases</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-mono">UPPERCASE</span> - All characters in capital letters<br />
                                    <span className="font-mono">lowercase</span> - All characters in small letters<br />
                                    <span className="font-mono">Title Case</span> - First letter of each word capitalized<br />
                                    <span className="font-mono">Sentence case</span> - First letter of each sentence capitalized
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Developer Cases</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-mono">camelCase</span> - No spaces, first word lowercase, others capitalized<br />
                                    <span className="font-mono">PascalCase</span> - No spaces, all words capitalized<br />
                                    <span className="font-mono">snake_case</span> - Words separated by underscores, all lowercase<br />
                                    <span className="font-mono">kebab-case</span> - Words separated by hyphens, all lowercase
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">One-Click Copy</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Quickly copy converted text to clipboard for use in your documents, code, or messages without manual selection.
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
              <p>The text case converter runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaFont className="inline mr-1" />
                Built with modern web technologies for fast, efficient text case conversions
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default TextCaseConverter;