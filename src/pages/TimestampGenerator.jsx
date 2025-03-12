import React, { useState, useEffect } from 'react';
import { FaClock, FaInfoCircle, FaCode, FaHistory, FaCopy, FaSyncAlt } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const TimestampGenerator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState(new Date());
  const [timestamp, setTimestamp] = useState(Math.floor(date.getTime() / 1000));
  const [copied, setCopied] = useState(null);
  const [platformTab, setPlatformTab] = useState('discord');
  const [timestampHistory, setTimestampHistory] = useState([]);

  // Discord timestamp format types
  const discordFormats = [
    { code: 't', description: 'Short Time', example: '1:23 PM' },
    { code: 'T', description: 'Long Time', example: '1:23:45 PM' },
    { code: 'd', description: 'Short Date', example: '03/12/2025' },
    { code: 'D', description: 'Long Date', example: 'March 12, 2025' },
    { code: 'f', description: 'Short Date/Time', example: 'March 12, 2025 1:23 PM' },
    { code: 'F', description: 'Long Date/Time', example: 'Wednesday, March 12, 2025 1:23 PM' },
    { code: 'R', description: 'Relative Time', example: 'Just now' },
  ];

  // Unix formats for other platforms
  const unixFormats = [
    { label: 'Unix (seconds)', value: timestamp, description: 'Standard Unix timestamp in seconds' },
    { label: 'Unix (milliseconds)', value: timestamp * 1000, description: 'Unix timestamp in milliseconds' },
    { label: 'ISO 8601', value: date.toISOString(), description: 'ISO 8601 format' },
    { label: 'RFC 2822', value: date.toUTCString(), description: 'RFC 2822 format' },
  ];

  // Update timestamp when date changes
  useEffect(() => {
    setTimestamp(Math.floor(date.getTime() / 1000));
  }, [date]);

  // Handle date input change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      setDate(newDate);
      addToHistory(newDate, 'Date changed');
    }
  };

  // Handle time input change
  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setDate(newDate);
    addToHistory(newDate, 'Time changed');
  };

  // Reset to current time
  const resetToNow = () => {
    const now = new Date();
    setDate(now);
    addToHistory(now, 'Reset to now');
  };



  // Copy to clipboard function
  const copyToClipboard = (text, label) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(label);
          setTimeout(() => setCopied(null), 2000);
  
          // Add to history when copying
          const historyEntry = {
            id: uuidv4(),
            format: label,
            copiedValue: text,
            timestamp: new Date().toLocaleTimeString(),
          };
  
          setTimestampHistory((prevHistory) => {
            // Keep only the latest 10 entries
            const updatedHistory = [historyEntry, ...prevHistory];
            return updatedHistory.slice(0, 10);
          });
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
          // Fallback method for browsers that don't support clipboard API
          fallbackCopyToClipboard(text, label);
        });
    } else {
      // Fallback for browsers without clipboard API support
      fallbackCopyToClipboard(text, label);
    }
  };

  // Fallback copy method using textarea
  const fallbackCopyToClipboard = (text, label) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
        
        // Add to history when copying
        const historyEntry = {
          id: uuidv4(),
          format: label,
          copiedValue: text,
          timestamp: new Date().toLocaleTimeString(),
        };
  
        setTimestampHistory((prevHistory) => {
          // Keep only the latest 10 entries
          const updatedHistory = [historyEntry, ...prevHistory];
          return updatedHistory.slice(0, 10);
        });
      }
    } catch (err) {
      console.error("Fallback: Failed to copy", err);
    }
  
    document.body.removeChild(textArea);
  };

  // Add to timestamp history
  const addToHistory = (dateValue, action) => {
    const historyEntry = {
      id: uuidv4(),
      dateTime: dateValue.toLocaleString(),
      unixTimestamp: Math.floor(dateValue.getTime() / 1000),
      action,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTimestampHistory(prevHistory => {
      // Keep only the latest 10 entries
      const updatedHistory = [historyEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Format date for HTML date input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time for HTML time input
  const formatTimeForInput = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Handle clear button
  const handleClear = () => {
    resetToNow();
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
              Timestamp Generator Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Generate platform-specific timestamps with real-time conversion
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Timestamp Generator Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaClock className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Timestamp Utility
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Date and Time Input */}
                        <div className="mb-4">
                          <label 
                            htmlFor="datePicker" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Date
                          </label>
                          <input
                            id="datePicker"
                            type="date"
                            value={formatDateForInput(date)}
                            onChange={handleDateChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                          />
                        </div>

                        <div className="mb-4">
                          <label 
                            htmlFor="timePicker" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Time
                          </label>
                          <input
                            id="timePicker"
                            type="time"
                            value={formatTimeForInput(date)}
                            onChange={handleTimeChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                          />
                        </div>

                        <div className="mb-4">
                          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="text-indigo-700 dark:text-indigo-300 font-medium">Unix Timestamp</div>
                              <div className="font-mono text-gray-700 dark:text-gray-300">{timestamp}</div>
                            </div>
                          </div>
                        </div>

                        {/* Platform Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                          <nav className="flex">
                            <button
                              onClick={() => setPlatformTab('discord')}
                              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                platformTab === 'discord'
                                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                            >
                              Discord
                            </button>
                            <button
                              onClick={() => setPlatformTab('other')}
                              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                platformTab === 'other'
                                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                            >
                              Other Platforms
                            </button>
                          </nav>
                        </div>

                        {/* Discord Formats */}
                        {platformTab === 'discord' && (
                          <div className="space-y-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Discord uses <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">{'<t:timestamp:format>'}</code> syntax
                            </div>
                            {discordFormats.map((format) => {
                              const discordCode = `<t:${timestamp}:${format.code}>`;
                              return (
                                <div key={format.code} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                  <div>
                                    <div className="flex items-center">
                                      <code className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mr-2">
                                        {discordCode}
                                      </code>
                                      <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded">
                                        {format.description}
                                      </span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Example: {format.example}</div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(discordCode, `Discord ${format.description}`)}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                  >
                                    {copied === `Discord ${format.description}` ? (
                                      <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                                    ) : (
                                      <FaCopy size={16} />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Other Platform Formats */}
                        {platformTab === 'other' && (
                          <div className="space-y-3">
                            {unixFormats.map((format) => (
                              <div key={format.label} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-sm mr-2">{format.label}</span>
                                    <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded">
                                      {format.description}
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <code className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
                                      {String(format.value)}
                                    </code>
                                  </div>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(String(format.value), format.label)}
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  {copied === format.label ? (
                                    <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                                  ) : (
                                    <FaCopy size={16} />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={resetToNow}
                            className="w-1/2 py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center"
                          >
                            <FaSyncAlt className="mr-1" size={14} /> Now
                          </button>
                          <button
                            onClick={handleClear}
                            className="w-1/2 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Copy History */}
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                          <FaHistory className="mr-2 text-indigo-600 dark:text-indigo-400" size={16} />
                          Timestamp History
                        </h3>
                        <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {timestampHistory.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                <tr>
                                  <th className="py-2 px-4 text-left">Time</th>
                                  <th className="py-2 px-4 text-left">Action</th>
                                  <th className="py-2 px-4 text-left">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {timestampHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                                      {entry.action || (entry.format ? `Copied ${entry.format}` : '')}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300 font-mono text-xs truncate max-w-xs">
                                      {entry.dateTime || entry.copiedValue || ''}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No timestamp history yet
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Timestamp Generator</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Timestamp Generator is a versatile utility that allows you to create timestamps in 
                                various formats for different platforms. It's particularly useful for Discord users 
                                who want to display dynamic, user-local timestamps in their messages, as well as 
                                developers who need Unix timestamps for their applications.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you're planning events across time zones, scheduling messages, or developing 
                                applications that require precise time references, this tool provides instant and 
                                accurate timestamp conversions with a convenient history log to track your recent 
                                operations.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Support for Discord's timestamp format system</li>
                                  <li>Multiple timestamp formats for different platforms</li>
                                  <li>One-click copy to clipboard functionality</li>
                                  <li>Timestamp history tracking</li>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Generator Features</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Discord Timestamps</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Discord uses a special syntax <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{'<t:timestamp:format>'}</code> 
                                    to display timestamps that automatically adjust to each user's local time zone. 
                                    Seven different format options are available for different display styles.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Unix Timestamps</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Standard Unix timestamps represent the number of seconds that have elapsed since 
                                    January 1, 1970 (UTC). These timestamps are widely used in programming and databases.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">ISO 8601 Format</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    An international standard for representing dates and times, formatted as 
                                    YYYY-MM-DDTHH:MM:SS.sssZ. This format is widely used in APIs and data exchanges.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Esc</span> - Reset to current time
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
              <p>The timestamp generator runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaClock className="inline mr-1" />
                Built with modern web technologies for accurate, platform-specific timestamp generation
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default TimestampGenerator;