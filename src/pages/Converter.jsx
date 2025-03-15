import React, { useRef, useState, useEffect } from 'react';
import { FaFileUpload, FaFileDownload, FaExchangeAlt, FaCog, FaSearch } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';

// Import custom hooks
import { useFileConverter } from '../hooks/useFileConverter_hook';
import { useConversionWorker } from '../hooks/useConversionWorker';

// Conversion options configuration
const converterOptions = {
  image: {
    title: 'Image Converter',
    description: 'Convert images between JPG, PNG, WEBP, GIF and BMP',
    sourceFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
    targetFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'],
    maxSize: 10, // MB
  },
  audio: {
    title: 'Audio Converter',
    description: 'Convert audio files between MP3, WAV, OGG, AAC and FLAC',
    sourceFormats: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
    targetFormats: ['mp3', 'wav', 'ogg'],
    maxSize: 50, // MB
  },
  document: {
    title: 'Document Converter',
    description: 'Convert documents between PDF, TXT, HTML, and Markdown',
    sourceFormats: ['pdf', 'txt', 'html', 'md'],
    targetFormats: ['pdf', 'txt', 'html', 'md'],
    maxSize: 25, // MB
  },
  video: {
    title: 'Video Converter',
    description: 'Convert short videos between MP4, WebM, and GIF',
    sourceFormats: ['mp4', 'webm', 'gif'],
    targetFormats: ['mp4', 'webm', 'gif'],
    maxSize: 75, // MB
  },
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const Converter = () => {
  const [selectedConverter, setSelectedConverter] = useState('image');
  const [useOcr, setUseOcr] = useState(false);
  const fileInputRef = useRef(null);
  const [workerProgressMessage, setWorkerProgressMessage] = useState('');

  // Hooks
  const {
    file,
    fileName,
    sourceFormat,
    targetFormat,
    isConverting,
    conversionProgress,
    convertedFile,
    error,
    isFFmpegLoading,
    setSourceFormat,
    setTargetFormat,
    handleFileSelect,
    convert,
    resetState,
    setIsConverting,
    setError,
    setConvertedFile
  } = useFileConverter();

  // Use worker for supported conversion types
  const imageWorker = useConversionWorker('image');
  const documentWorker = useConversionWorker('document');

  // Monitor document worker progress messages
  useEffect(() => {
    if (documentWorker.progressMessage && isConverting) {
      setWorkerProgressMessage(documentWorker.progressMessage);
    }
  }, [documentWorker.progressMessage, isConverting]);

  // Get the current converter configuration
  const currentConverter = converterOptions[selectedConverter];

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile, currentConverter);
  };

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  // Handle Converter Change
  const handleConverterChange = (converter) => {
    setSelectedConverter(converter);
    resetState();
  };

  // Handle convert with worker support where available
  const handleConvert = async () => {
    if (!file || !sourceFormat || !targetFormat) {
      setError('Missing required conversion parameters');
      return;
    }
    
    try {
      setIsConverting(true);
      setError(null);
      setWorkerProgressMessage('');
      
      let result = null;
      
      // For supported types, use workers for better performance
      if (selectedConverter === 'image' && 
          !(['gif'].includes(sourceFormat) && ['gif'].includes(targetFormat))) {
        // Check if worker is initialized
        if (!imageWorker.isInitialized) {
          throw new Error('Image worker is not initialized. Please reload the page.');
        }
          
        // Most image conversions can use the worker
        const blob = await imageWorker.processFile(file, sourceFormat, targetFormat);
        const newFileName = fileName.replace(new RegExp(`\\.${sourceFormat}$`), `.${targetFormat}`);
        const mimeType = `image/${targetFormat}`;
        
        result = {
          name: newFileName,
          url: URL.createObjectURL(blob),
          size: blob.size,
          type: mimeType
        };
      }
      else if (selectedConverter === 'document') {
        // Handle all document conversions through workers/main thread
        if ((sourceFormat === 'pdf' && (targetFormat === 'html' || targetFormat === 'md'))) {
          // Check if worker is initialized
          if (!documentWorker.isInitialized) {
            throw new Error('Document worker is not initialized. Please reload the page.');
          }
          
          setWorkerProgressMessage('Preparing document for conversion...');
          
          const blob = await documentWorker.processFile(
            file, 
            sourceFormat, 
            targetFormat, 
            { useOcr } // Pass OCR flag to worker
          );
          
          const newFileName = fileName.replace(`.${sourceFormat}`, `.${targetFormat}`);
          const mimeType = targetFormat === 'md' ? 'text/markdown' : 'text/html';
          
          result = {
            name: newFileName,
            url: URL.createObjectURL(blob),
            size: blob.size,
            type: mimeType
          };
        } else {
          await convert('document');
          return;
        }
      } else {
        // For audio and video, use the main thread converter
        await convert(selectedConverter);
        return;
      }
      
      // Only set convertedFile if we got a result from worker processing
      if (result) {
        setConvertedFile(result);
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  // Handle Download
  const handleDownload = () => {
    if (convertedFile) {
      saveAs(convertedFile.url, convertedFile.name);
    }
  };

  // Add OCR option for documents - improved version
  const renderOcrOption = () => {
    if (selectedConverter === 'document' && sourceFormat === 'pdf') {
      return (
        <div className="ocr-option bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
          <label className="ocr-checkbox flex items-center mb-2">
            <input 
              type="checkbox" 
              checked={useOcr}
              onChange={(e) => setUseOcr(e.target.checked)} 
              className="mr-2 h-4 w-4 text-indigo-600"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Use OCR for text extraction (recommended for scanned documents)
            </span>
          </label>
          {useOcr && (
            <div className="ocr-info bg-blue-100 dark:bg-blue-800/40 p-3 rounded flex items-start mt-2">
              <FaSearch className="text-blue-600 dark:text-blue-400 mt-1 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                OCR will analyze the document's images and automatically extract the text.
                This process may take longer depending on the document's size.
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
             File Converter Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Convert your files to different formats directly with our file converter
            </p>
          </AnimatedElement>

          {/* Converter selection buttons */}
          <AnimatedElement variants={fadeInVariants} delay={2}>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {Object.keys(converterOptions).map((converter) => (
                <button
                  key={converter}
                  onClick={() => handleConverterChange(converter)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedConverter === converter
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {converterOptions[converter].title}
                </button>
              ))}
            </div>
          </AnimatedElement>

          <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <AnimatedElement variants={slideInVariants} direction="left">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {currentConverter.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {currentConverter.description}
                  </p>
                </AnimatedElement>

                {isFFmpegLoading && (selectedConverter === 'audio' || selectedConverter === 'video') && (
                  <div className="text-center mb-6">
                    <p className="text-gray-600 dark:text-gray-400">Loading conversion engine...</p>
                  </div>
                )}

                {/* File drop zone */}
                <AnimatedElement variants={fadeInVariants} delay={3}>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {!file ? (
                      <div>
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Drag and drop your file here, or click to browse
                        </p>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Select File
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept={currentConverter.sourceFormats.map((format) => `.${format}`).join(',')}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          Selected file: <span className="font-semibold">{fileName}</span> ({formatFileSize(file.size)})
                        </p>
                        <button
                          onClick={() => resetState()}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Choose a different file
                        </button>
                      </div>
                    )}
                  </div>
                </AnimatedElement>

                {/* Format selection */}
                {file && (
                  <AnimatedElement variants={slideInVariants} direction="right">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Source Format</label>
                        <select
                          value={sourceFormat}
                          onChange={(e) => setSourceFormat(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                          <option value="">Select source format</option>
                          {currentConverter.sourceFormats.map((format) => (
                            <option key={format} value={format}>
                              {format.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
                        <select
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                          <option value="">Select target format</option>
                          {currentConverter.targetFormats.map((format) => (
                            <option key={format} value={format} disabled={format === sourceFormat}>
                              {format.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </AnimatedElement>
                )}

                {/* OCR option */}
                {renderOcrOption()}

                {/* Error message */}
                {error && (
                  <AnimatedElement variants={fadeInVariants}>
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
                      {error}
                    </div>
                  </AnimatedElement>
                )}

                {/* Convert button */}
                {file && sourceFormat && targetFormat && (
                  <AnimatedElement variants={scaleInVariants}>
                    <div className="flex justify-center mb-6">
                      <button
                        onClick={handleConvert}
                        disabled={isConverting || isFFmpegLoading}
                        className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
                          isConverting || isFFmpegLoading
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white transition-colors`}
                      >
                        <FaExchangeAlt />
                        <span>
                          {isConverting 
                            ? 'Converting...' 
                            : isFFmpegLoading 
                              ? 'Loading Converter...' 
                              : `Convert to ${targetFormat.toUpperCase()}`}
                        </span>
                      </button>
                    </div>
                  </AnimatedElement>
                )}

                {/* Progress bar */}
                {isConverting && (
                  <AnimatedElement variants={fadeInVariants}>
                    <div className="mb-6">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${conversionProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
                        {conversionProgress}% complete
                      </p>
                      {workerProgressMessage && (
                        <p className="text-center mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                          {workerProgressMessage}
                        </p>
                      )}
                    </div>
                  </AnimatedElement>
                )}

                {/* Conversion result */}
                {convertedFile && (
                  <AnimateInView variants={slideInVariants} direction="up">
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center">
                      <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
                        Conversion Complete!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Your file has been converted to {convertedFile.name.split('.').pop().toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        New file size: {formatFileSize(convertedFile.size)}
                      </p>
                      <button
                        onClick={handleDownload}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 mx-auto"
                      >
                        <FaFileDownload />
                        <span>Download Converted File</span>
                      </button>
                    </div>
                  </AnimateInView>
                )}
              </div>
            </div>
          </AnimateInView>

          {/* Technical specs */}
          <AnimateInView variants={fadeInVariants} className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Conversion is performed securely in your browser. No files are uploaded to any server.
            </p>
            <p className="mt-2">
              <FaCog className="inline mr-1" />
              Powered by Web Workers and FFmpeg WebAssembly for high-performance conversions
            </p>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Converter;
