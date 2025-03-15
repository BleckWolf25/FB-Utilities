import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaInfoCircle, FaCode, FaHistory, FaSync } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

/**
 * Currency Converter Component
 * Allows users to convert between currencies with real-time rates from FreeCurrencyAPI
 */
const CurrencyConverter = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('');
  const [activeField, setActiveField] = useState('amount');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastApiCallTime, setLastApiCallTime] = useState(0);

  // Currency data with symbols
  const currencySymbols = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    CNY: { name: 'Chinese Yuan', symbol: '¥' },
    INR: { name: 'Indian Rupee', symbol: '₹' },
    BRL: { name: 'Brazilian Real', symbol: 'R$' },
    CHF: { name: 'Swiss Franc', symbol: 'CHF' }
  };

  // State for exchange rates
  const [currencies, setCurrencies] = useState({
    USD: { name: 'US Dollar', symbol: '$', rate: 1 },
    EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
    GBP: { name: 'British Pound', symbol: '£', rate: 0.78 },
    JPY: { name: 'Japanese Yen', symbol: '¥', rate: 150.14 },
    CAD: { name: 'Canadian Dollar', symbol: 'C$', rate: 1.37 },
    AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.52 }
  });

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    const now = Date.now();
    const minTimeBetweenCalls = 5000; // 5 seconds
    
    if (now - lastApiCallTime < minTimeBetweenCalls) {
      setError("Please wait before refreshing rates again");
      return;
    }
    
    setLastApiCallTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      // This key should ideally be handled on a backend server
      // Exposing API keys in frontend code is a security risk
      const apiKey = import.meta.env.VITE_CURRENCY_KEY;
      
      // Use a try-catch block to gracefully handle API failures
      if (!apiKey) {
        throw new Error('API key not found in environment variables');
      }
      
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 403) {
        throw new Error('API access forbidden - your API key may be invalid or expired');
      } else if (response.status === 429) {
        throw new Error('API rate limit exceeded - try again later');
      } else if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        const rates = data.data;
        const updatedCurrencies = {};
        
        // Process each supported currency
        Object.keys(currencySymbols).forEach(code => {
          updatedCurrencies[code] = {
            ...currencySymbols[code],
            rate: code === 'USD' ? 1 : rates[code] || 1
          };
        });
        
        setCurrencies(updatedCurrencies);
        setLastUpdated(new Date().toLocaleString());
        setError(null);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching currency rates:', err);
      
      // Don't show the full error message to users (could contain sensitive info)
      let userErrorMessage = 'Failed to update exchange rates. Using fallback rates.';
      
      // More informative error messages based on error type
      if (err.name === 'AbortError') {
        userErrorMessage = 'Request timed out. Using fallback exchange rates.';
      } else if (err.message.includes('forbidden') || err.message.includes('invalid') || err.message.includes('expired')) {
        userErrorMessage = 'API authentication failed. Using fallback rates.';
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        userErrorMessage = 'Network error. Check your internet connection. Using fallback rates.';
      } else if (err.message.includes('rate limit')) {
        userErrorMessage = 'API rate limit exceeded. Using fallback rates.';
      }
      
      setError(userErrorMessage);
      
      // Use mock data with today's date to simulate an API response
      const mockRates = {
        USD: 1,
        EUR: 0.92 + (Math.random() * 0.02 - 0.01), // Add slight variation
        GBP: 0.78 + (Math.random() * 0.02 - 0.01),
        JPY: 150.14 + (Math.random() * 2 - 1),
        CAD: 1.37 + (Math.random() * 0.02 - 0.01),
        AUD: 1.52 + (Math.random() * 0.02 - 0.01),
        CNY: 7.24 + (Math.random() * 0.05 - 0.025),
        INR: 83.10 + (Math.random() * 0.1 - 0.05),
        BRL: 5.03 + (Math.random() * 0.04 - 0.02),
        CHF: 0.89 + (Math.random() * 0.02 - 0.01)
      };
      
      const updatedCurrencies = {};
      
      // Process each supported currency with mock data
      Object.keys(currencySymbols).forEach(code => {
        updatedCurrencies[code] = {
          ...currencySymbols[code],
          rate: mockRates[code] || 1
        };
      });
      
      setCurrencies(updatedCurrencies);
      setLastUpdated(`${new Date().toLocaleString()} (Fallback Data)`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates();
    
    // Optional: Set up auto-refresh every hour
    const refreshInterval = setInterval(() => {
      fetchExchangeRates();
    }, 3600000); // 1 hour
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Handle amount input change with improved validation
  const handleAmountChange = (value) => {
    // Prevent unreasonably large numbers or non-numeric input
    if (value && (isNaN(Number(value)) || value.length > 15)) {
      return;
    }
    
    setAmount(value);
    setActiveField('amount');
    
    if (value === '') {
      setResult('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      convertCurrency(numValue, fromCurrency, toCurrency);
    }
  };

  // Convert currency based on selected options
  const convertCurrency = (value, from, to) => {
    // Convert to USD first (as our base currency)
    const amountInUSD = from === 'USD' ? value : value / currencies[from].rate;
    
    // Convert from USD to target currency
    const convertedAmount = to === 'USD' ? amountInUSD : amountInUSD * currencies[to].rate;
    
    setResult(convertedAmount.toFixed(2));
    
    // Add to history
    addToHistory(value, convertedAmount, from, to);
  };

  // Add conversion to history
  const addToHistory = (fromValue, toValue, fromCurr, toCurr) => {
    const newEntry = {
      id: uuidv4(),
      fromValue: parseFloat(fromValue).toFixed(2),
      fromCurrency: fromCurr,
      toValue: parseFloat(toValue).toFixed(2),
      toCurrency: toCurr,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversionHistory(prevHistory => {
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  // Handle currency selection changes
  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
    if (amount) {
      convertCurrency(parseFloat(amount), currency, toCurrency);
    }
  };

  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
    if (amount) {
      convertCurrency(parseFloat(amount), fromCurrency, currency);
    }
  };

  // Clear inputs
  const handleClear = () => {
    setAmount('');
    setResult('');
  };

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    if (amount) {
      convertCurrency(parseFloat(amount), toCurrency, fromCurrency);
    }
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

  // Format currency with symbol (with sanitization)
  const formatCurrency = (value, currency) => {
    if (!value) return '';
    const currencyData = currencies[currency] || { symbol: '$' };
    const sanitizedValue = Number(value).toFixed(2);
    return `${currencyData.symbol}${sanitizedValue}`;
  };

  // Get percentage change visualization
  const getConversionRatio = () => {
    if (!fromCurrency || !toCurrency) return '1:1';
    const fromRate = currencies[fromCurrency].rate;
    const toRate = currencies[toCurrency].rate;
    const ratio = toRate / fromRate;
    return `1 ${fromCurrency} = ${ratio.toFixed(4)} ${toCurrency}`;
  };

  // Get color based on exchange rate compared to USD
  const getRateColor = (currency) => {
    if (currency === 'USD') return 'bg-gray-400';
    
    const rate = currencies[currency].rate;
    if (rate < 0.8) return 'bg-green-500';
    if (rate < 1) return 'bg-green-400';
    if (rate > 1 && rate < 10) return 'bg-yellow-400';
    if (rate >= 10 && rate < 100) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Currency Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert between currencies with real-time exchange rates
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Currency Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                              Currency Utility
                            </h2>
                          </div>
                          <div className="flex items-center">
                            {isLoading ? (
                              <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                                Updating rates...
                              </span>
                            ) : (
                              <button 
                                onClick={fetchExchangeRates}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm"
                                title="Refresh exchange rates"
                              >
                                <FaSync className="mr-1" size={12} />
                                Refresh rates
                              </button>
                            )}
                          </div>
                        </div>
                      </AnimatedElement>

                      {error && (
                        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {lastUpdated && (
                        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 text-right">
                          Rates updated: {lastUpdated}
                        </div>
                      )}

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Exchange rate indicator */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {fromCurrency}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {getConversionRatio()}
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {toCurrency}
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
                            <div className={`h-full ${getRateColor(fromCurrency)} transition-all duration-300 w-1/2`} />
                            <div className={`h-full ${getRateColor(toCurrency)} transition-all duration-300 w-1/2`} />
                          </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                          <label 
                            htmlFor="amount" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Amount
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-500">{currencies[fromCurrency].symbol}</span>
                            </div>
                            <input
                              id="amount"
                              type="number"
                              value={amount}
                              onChange={(e) => handleAmountChange(e.target.value)}
                              className={`w-full pl-8 p-3 border ${
                                activeField === 'amount' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 dark:border-gray-600'
                              } rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all`}
                              placeholder="Enter amount"
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        {/* Currency Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label 
                              htmlFor="fromCurrency" 
                              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              From Currency
                            </label>
                            <select
                              id="fromCurrency"
                              value={fromCurrency}
                              onChange={(e) => handleFromCurrencyChange(e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                              disabled={isLoading}
                            >
                              {Object.keys(currencies).map(currency => (
                                <option key={currency} value={currency}>
                                  {currency} - {currencies[currency].name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label 
                              htmlFor="toCurrency" 
                              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              To Currency
                            </label>
                            <select
                              id="toCurrency"
                              value={toCurrency}
                              onChange={(e) => handleToCurrencyChange(e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                              disabled={isLoading}
                            >
                              {Object.keys(currencies).map(currency => (
                                <option key={currency} value={currency}>
                                  {currency} - {currencies[currency].name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Result Display */}
                        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Result:</span>
                              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                {result ? formatCurrency(result, toCurrency) : '-'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {amount && result ? `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(result, toCurrency)}` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleSwap}
                            className="w-1/2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Swap Currencies
                          </button>
                          <button
                            onClick={handleClear}
                            className="w-1/2 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Conversion History */}
                      <div className="mt-6">
                        <div className="flex items-center mb-2">
                          <FaHistory className="text-indigo-600 dark:text-indigo-400 mr-2" size={16} />
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
                                  <th className="py-2 px-4 text-left">From</th>
                                  <th className="py-2 px-4 text-left">To</th>
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
                                      {currencies[entry.fromCurrency].symbol}{entry.fromValue} {entry.fromCurrency}
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                                      {currencies[entry.toCurrency].symbol}{entry.toValue} {entry.toCurrency}
                                    </td>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Currency Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Currency Converter is a robust utility that allows you to quickly convert 
                                between various international currencies with real-time exchange rates from FreeCurrencyAPI. 
                                With a visual indicator showing relative currency strength and comprehensive conversion tracking, 
                                it makes understanding currency exchange intuitive and efficient.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you're planning international travel, making cross-border purchases, or 
                                analyzing financial markets, this tool provides instant and accurate currency conversions 
                                with a convenient history log to track your recent calculations.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Real-time currency conversion with API data</li>
                                  <li>Support for major global currencies</li>
                                  <li>Visual currency strength indicator</li>
                                  <li>Conversion history tracking</li>
                                  <li>Currency swap functionality</li>
                                  <li>Responsive design for all devices</li>
                                  <li>Dark mode support for reduced eye strain</li>
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
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Live Exchange Rates</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Uses FreeCurrencyAPI to fetch up-to-date exchange rates. Rates refresh automatically when you open the app and 
                                    can be manually refreshed at any time.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Supported Currencies</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen), 
                                    CAD (Canadian Dollar), AUD (Australian Dollar), CNY (Chinese Yuan), 
                                    INR (Indian Rupee), BRL (Brazilian Real), CHF (Swiss Franc)
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Exchange Rate Indicator</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Color-coded currency strength indicator provides intuitive understanding of relative 
                                    currency values compared to USD. Green indicates stronger currencies, red indicates weaker ones.
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
              <p>
                <FaMoneyBillWave className="inline mr-1" />
                Built with modern web technologies and FreeCurrencyAPI for real-time exchange rates
              </p>
              <p className="text-xs">
                Exchange rates are updated hourly and provided by FreeCurrencyAPI
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default CurrencyConverter;