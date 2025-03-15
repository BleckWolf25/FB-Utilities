import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaCode, FaDownload, FaUpload } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';

const Favicon = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [faviconSizes, setFaviconSizes] = useState([16, 32, 48, 64]);
  const [selectedSizes, setSelectedSizes] = useState([16, 32]);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedFavicons, setGeneratedFavicons] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setErrorMessage('');
    setIsGenerated(false);
    setGeneratedFavicons({});
    
    // Check if file is an image (PNG or JPG)
    if (!file.type.match('image/(jpeg|png|jpg)')) {
      setErrorMessage('Please select a PNG or JPG image file.');
      setSelectedFile(null);
      setPreviewSrc('');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size should be less than 5MB.');
      setSelectedFile(null);
      setPreviewSrc('');
      return;
    }

    // Create and set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Toggle size selection
  const toggleSizeSelection = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Generate favicon from source image
  const generateFavicon = async () => {
    if (!selectedFile || selectedSizes.length === 0) {
      setErrorMessage('Please select an image and at least one favicon size.');
      return;
    }

    setIsConverting(true);
    setErrorMessage('');

    try {
      const generatedIcons = {};
      const img = new Image();
      img.src = previewSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      for (const size of selectedSizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const dataURL = canvas.toDataURL('image/png');
        generatedIcons[size] = dataURL;
      }

      // Add to conversion history
      const newEntry = {
        id: uuidv4(),
        filename: selectedFile.name,
        sizes: [...selectedSizes],
        timestamp: new Date().toLocaleTimeString(),
        fileSize: formatFileSize(selectedFile.size),
        previewUrl: previewSrc
      };
      
      setConversionHistory(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory];
        return updatedHistory.slice(0, 10); // Keep only the latest 10 conversions
      });
      
      setGeneratedFavicons(generatedIcons);
      setIsGenerated(true);
      
    } catch (error) {
        console.error('Error generating favicon:', error);
        setErrorMessage('Failed to generate favicon. Please try a different image.');
      } finally {
        setIsConverting(false);
      }
    };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Download generated favicon
  const downloadFavicon = (size) => {
    if (!generatedFavicons[size]) return;
    
    const link = document.createElement('a');
    link.href = generatedFavicons[size];
    link.download = `favicon-${size}x${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllFavicons = async () => {
    const zip = new JSZip();
    for (const size of selectedSizes) {
      if (generatedFavicons[size]) {
        zip.file(`favicon-${size}x${size}.png`, await (await fetch(generatedFavicons[size])).blob());
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'favicons.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Clear all inputs and reset state
  const handleClear = () => {
    setSelectedFile(null);
    setPreviewSrc('');
    setErrorMessage('');
    setIsGenerated(false);
    setGeneratedFavicons({});
    setSelectedSizes([16, 32]); // Reset to default sizes
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  // Generate HTML code for favicon implementation
  const generateFaviconCode = () => {
    if (!isGenerated) return '';
    
    let code = '<!-- If you want to implement those to your project using html, you can add these lines to your HTML <head> section -->\n';
    selectedSizes.forEach(size => {
      code += `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">\n`;
    });
    
    return code;
  };

  const copyHtmlCode = () => {
    const code = generateFaviconCode();
    
    // Use clipboard API with fallback
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          fallbackCopyTextToClipboard(code);
        });
    } else {
      fallbackCopyTextToClipboard(code);
    }
  };

  // Fallback method for browsers that don't support clipboard API
  const fallbackCopyTextToClipboard = (text) => {
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
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
  
    // Reset states
    setErrorMessage('');
    setIsGenerated(false);
    setGeneratedFavicons({});
    
    // Check if file is an image (PNG or JPG)
    if (!file.type.match('image/(jpeg|png|jpg)')) {
      setErrorMessage('Please select a PNG or JPG image file.');
      setSelectedFile(null);
      setPreviewSrc('');
      return;
    }
  
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size should be less than 5MB.');
      setSelectedFile(null);
      setPreviewSrc('');
      return;
    }
  
    // Create and set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              PNG/JPG to Favicon Converter
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Transform your images into browser-ready favicon files of various sizes
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Favicon Converter Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaImage className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Favicon Generator
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        
                        {/* Image Upload Section */}
                        <div className="mb-4">
                          <label 
                            htmlFor="image-upload" 
                            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Upload PNG or JPG Image
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label 
                              htmlFor="image-upload" 
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                                isDragging 
                                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30' 
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              {previewSrc ? (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                  <img 
                                    src={previewSrc}
                                    alt="Preview" 
                                    className="h-20 w-20 object-contain mb-2"
                                  />
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedFile?.name} ({formatFileSize(selectedFile?.size)})
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FaUpload className={`w-8 h-8 mb-3 ${
                                    isDragging 
                                      ? 'text-indigo-500 dark:text-indigo-400' 
                                      : 'text-gray-400'
                                  } transition-colors`} />
                                  <p className={`mb-2 text-sm ${
                                    isDragging 
                                      ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                                      : 'text-gray-500 dark:text-gray-400'
                                  } transition-colors`}>
                                    {isDragging ? 'Drop file here' : <span><span className="font-semibold">Click to upload</span> or drag and drop</span>}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG or JPG (MAX. 5MB)
                                  </p>
                                </div>
                              )}
                              <input 
                                id="image-upload" 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                          {errorMessage && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {errorMessage}
                            </p>
                          )}
                        </div>

                        {/* Favicon Size Selection */}
                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Favicon Sizes
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {faviconSizes.map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSizeSelection(size)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                  selectedSizes.includes(size)
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                              >
                                {size}x{size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={generateFavicon}
                            disabled={!selectedFile || isConverting}
                            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
                              !selectedFile || isConverting
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {isConverting ? 'Converting...' : 'Generate Favicon'}
                          </button>
                          <button
                            onClick={handleClear}
                            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            Clear
                          </button>
                        </div>

                        {/* Generated Favicons Preview */}
                        {isGenerated && (
                          <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
                            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">
                              Generated Favicons
                            </h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              {selectedSizes.map(size => (
                                <div key={size} className="flex flex-col items-center">
                                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-1">
                                    <img 
                                      src={generatedFavicons[size]} 
                                      alt={`Favicon ${size}x${size}`}
                                      className="h-12 w-12 object-contain"
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {size}x{size}
                                  </span>
                                  <button 
                                    onClick={() => downloadFavicon(size)}
                                    className="text-xs bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-1 px-2 rounded transition-colors"
                                  >
                                    <FaDownload className="inline mr-1" size={10} />
                                    Download
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                                onClick={downloadAllFavicons}
                                className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                              >
                                <FaDownload className="mr-2" />
                                Download All
                              </button>
                            </div>
                            
                            {/* HTML Implementation Code */}
                            <div className="mt-4 bg-gray-800 dark:bg-gray-900 rounded-lg p-3 overflow-auto">
                              <div className="flex justify-between items-center text-white mb-2">
                                <span className="text-xs font-medium">HTML Implementation</span>
                                <button 
                                  onClick={copyHtmlCode}
                                  className={`text-xs py-1 px-2 rounded transition-colors ${
                                    isCopied 
                                      ? 'bg-green-600 hover:bg-green-700' 
                                      : 'bg-gray-700 hover:bg-gray-600'
                                  }`}
                                >
                                  {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-green-400 text-xs whitespace-pre-wrap">
                                {generateFaviconCode()}
                              </pre>
                            </div>
                          </div>
                        )}
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
                                  <th className="py-2 px-4 text-left">File</th>
                                  <th className="py-2 px-4 text-left">Sizes</th>
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
                                      <div className="flex items-center">
                                        <img 
                                          src={entry.previewUrl} 
                                          alt={entry.filename}
                                          className="h-6 w-6 object-cover mr-2 rounded"
                                        />
                                        <span className="truncate max-w-[120px]">{entry.filename}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                                      {entry.sizes.map(size => `${size}×${size}`).join(', ')}
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Favicon Converter</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Favicon Converter is a user-friendly utility that allows you to quickly convert 
                                PNG or JPG images into favicons of various sizes. Favicons are small icons that appear 
                                in browser tabs, bookmarks, and other places to visually identify your website.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                With this tool, you can upload your logo or image and generate properly sized favicon 
                                files in multiple dimensions to ensure your website looks professional across all browsers 
                                and devices. The tool also provides the HTML code needed to implement these favicons on your site.
                              </p><br></br>
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
              <p>The Favicon converter runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaImage className="inline mr-1" />
                Built with modern web technologies for fast, accurate Favicon conversions
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Favicon;