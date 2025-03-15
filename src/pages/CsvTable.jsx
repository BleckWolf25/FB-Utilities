import React, { useState, useEffect, useRef } from 'react';
import { FaTable, FaInfoCircle, FaCode, FaFileUpload, FaDownload, FaTrash } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

/**
 * CSV to Table Converter Utility Component
 * 
 * A modern React component that allows users to convert CSV data to formatted tables.
 * Features include:
 * - CSV text input or file upload
 * - Customizable delimiter options
 * - Header row detection
 * - Table preview with pagination
 * - Export functionality
 * - Conversion history tracking
 */
const CSVConverter = () => {
  // State for active tab in documentation section
  const [activeTab, setActiveTab] = useState('overview');
  
  // CSV data and formatting states
  const [csvText, setCsvText] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // File input reference
  const fileInputRef = useRef(null);

  // History of conversions
  const [conversionHistory, setConversionHistory] = useState([]);

  // Calculated pagination values
  const totalPages = Math.ceil(parsedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = parsedData.slice(startIndex, endIndex);

  /**
   * Parse CSV text to data array using specified delimiter
   */
  const parseCSV = (text, delim, hasHeaderRow) => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Split by newlines and filter out empty lines
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        setError('No data found in CSV');
        setIsProcessing(false);
        return;
      }
      
      // Parse rows by splitting on delimiter
      const rows = lines.map(line => {
        // Handle quoted values that may contain delimiters
        const result = [];
        let inQuote = false;
        let currentValue = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuote = !inQuote;
          } else if (char === delim && !inQuote) {
            result.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        result.push(currentValue);
        return result;
      });
      
      // Extract headers if hasHeaderRow is true
      let dataHeaders = [];
      let dataRows = [];
      
      if (hasHeaderRow && rows.length > 0) {
        dataHeaders = rows[0].map(header => header.replace(/^"|"$/g, ''));
        dataRows = rows.slice(1);
      } else {
        // Generate numeric headers if no header row
        dataHeaders = rows[0].map((_, index) => `Column ${index + 1}`);
        dataRows = rows;
      }
      
      setHeaders(dataHeaders);
      setParsedData(dataRows);
      setCurrentPage(1);
      
      // Add to history if we have actual data
      if (dataRows.length > 0) {
        addToHistory(text, delim, hasHeaderRow, dataHeaders, dataRows);
      }
      
    } catch (err) {
      console.error('Error parsing CSV:', err);
      setError('Error parsing CSV data. Please check the format and try again.');
    }
    
    setIsProcessing(false);
  };

  /**
   * Handle CSV text input change
   */
  const handleCSVChange = (value) => {
    setCsvText(value);
  };

  /**
   * Process CSV data when user submits
   */
  const handleProcessCSV = () => {
    if (!csvText.trim()) {
      setError('Please enter CSV data');
      return;
    }
    
    parseCSV(csvText, delimiter, hasHeaders);
  };

  /**
   * Handle file upload for CSV files
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verify file type (either .csv or text file)
    if (!file.name.endsWith('.csv') && !file.type.includes('text')) {
      setError('Please upload a CSV file or text file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvText(text);
      parseCSV(text, delimiter, hasHeaders);
    };
    
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  /**
   * Clear all inputs and parsed data
   */
  const handleClear = () => {
    setCsvText('');
    setParsedData([]);
    setHeaders([]);
    setError('');
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Add conversion to history
   */
  const addToHistory = (text, delim, hasHeader, headersArr, dataRows) => {
    const newEntry = {
      id: uuidv4(),
      timestamp: new Date().toLocaleTimeString(),
      rowCount: dataRows.length,
      columnCount: headersArr.length,
      delimiter: delim,
      hasHeaders: hasHeader,
      // Store a preview of the CSV (first 50 chars)
      preview: text.length > 50 ? `${text.substring(0, 50)}...` : text,
    };
    
    setConversionHistory(prevHistory => {
      // Keep only the latest 10 conversions
      const updatedHistory = [newEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
  };

  /**
   * Export table as CSV
   */
  const exportAsCSV = () => {
    if (parsedData.length === 0) return;
    
    let csvContent = '';
    
    // Add headers if they exist
    if (headers.length > 0) {
      csvContent += headers.map(header => `"${header}"`).join(delimiter) + '\n';
    }
    
    // Add data rows
    parsedData.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(delimiter) + '\n';
    });
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `table-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Export table as HTML
   */
  const exportAsHTML = () => {
    if (parsedData.length === 0) return;
    
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Table</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  </style>
</head>
<body>
  <h2>Exported Table</h2>
  <table>
    <thead>
      <tr>
        ${headers.map(header => `<th>${header}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${parsedData.map(row => `
        <tr>
          ${row.map(cell => `<td>${cell}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `;
    
    // Create downloadable link
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `table-export-${new Date().toISOString().slice(0, 10)}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to clear
      if (e.key === 'Escape') {
        handleClear();
      }
      // Ctrl+Enter to process CSV
      else if (e.key === 'Enter' && e.ctrlKey) {
        handleProcessCSV();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [csvText, delimiter, hasHeaders]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              CSV to Table Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert CSV data into nicely formatted tables with customizable options
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* CSV Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaTable className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            CSV Converter
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* CSV Input Options */}
                        <div className="mb-4">
                          <label 
                            htmlFor="csv-input" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Enter CSV Data or Upload a File
                          </label>
                          <textarea
                            id="csv-input"
                            value={csvText}
                            onChange={(e) => handleCSVChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all h-40"
                            placeholder="Paste your CSV data here..."
                          />
                        </div>

                        {/* File Upload */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => fileInputRef.current && fileInputRef.current.click()}
                              className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                            >
                              <FaFileUpload className="mr-2" /> Upload CSV File
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              accept=".csv,text/csv,text/plain"
                              className="hidden"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Supported file format: .csv
                          </p>
                        </div>

                        {/* Configuration Options */}
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label 
                              htmlFor="delimiter" 
                              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Delimiter
                            </label>
                            <select
                              id="delimiter"
                              value={delimiter}
                              onChange={(e) => setDelimiter(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                            >
                              <option value=",">Comma [,]</option>
                              <option value=";">Semicolon [;]</option>
                              <option value="\t">Tab</option>
                              <option value="|">Pipe [|]</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                          <input
                              id="has-headers"
                              type="checkbox"
                              checked={hasHeaders}
                              onChange={(e) => setHasHeaders(e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="has-headers"
                              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                              First row is header
                            </label>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleProcessCSV}
                            disabled={isProcessing || !csvText.trim()}
                            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
                              isProcessing || !csvText.trim()
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isProcessing ? 'Processing...' : 'Convert to Table'}
                          </button>
                          <button
                            onClick={handleClear}
                            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <FaTrash className="inline mr-1" /> Clear
                          </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                            {error}
                          </div>
                        )}
                      </div>

                      {/* Table Preview */}
                      {parsedData.length > 0 && (
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white">
                              Table Preview
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={exportAsCSV}
                                className="py-1 px-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded flex items-center"
                              >
                                <FaDownload className="mr-1" /> CSV
                              </button>
                              <button
                                onClick={exportAsHTML}
                                className="py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center"
                              >
                                <FaDownload className="mr-1" /> HTML
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  {headers.map((header, index) => (
                                    <th 
                                      key={index} 
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentData.map((row, rowIndex) => (
                                  <tr 
                                    key={rowIndex}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    {row.map((cell, cellIndex) => (
                                      <td 
                                        key={cellIndex} 
                                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {startIndex + 1} to {Math.min(endIndex, parsedData.length)} of {parsedData.length} rows
                              </div>
                              <div className="flex space-x-2">
                                <select
                                  value={rowsPerPage}
                                  onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                  }}
                                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                  <option value={5}>5 per page</option>
                                  <option value={10}>10 per page</option>
                                  <option value={25}>25 per page</option>
                                  <option value={50}>50 per page</option>
                                  <option value={100}>100 per page</option>
                                </select>
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  disabled={currentPage === 1}
                                  className={`px-2 py-1 rounded ${
                                    currentPage === 1
                                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                                  }`}
                                >
                                  Previous
                                </button>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Page {currentPage} of {totalPages}
                                </div>
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  disabled={currentPage === totalPages}
                                  className={`px-2 py-1 rounded ${
                                    currentPage === totalPages
                                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                                  }`}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

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
                                  <th className="py-2 px-4 text-left">Rows</th>
                                  <th className="py-2 px-4 text-left">Columns</th>
                                  <th className="py-2 px-4 text-left">Preview</th>
                                </tr>
                              </thead>
                              <tbody>
                                {conversionHistory.map(entry => (
                                  <tr 
                                    key={entry.id} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.timestamp}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.rowCount}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{entry.columnCount}</td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                                      <div className="truncate max-w-xs">{entry.preview}</div>
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About CSV to Table Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The CSV to Table Converter is a powerful utility that transforms comma-separated value (CSV) 
                                data into well-formatted, readable tables. Perfect for data analysts, spreadsheet users, 
                                and anyone working with structured data.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you're cleaning data exports, preparing reports, or just need to visualize 
                                CSV content quickly, this tool provides an intuitive interface with customizable options 
                                to handle various CSV formats and structures.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Instant CSV parsing with multiple delimiter support</li>
                                  <li>Automatic header detection and customization</li>
                                  <li>Paginated table preview for large datasets</li>
                                  <li>Export functionality to CSV and HTML formats</li>
                                  <li>Conversion history tracking</li>
                                  <li>Responsive design with dark mode support</li>
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
                                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Multiple Import Options</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Paste CSV data directly or upload files from your device. Supports various CSV formats with different delimiters and structures.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Customizable Parsing</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Choose from common delimiters (comma, semicolon, tab, pipe) and specify whether your data includes a header row for proper column labeling.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Paginated Table View</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Navigate large datasets easily with pagination controls. Adjust rows per page for optimal viewing based on your screen size and preferences.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Export Options</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Export your formatted data as CSV for further processing or as HTML for web publishing and sharing. HTML exports include basic styling for immediate use.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Esc</span> - Clear all inputs<br />
                                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Ctrl + Enter</span> - Process CSV data
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
              <p>The CSV converter runs entirely in your browser. Your data never leaves your device.</p>
              <p>
                <FaTable className="inline mr-1" />
                Built with modern web technologies for efficient CSV parsing and display
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default CSVConverter;