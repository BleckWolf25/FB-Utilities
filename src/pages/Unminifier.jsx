import React, { useState, useRef, useEffect } from 'react';
import { 
  FaFileUpload, 
  FaFileDownload, 
  FaExpand, 
  FaCopy, 
  FaFolder,
  FaJava, 
  FaPython, 
  FaPhp, 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaMarkdown, 
  FaCode,
  FaDatabase} from 'react-icons/fa';
import useUnminifier from "../hooks/useUnminifier_hook.js";

// Create custom icon components for formats without standard React icons
const createIcon = (label, bgColor) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1em',
        height: '1em',
        backgroundColor: bgColor,
        color: 'white',
        borderRadius: '0.15em',
        fontSize: '0.9em',
        fontWeight: 'bold',
        lineHeight: 1
      }}
    >
      {label}
    </span>
  );
};

// Create custom icon components
const SiTypescript = () => createIcon('TS', '#3178c6');
const SiCsharp = () => createIcon('C#', '#239120'); 
const SiCplusplus = () => createIcon('++', '#00599c');
const SiRuby = () => createIcon('Rb', '#cc342d');
const SiGo = () => createIcon('Go', '#00add8');
const SiJson = () => createIcon('{}', '#292929');

const Unminifier = () => {
  const [selectedUnminifier, setSelectedUnminifier] = useState('javascript');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
  
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  
  const [, setShowSuccessAnimation] = useState(false);
  const [animateUnminifyButton, setAnimateUnminifyButton] = useState(false);
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  
  const statsRef = useRef(null);
  
  // Use our custom unminifier hook
  const { 
    isProcessing, 
    error: unminifierError, 
    result: unminifierResult, 
    unminifyCode, 
    unminifyBatch 
  } = useUnminifier();
  
  // Update component state when unminifier state changes
  useEffect(() => {
    if (unminifierError) {
      setError(unminifierError);
    }
    
    if (unminifierResult) {
      setOutputCode(unminifierResult.formattedCode);
      setStats(unminifierResult.stats);
    }
  }, [unminifierError, unminifierResult]);
  
  useEffect(() => {
    if (stats && statsRef.current) {
      statsRef.current.classList.add('animate-fade-in');
      statsRef.current.classList.add('animate-slide-up');
    }
  }, [stats]);
  
  const unminifierOptions = {
    javascript: {
      title: 'JavaScript Beautifier',
      description: 'Format and beautify minified JavaScript code',
      fileExtensions: ['js', 'jsx', 'mjs', 'min.js'],
      maxSize: 5, // MB
      icon: <FaJs />
    },
    typescript: {
      title: 'TypeScript Beautifier',
      description: 'Format and beautify minified TypeScript code',
      fileExtensions: ['ts', 'tsx', 'min.ts'],
      maxSize: 5,
      icon: <SiTypescript />
    },
    css: {
      title: 'CSS Beautifier',
      description: 'Format and beautify minified CSS code',
      fileExtensions: ['css', 'scss', 'less', 'min.css'],
      maxSize: 5,
      icon: <FaCss3Alt />
    },
    html: {
      title: 'HTML Beautifier',
      description: 'Format and beautify minified HTML code',
      fileExtensions: ['html', 'htm', 'xhtml', 'min.html'],
      maxSize: 10,
      icon: <FaHtml5 />
    },
    json: {
      title: 'JSON Beautifier',
      description: 'Format and beautify minified JSON data',
      fileExtensions: ['json', 'min.json'],
      maxSize: 10,
      icon: <SiJson />
    },
    xml: {
      title: 'XML Beautifier',
      description: 'Format and beautify minified XML data',
      fileExtensions: ['xml', 'svg', 'min.xml'],
      maxSize: 10,
      icon: <FaCode />
    },
    python: {
      title: 'Python Beautifier',
      description: 'Format and beautify minified Python code',
      fileExtensions: ['py', 'pyw'],
      maxSize: 5,
      icon: <FaPython />
    },
    ruby: {
      title: 'Ruby Beautifier',
      description: 'Format and beautify minified Ruby code',
      fileExtensions: ['rb', 'rake'],
      maxSize: 5,
      icon: <SiRuby />
    },
    php: {
      title: 'PHP Beautifier',
      description: 'Format and beautify minified PHP code',
      fileExtensions: ['php', 'phtml', 'php5'],
      maxSize: 5,
      icon: <FaPhp />
    },
    sql: {
      title: 'SQL Beautifier',
      description: 'Format and beautify minified SQL queries',
      fileExtensions: ['sql'],
      maxSize: 10,
      icon: <FaDatabase />
    },
    markdown: {
      title: 'Markdown Formatter',
      description: 'Format and beautify Markdown content',
      fileExtensions: ['md', 'markdown'],
      maxSize: 10,
      icon: <FaMarkdown />
    },
    java: {
      title: 'Java Beautifier',
      description: 'Format and beautify minified Java source code',
      fileExtensions: ['java'],
      maxSize: 10,
      icon: <FaJava />
    },
    csharp: {
      title: 'C# Beautifier',
      description: 'Format and beautify minified C# source code',
      fileExtensions: ['cs'],
      maxSize: 10,
      icon: <SiCsharp />
    },
    cpp: {
      title: 'C++ Beautifier',
      description: 'Format and beautify minified C++ source code',
      fileExtensions: ['cpp', 'cc', 'cxx', 'h', 'hpp'],
      maxSize: 10,
      icon: <SiCplusplus />
    },
    go: {
      title: 'Go Beautifier',
      description: 'Format and beautify minified Go source code',
      fileExtensions: ['go'],
      maxSize: 10,
      icon: <SiGo />
    }
  };
  
  const currentUnminifier = unminifierOptions[selectedUnminifier];
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setError(null);
    setOutputCode('');
    setStats(null);
    setBulkMode(false);
    setBulkFiles([]);
    setBulkResults([]);
    
    if (selectedFile.size > currentUnminifier.maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${currentUnminifier.maxSize}MB.`);
      return;
    }
    
    setFileName(selectedFile.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputCode(event.target.result);
    };
    reader.onerror = () => {
      setError('Error reading the file.');
    };
    reader.readAsText(selectedFile);
  };
  
  const handleBulkFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;
    
    setError(null);
    setOutputCode('');
    setStats(null);
    setInputCode('');
    setFileName('');
    setBulkMode(true);
    
    const validFiles = selectedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      // Also check for .min.* files
      const nameWithoutExt = file.name.toLowerCase();
      return currentUnminifier.fileExtensions.includes(extension) || nameWithoutExt.includes('.min.');
    });
    
    if (validFiles.length === 0) {
      setError(`No valid ${selectedUnminifier} files found. Supported formats: ${currentUnminifier.fileExtensions.join(', ')}`);
      return;
    }
    
    const oversizedFiles = validFiles.filter(file => file.size > currentUnminifier.maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`${oversizedFiles.length} file(s) exceed the size limit of ${currentUnminifier.maxSize}MB and will be skipped.`);
    }
    
    const processableFiles = validFiles.filter(file => file.size <= currentUnminifier.maxSize * 1024 * 1024);
    
    setBulkFiles(processableFiles);
    setCurrentBulkIndex(0);
    
    if (processableFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputCode(event.target.result);
        setFileName(processableFiles[0].name);
      };
      reader.readAsText(processableFiles[0]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropAnimation(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropAnimation(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropAnimation(false);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const hasFolder = Array.from(e.dataTransfer.items).some(item => {
        const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
        return entry && entry.isDirectory;
      });
      
      if (hasFolder) {
        processFolderDrop(e.dataTransfer.items);
        return;
      }
      
      if (e.dataTransfer.files.length > 1) {
        const dataTransfer = new DataTransfer();
        Array.from(e.dataTransfer.files).forEach(file => {
          dataTransfer.items.add(file);
        });
        folderInputRef.current.files = dataTransfer.files;
        handleBulkFileChange({ target: { files: dataTransfer.files } });
        return;
      }
    }
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };
  
  const processFolderDrop = async (items) => {
    setError(null);
    setOutputCode('');
    setStats(null);
    setInputCode('');
    setFileName('');
    setBulkMode(true);
    
    try {
      const files = [];
      
      await Promise.all(Array.from(items).map(item => 
        processEntry(item.webkitGetAsEntry(), files)
      ));
      
      if (files.length === 0) {
        setError(`No valid ${selectedUnminifier} files found in the folder(s).`);
        return;
      }
      
      setBulkFiles(files);
      setCurrentBulkIndex(0);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputCode(event.target.result);
        setFileName(files[0].name);
      };
      reader.readAsText(files[0]);
      
    } catch (error) {
      setError(`Error processing folder: ${error.message}`);
    }
  };
  
  const processEntry = async (entry, fileList) => {
    if (!entry) return;
    
    if (entry.isFile) {
      try {
        const file = await getFileFromEntry(entry);
        const extension = file.name.split('.').pop().toLowerCase();
        const nameWithoutExt = file.name.toLowerCase();
        
        if ((currentUnminifier.fileExtensions.includes(extension) || nameWithoutExt.includes('.min.')) && 
            file.size <= currentUnminifier.maxSize * 1024 * 1024) {
          fileList.push(file);
        }
      } catch (err) {
        console.error(`Error processing file ${entry.fullPath}:`, err);
      }
    } 
    else if (entry.isDirectory) {
      try {
        const dirReader = entry.createReader();
        const readEntries = () => {
          return new Promise((resolve, reject) => {
            dirReader.readEntries(async (entries) => {
              if (entries.length > 0) {
                await Promise.all(entries.map(e => processEntry(e, fileList)));
                resolve(readEntries());
              } else {
                resolve();
              }
            }, reject);
          });
        };
        
        await readEntries();
      } catch (err) {
        console.error(`Error processing directory ${entry.fullPath}:`, err);
      }
    }
  };
  
  const getFileFromEntry = (entry) => {
    return new Promise((resolve) => {
      entry.file(file => {
        resolve(file);
      });
    });
  };
  
  const handleUnminifierChange = (unminifier) => {
    setSelectedUnminifier(unminifier);
    setInputCode('');
    setOutputCode('');
    setFileName('');
    setStats(null);
    setError(null);
    setBulkMode(false);
    setBulkFiles([]);
    setBulkResults([]);
  };
  
  const handleInputChange = (e) => {
    setInputCode(e.target.value);
    setOutputCode('');
    setStats(null);
  };
  
  const handleUnminify = () => {
    if (!inputCode) {
      setError('Please enter or upload code to beautify.');
      return;
    }
    
    setError(null);
    
    setAnimateUnminifyButton(true);
    setTimeout(() => setAnimateUnminifyButton(false), 300);
    
    if (bulkMode) {
      unminifyBatch(bulkFiles, selectedUnminifier);
    } else {
      unminifyCode(inputCode, selectedUnminifier);
    }
  };
  
  const handleCopy = () => {
    if (!outputCode) return;
    
    try {
      navigator.clipboard.writeText(outputCode)
        .then(() => {
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 1500);
          
          const copyBtn = document.getElementById('copy-btn');
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            const originalIcon = copyBtn.innerHTML.includes('<svg') 
              ? copyBtn.innerHTML.substring(0, copyBtn.innerHTML.indexOf('</svg>') + 6) 
              : '';
            
            copyBtn.innerHTML = originalIcon + ' Copied!';
            
            setTimeout(() => {
              if (originalIcon) {
                // Create a new span for text content
                const textSpan = document.createElement('span');
                textSpan.textContent = ' ' + originalText.replace('Copied!', 'Copy to Clipboard');
                
                // Clear current button content
                copyBtn.innerHTML = '';
                
                // Add icon as HTML (assuming it's trusted static content)
                copyBtn.innerHTML = originalIcon;
                
                // Append text content safely
                copyBtn.appendChild(textSpan);
              } else {
                copyBtn.textContent = originalText.replace('Copied!', 'Copy to Clipboard');
              }
            }, 2000);
          }
        })
        .catch(err => {
          setError(`Error copying to clipboard: ${err.message}`);
        });
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = outputCode;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        setError('Failed to copy text. Please select and copy manually.');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleDownload = () => {
    if (bulkMode && bulkResults.length > 0) {
      const currentResult = bulkResults[currentBulkIndex];
      if (currentResult && currentResult.url) {
        const link = document.createElement('a');
        link.href = currentResult.url;
        link.download = currentResult.formattedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (outputCode) {
      const blob = new Blob([outputCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      let outputFileName = fileName;
      if (fileName) {
        // Replace .min if it exists in the filename
        outputFileName = outputFileName.replace('.min.', '.formatted.');
        
        // If no .min was present, add .formatted before the extension
        if (outputFileName === fileName) {
          const lastDotIndex = outputFileName.lastIndexOf('.');
          if (lastDotIndex !== -1) {
            outputFileName = outputFileName.slice(0, lastDotIndex) + '.formatted' + outputFileName.slice(lastDotIndex);
          } else {
            outputFileName += '.formatted';
          }
        }
      } else {
        outputFileName = `formatted-${selectedUnminifier}.${currentUnminifier.fileExtensions[0]}`;
      }
      
      const link = document.createElement('a');
      link.href = url;
      link.download = outputFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
  
  const handleDownloadAll = async () => {
    if (!bulkResults.length) return;
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      bulkResults.forEach(result => {
        if (!result.error) {
          zip.file(result.formattedName, result.content);
        }
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `formatted-${selectedUnminifier}-files.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(`Error creating zip file: ${error.message}`);
      
      bulkResults.forEach(result => {
        if (!result.error && result.url) {
          const link = document.createElement('a');
          link.href = result.url;
          link.download = result.formattedName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }
  };
  
  const switchBulkFile = (index) => {
    if (index >= 0 && index < bulkFiles.length) {
      setCurrentBulkIndex(index);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputCode(event.target.result);
        setFileName(bulkFiles[index].name);
        
        if (bulkResults[index]) {
          setOutputCode(bulkResults[index].content || '');
        } else {
          setOutputCode('');
        }
      };
      reader.readAsText(bulkFiles[index]);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Code Beautifier/Unminifier Utility
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Beautify and format minified code for better readability
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(unminifierOptions).map((unminifier) => (
            <button
              key={unminifier}
              onClick={() => handleUnminifierChange(unminifier)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                selectedUnminifier === unminifier
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{unminifierOptions[unminifier].icon}</span>
              {unminifierOptions[unminifier].title}
            </button>
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {currentUnminifier.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {currentUnminifier.description}
            </p>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-all duration-200 ${
                showDropAnimation 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <FaFileUpload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Upload files, drop a folder, or paste minified code directly
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FaFileUpload className="mr-2" />
                    Select File
                  </button>
                  <button
                    onClick={() => folderInputRef.current.click()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FaFolder className="mr-2" />
                    Select Multiple Files
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.webkitdirectory = true;
                        input.directory = true;
                        input.multiple = true;
                        
                        input.onchange = (e) => {
                          if (e.target.files.length > 0) {
                            handleBulkFileChange(e);
                          }
                        };
                        
                        input.click();
                      } catch (err) {
                        setError("Your browser doesn't support folder selection. Try dragging and dropping a folder instead.");
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FaFolder className="mr-2" />
                    Select Folder
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={`.${currentUnminifier.fileExtensions.join(', .')},*.min.*`}
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleBulkFileChange}
                  multiple
                  accept={`.${currentUnminifier.fileExtensions.join(', .')},*.min.*`}
                />
                {fileName && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected file: {fileName}
                    {bulkMode && ` (${currentBulkIndex + 1}/${bulkFiles.length})`}
                  </p>
                )}
              </div>
              {isProcessing && bulkMode && (
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      Processing folder contents...
                    </span>
                  </div>
                </div>
              )}

              {bulkFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Found {bulkFiles.length} valid {selectedUnminifier} file(s)
                    {bulkResults.length > 0 && ` • ${bulkResults.filter(r => !r.error).length} formatted`}
                  </p>
                </div>
              )}
            </div>
            
            {bulkMode && bulkFiles.length > 1 && (
              <div className="flex justify-between items-center mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg transition-all duration-300 hover:shadow-md">
                <button 
                  onClick={() => switchBulkFile(currentBulkIndex - 1)}
                  disabled={currentBulkIndex === 0}
                  className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  Previous File
                </button>
                <span className="text-gray-700 dark:text-gray-300 transition-all duration-300">
                  {currentBulkIndex + 1} of {bulkFiles.length} files
                </span>
                <button 
                  onClick={() => switchBulkFile(currentBulkIndex + 1)}
                  disabled={currentBulkIndex === bulkFiles.length - 1}
                  className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50 transition-all duration-200 hover:scale-105"
                >
                  Next File
                </button>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Minified Code
                </label>
                <textarea
                  value={inputCode}
                  onChange={handleInputChange}
                  className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm"
                  placeholder={`Paste your minified ${selectedUnminifier} code here...`}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Formatted Output
                </label>
                <textarea
                  value={outputCode}
                  readOnly
                  className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm"
                  placeholder="Beautified code will appear here..."
                ></textarea>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <button
                onClick={handleUnminify}
                disabled={!inputCode || isProcessing}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                  animateUnminifyButton ? 'scale-95' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {bulkMode ? `Formatting ${bulkFiles.length} files...` : 'Beautifying...'}
                  </>
                ) : (
                  <>
                    <FaExpand className={`mr-2 ${animateUnminifyButton ? 'animate-pulse' : ''}`} />
                    {bulkMode ? `Beautify All Files (${bulkFiles.length})` : 'Beautify Code'}
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="text-center text-red-600 dark:text-red-400 mb-6">
                {error}
              </div>
            )}
            
            {stats && (
              <div 
                ref={statsRef}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-4 transition-all duration-500"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {bulkMode ? 'Bulk Beautification Results' : 'Beautification Results'}
                </h3>
                
                {bulkMode && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Successfully beautified {stats.successCount} of {stats.fileCount} files.
                  </p>
                )}
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Size</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{stats.originalSize} KB</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Formatted Size</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{stats.formattedSize} KB</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Difference</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{stats.difference} KB</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{stats.percentage}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleCopy}
                disabled={!outputCode}
                id="copy-btn"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaCopy className="mr-2" />
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputCode && !(bulkMode && bulkResults.length > 0)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaFileDownload className="mr-2" />
                {bulkMode ? 'Download Current File' : 'Download'}
              </button>
              {bulkMode && bulkResults.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaFileDownload className="mr-2" />
                  Download All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          About Code Beautification
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Code beautification is the process of restructuring source code to make it more readable without
            changing its functionality. This includes adding proper indentation, spacing, line breaks, and organizing code blocks.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Beautifying your code improves readability and maintainability, making it easier for developers
            to understand, debug, and collaborate on code projects.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-6 mb-3">
            Benefits of Beautification
          </h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>Improved code readability and understandability</li>
            <li>Easier debugging and troubleshooting</li>
            <li>Better code maintenance and collaboration</li>
            <li>Consistent code styling across projects</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-6 mb-3">
            Supported Languages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(unminifierOptions).map((key) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="flex items-center">
                  <span className="mr-2">{unminifierOptions[key].icon}</span>
                  <span className="font-medium text-gray-800 dark:text-white">{unminifierOptions[key].title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{animationStyles}</style>
    </div>
  );
};

const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-pulse {
  animation: pulse 0.5s ease-in-out infinite;
}
`;

export default Unminifier;