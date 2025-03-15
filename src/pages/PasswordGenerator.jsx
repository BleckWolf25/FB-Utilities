import React, { useState, useEffect } from 'react';
import { FaKey, FaInfoCircle, FaCode, FaCopy, FaRedo, FaCheck } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const PasswordGenerator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  // Generate password based on criteria
  const generatePassword = () => {
    let charset = '';
    let newPassword = '';
    
    // Define character sets based on selected options
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_-+=<>?/[]{}|';
    
    // Validate that at least one character set is selected
    if (charset === '') {
      alert('Please select at least one character set for your password');
      return;
    }

    // Generate random password
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    // Generate random password
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charset.length;
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
    addToHistory(newPassword);
  };

  // Calculate password strength (0-100)
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    
    // Length factor (up to 30 points)
    strength += Math.min(30, pass.length * 2);
    
    // Character variety factors
    if (/[a-z]/.test(pass)) strength += 10; // lowercase
    if (/[A-Z]/.test(pass)) strength += 15; // uppercase
    if (/[0-9]/.test(pass)) strength += 15; // numbers
    if (/[^A-Za-z0-9]/.test(pass)) strength += 20; // symbols
    
    // Complexity factor - check for character variety
    const uniqueChars = new Set(pass).size;
    strength += Math.min(10, uniqueChars / 2);
    
    setPasswordStrength(Math.min(100, strength));
  };

  // Get strength description
  const getStrengthDescription = (strength) => {
    if (strength < 30) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 70) return 'Moderate';
    if (strength < 90) return 'Strong';
    return 'Very Strong';
  };

  // Get color based on password strength
  const getStrengthColor = (strength) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-400';
    if (strength < 70) return 'bg-yellow-300';
    if (strength < 90) return 'bg-green-300';
    return 'bg-green-500';
  };

  // Add password to history
  const addToHistory = (pass) => {
    const newEntry = {
      id: uuidv4(),
      password: pass,
      length: pass.length,
      strength: passwordStrength,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setPasswordHistory(prevHistory => {
      // Keep only the latest 10 passwords
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Robust copy to clipboard function with fallback
  const copyToClipboard = () => {
    if (!password) return;
    
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(password)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Primary clipboard method failed: ', err);
          fallbackCopyToClipboard(password);
        });
    } else {
      // Fallback for browsers without clipboard API support
      fallbackCopyToClipboard(password);
    }
  };
  
  // Fallback copy method using textarea
  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Fallback copy failed');
      }
    } catch (err) {
      console.error('Fallback copy exception: ', err);
    }
    
    document.body.removeChild(textArea);
  };

  // Generate initial password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Handle key press events for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'c' && document.activeElement.id !== 'password-display') {
        copyToClipboard();
      } else if (e.key === 'F5' && e.preventDefault) {
        e.preventDefault();
        generatePassword();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [password]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Random Password Generator Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Create strong, secure passwords with customizable options
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Password Generator Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaKey className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Password Utility
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Password display and strength indicator */}
                        <div className="mb-4">
                          <label 
                            htmlFor="password-display" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Generated Password
                          </label>
                          <div className="relative">
                            <input
                              id="password-display"
                              type="text"
                              value={password}
                              readOnly
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-20"
                            />
                            <button
                              onClick={copyToClipboard}
                              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                              title="Copy to clipboard"
                              aria-label="Copy password to clipboard"
                            >
                              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                            </button>
                            <button
                              onClick={generatePassword}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                              title="Generate new password"
                              aria-label="Generate new password"
                            >
                              <FaRedo />
                            </button>
                          </div>
                        </div>

                        {/* Strength indicator */}
                        <div className="mb-4">
                          <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`} 
                              style={{ width: `${passwordStrength}%` }}
                              role="progressbar"
                              aria-valuenow={passwordStrength}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                          <div className="text-center mt-2 text-gray-700 dark:text-gray-300">
                            {getStrengthDescription(passwordStrength)}
                          </div>
                        </div>

                        {/* Password length slider */}
                        <div className="mb-4">
                          <label 
                            htmlFor="password-length" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Password Length: {length}
                          </label>
                          <input
                            id="password-length"
                            type="range"
                            min="8"
                            max="32"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>8</span>
                            <span>16</span>
                            <span>24</span>
                            <span>32</span>
                          </div>
                        </div>

                        {/* Password options */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password Options
                          </h3>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={() => setIncludeUppercase(!includeUppercase)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Uppercase (A-Z)</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={() => setIncludeLowercase(!includeLowercase)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Lowercase (a-z)</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={() => setIncludeNumbers(!includeNumbers)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Numbers (0-9)</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={() => setIncludeSymbols(!includeSymbols)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Symbols (!@#$%^&*)</span>
                            </label>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={generatePassword}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                          >
                            Generate Password
                          </button>
                        </div>
                      </div>

                      {/* Password History */}
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Password History
                        </h3>
                        <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {passwordHistory.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                <tr>
                                  <th className="py-2 px-4 text-left">Time</th>
                                  <th className="py-2 px-4 text-left">Password</th>
                                  <th className="py-2 px-4 text-left">Length</th>
                                  <th className="py-2 px-4 text-left">Strength</th>
                                </tr>
                              </thead>
                              <tbody>
                                {passwordHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300 font-mono">
                                      {entry.password.substring(0, 8)}•••
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.length}</td>
                                    <td className="py-2 px-4">
                                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${getStrengthColor(entry.strength)}`} 
                                          style={{ width: `${entry.strength}%` }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No password history yet
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Password Generator</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Random Password Generator is a secure utility designed to create strong, unpredictable 
                                passwords for your online accounts and applications. With customizable options and real-time 
                                strength assessment, it helps you create passwords that are both secure and tailored to specific 
                                requirements.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Using a combination of uppercase letters, lowercase letters, numbers, and special symbols, 
                                this tool generates passwords that are resistant to brute force attacks and dictionary-based 
                                cracking attempts. The visual strength indicator helps you understand how secure your password 
                                is at a glance.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Highly customizable password generation</li>
                                  <li>Visual strength indicator with security assessment</li>
                                  <li>One-click copy to clipboard functionality</li>
                                  <li>Password history tracking</li>
                                  <li>Dark mode support for reduced eye strain</li>
                                  <li>Keyboard shortcuts for common actions</li>
                                </ul>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}

                        {activeTab === 'features' && (
                          <StaggerContainer>
                            <AnimatedElement variants={fadeInVariants}>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Password Features</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Password Strength Factors</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    The strength of a password is determined by:
                                    <br />
                                    - Length (longer is stronger)
                                    <br />
                                    - Character variety (uppercase, lowercase, numbers, symbols)
                                    <br />
                                    - Uniqueness of characters
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Customization Options</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Tailor your password by adjusting the length (8-32 characters) and including or excluding:
                                    <br />
                                    - Uppercase letters (A-Z)
                                    <br />
                                    - Lowercase letters (a-z)
                                    <br />
                                    - Numbers (0-9)
                                    <br />
                                    - Special symbols (!@#$%^&*)
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Security Features</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    All passwords are generated locally in your browser. No data is sent to any server, 
                                    ensuring your passwords remain private and secure.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Ctrl+C</span> - Copy password to clipboard
                                    <br />
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">F5</span> - Generate new password
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
              <p>The password generator runs entirely in your browser. No passwords are stored or transmitted.</p>
              <p>
                <FaKey className="inline mr-1" />
                Built with modern web technologies for secure, reliable password generation
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default PasswordGenerator;