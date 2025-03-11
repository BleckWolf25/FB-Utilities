import React, { useState, useEffect } from 'react';
import { FaClock, FaInfoCircle, FaCode, FaHistory } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const TimeZoneConverter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [baseTime, setBaseTime] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [timeEntries, setTimeEntries] = useState({});
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showUTCOffset, setShowUTCOffset] = useState(true);

  // Common timezone options
  const timezones = [
    { id: 'UTC', name: 'UTC', offset: 0 },
    { id: 'EST', name: 'Eastern Time (EST/EDT)', offset: -5 },
    { id: 'CST', name: 'Central Time (CST/CDT)', offset: -6 },
    { id: 'MST', name: 'Mountain Time (MST/MDT)', offset: -7 },
    { id: 'PST', name: 'Pacific Time (PST/PDT)', offset: -8 },
    { id: 'GMT', name: 'Greenwich Mean Time (GMT)', offset: 0 },
    { id: 'BST', name: 'British Summer Time (BST)', offset: 1 },
    { id: 'CET', name: 'Central European Time (CET)', offset: 1 },
    { id: 'IST', name: 'India Standard Time (IST)', offset: 5.5 },
    { id: 'JST', name: 'Japan Standard Time (JST)', offset: 9 },
    { id: 'AEST', name: 'Australian Eastern Standard Time (AEST)', offset: 10 },
    { id: 'NZST', name: 'New Zealand Standard Time (NZST)', offset: 12 },
  ];

  // Popular international cities with timezones
  const popularCities = [
    { name: 'New York', timezone: 'EST' },
    { name: 'London', timezone: 'GMT' },
    { name: 'Paris', timezone: 'CET' },
    { name: 'Tokyo', timezone: 'JST' },
    { name: 'Sydney', timezone: 'AEST' },
    { name: 'Los Angeles', timezone: 'PST' },
    { name: 'Chicago', timezone: 'CST' },
    { name: 'Berlin', timezone: 'CET' },
    { name: 'Mumbai', timezone: 'IST' },
    { name: 'Dubai', timezone: 'GMT+4' },
    { name: 'Singapore', timezone: 'GMT+8' },
    { name: 'Rio de Janeiro', timezone: 'GMT-3' },
  ];

  // Set current date and time on component mount
  useEffect(() => {
    // Initialize with current time in local timezone
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5); // Extract HH:MM
    const dateString = now.toISOString().substring(0, 10); // Extract YYYY-MM-DD
    
    setBaseTime(timeString);
    setBaseDate(dateString);
    
    // Set timezone to user's local timezone if possible
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimezone) {
        // Find closest matching timezone in our list
        const closestMatch = timezones.find(tz => 
          userTimezone.includes(tz.id) || 
          tz.name.includes(userTimezone.split('/')[1] || '')
        );
        if (closestMatch) {
          setSelectedTimezone(closestMatch.id);
        }
      }
    } catch (error) {
      console.error('Error detecting user timezone:', error);
    }
  }, []);

  // Update all timezones whenever base time, date or selected timezone changes
  useEffect(() => {
    if (baseTime && baseDate) {
      convertTime(baseTime, baseDate, selectedTimezone);
    }
  }, [baseTime, baseDate, selectedTimezone]);

  // Convert time to all timezones
  const convertTime = (time, date, fromTimezone) => {
    if (!time || !date) return;

    // Parse input time and date
    const [hours, minutes] = time.split(':').map(Number);
    const [year, month, day] = date.split('-').map(Number);
    
    // Create Date object with the input time and date
    const sourceDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    
    // Adjust for source timezone offset
    const sourceTimezone = timezones.find(tz => tz.id === fromTimezone);
    const sourceOffset = sourceTimezone ? sourceTimezone.offset : 0;
    sourceDate.setTime(sourceDate.getTime() - sourceOffset * 60 * 60 * 1000);
    
    // Calculate time for all timezones
    const newTimeEntries = {};
    timezones.forEach(timezone => {
      // Create a new date by applying the timezone offset
      const targetDate = new Date(sourceDate.getTime());
      targetDate.setTime(targetDate.getTime() + timezone.offset * 60 * 60 * 1000);
      
      // Format the date and time
      const formattedTime = targetDate.toISOString().substring(11, 16);
      const formattedDate = targetDate.toISOString().substring(0, 10);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(targetDate);
      
      newTimeEntries[timezone.id] = {
        time: formattedTime,
        date: formattedDate,
        dayName: dayName,
        offset: showUTCOffset ? `UTC${timezone.offset >= 0 ? '+' : ''}${timezone.offset}` : ''
      };
    });
    
    setTimeEntries(newTimeEntries);
    
    // Add to history
    addToHistory(fromTimezone, time, date);
  };

  // Handle time input change
  const handleTimeChange = (value) => {
    setBaseTime(value);
  };

  // Handle date input change
  const handleDateChange = (value) => {
    setBaseDate(value);
  };

  // Handle timezone selection change
  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
  };

  // Apply a city preset
  const applyCity = (city) => {
    const cityTimezone = city.timezone;
    const matchedTimezone = timezones.find(tz => tz.id === cityTimezone || cityTimezone.includes(tz.id));
    
    if (matchedTimezone) {
      setSelectedTimezone(matchedTimezone.id);
    }
  };

  // Add conversion to history
  const addToHistory = (fromTimezone, time, date) => {
    const tzInfo = timezones.find(tz => tz.id === fromTimezone);
    
    const newEntry = {
      id: uuidv4(),
      fromTimezone,
      timeAndDate: `${time} ${date}`,
      timestamp: new Date().toLocaleTimeString(),
      tzOffset: tzInfo ? tzInfo.offset : 0
    };
    
    setConversionHistory(prevHistory => {
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Clear inputs
  const handleClear = () => {
    // Just reset time but keep the date
    setBaseTime('');
    setTimeEntries({});
  };

  // Set to current time
  const setToCurrentTime = () => {
    const now = new Date();
    const timeString = now.toTimeString().substring(0, 5); // Extract HH:MM
    const dateString = now.toISOString().substring(0, 10); // Extract YYYY-MM-DD
    
    setBaseTime(timeString);
    setBaseDate(dateString);
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
              Time Zone Converter
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert time across multiple global time zones with ease
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Time Zone Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaClock className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Global Time Conversion
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Time zone selector and time input */}
                        <div className="mb-4">
                          <label 
                            htmlFor="timezone-select" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Select Source Time Zone
                          </label>
                          <select
                            id="timezone-select"
                            value={selectedTimezone}
                            onChange={(e) => handleTimezoneChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                          >
                            {timezones.map(timezone => (
                              <option key={timezone.id} value={timezone.id}>
                                {timezone.name} {showUTCOffset ? `(UTC${timezone.offset >= 0 ? '+' : ''}${timezone.offset})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label 
                              htmlFor="time-input" 
                              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Time (24h format)
                            </label>
                            <input
                              id="time-input"
                              type="time"
                              value={baseTime}
                              onChange={(e) => handleTimeChange(e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                            />
                          </div>
                          <div>
                            <label 
                              htmlFor="date-input" 
                              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Date
                            </label>
                            <input
                              id="date-input"
                              type="date"
                              value={baseDate}
                              onChange={(e) => handleDateChange(e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                            />
                          </div>
                        </div>

                        {/* Display current time in selected timezone */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              {selectedTimezone && timeEntries[selectedTimezone] ? timeEntries[selectedTimezone].dayName : ''}
                            </div>
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                              {selectedTimezone && timeEntries[selectedTimezone] ? timeEntries[selectedTimezone].time : '--:--'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedTimezone && timeEntries[selectedTimezone] ? 
                                `${timeEntries[selectedTimezone].date} ${timeEntries[selectedTimezone].offset}` : 
                                ''}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleClear}
                            className="w-1/2 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            Clear
                          </button>
                          <button
                            onClick={setToCurrentTime}
                            className="w-1/2 py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                          >
                            Current Time
                          </button>
                        </div>
                      </div>

                      {/* Time Zone World Clock */}
                      <div className="mt-6 mb-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          World Clock
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.keys(timeEntries).length > 0 ? (
                            timezones.map(timezone => (
                              <div 
                                key={timezone.id}
                                className={`p-2 rounded-lg flex justify-between items-center ${
                                  timezone.id === selectedTimezone ? 
                                    'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' : 
                                    'bg-gray-50 dark:bg-gray-700'
                                }`}
                              >
                                <div>
                                  <span className="font-medium text-gray-800 dark:text-white">
                                    {timezone.name}
                                  </span>
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    {timeEntries[timezone.id]?.offset}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-gray-800 dark:text-white">
                                    {timeEntries[timezone.id]?.time}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {timeEntries[timezone.id]?.dayName}, {timeEntries[timezone.id]?.date}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              Enter a time and date to see conversions
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Common City Presets */}
                      <div className="mt-6 mb-6">
                        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Major Cities
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {popularCities.map((city) => (
                            <button
                              key={city.name}
                              onClick={() => applyCity(city)}
                              className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors text-sm text-center"
                            >
                              {city.name}<br />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {city.timezone}
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
                                  <th className="py-2 px-4 text-left">Source</th>
                                  <th className="py-2 px-4 text-left">Date & Time</th>
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
                                      {entry.fromTimezone} (UTC{entry.tzOffset >= 0 ? '+' : ''}{entry.tzOffset})
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timeAndDate}</td>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Time Zone Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Time Zone Converter is a powerful utility designed to help you quickly convert times across 
                                different global time zones. Whether you're planning international meetings, coordinating with 
                                remote teams, or simply checking what time it is in another part of the world, this tool 
                                provides accurate and easy-to-understand conversions.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                This converter supports all major international time zones and prominently displays both 
                                time and date information to account for day changes across the International Date Line. The 
                                built-in world clock provides a quick reference for global times without requiring additional 
                                conversions.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Support for 12 major international time zones</li>
                                  <li>Real-time time zone conversion with date awareness</li>
                                  <li>Quick city presets for major global cities</li>
                                  <li>Comprehensive world clock display</li>
                                  <li>Conversion history tracking</li>
                                  <li>Day of week indicators to avoid scheduling errors</li>
                                  <li>UTC offset display for technical precision</li>
                                  <li>Responsive design and keyboard shortcuts</li>
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
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Time Zone Fundamentals</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <ul className="list-disc pl-5 space-y-1">
                                      <li>Time zones are expressed as offsets from Coordinated Universal Time (UTC)</li>
                                      <li>Some regions observe Daylight Saving Time (DST), which shifts their offset by 1 hour</li>
                                      <li>The International Date Line affects date calculations across the Pacific Ocean</li>
                                      <li>Some time zones use fractional offsets (e.g., India at UTC+5:30)</li>
                                    </ul>
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">World Clock</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Displays the current time and date across all supported time zones simultaneously,
                                    with the source time zone highlighted for easy reference.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">City Presets</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Quick-access buttons for 12 major international cities that automatically select
                                    the corresponding time zone for faster conversion.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Business Use Cases</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    This converter is especially valuable for:
                                    <ul className="list-disc pl-5 space-y-1 mt-2">
                                      <li>Planning international conference calls and meetings</li>
                                      <li>Coordinating with distributed remote teams</li>
                                      <li>Managing global project deadlines</li>
                                      <li>Setting appropriate service hours for international support</li>
                                      <li>Travel planning across multiple time zones</li>
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
              <p>The time zone converter runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaClock className="inline mr-1" />
                Built with modern web technologies for accurate global time conversions
              </p>
              <div className="mt-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={showUTCOffset}
                    onChange={() => setShowUTCOffset(!showUTCOffset)} 
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-500 dark:text-gray-400">Show UTC offsets</span>
                </label>
              </div>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default TimeZoneConverter;