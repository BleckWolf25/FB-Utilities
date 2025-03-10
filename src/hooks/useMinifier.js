import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook that uses a Web Worker for code minification
const useMinifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const workerRef = useRef(null);

  // Initialize the worker
  useEffect(() => {
    // Create the worker with the correct filename
    const worker = new Worker(new URL('../web_workers/minifier.worker.js', import.meta.url));
    
    // Set up message handler
    worker.onmessage = (event) => {
      const response = event.data;
      
      if (response.success) {
        setResult({
          minifiedCode: response.minifiedCode,
          stats: response.stats
        });
      } else {
        setError(response.error);
      }
      
      setIsProcessing(false);
    };
    
    // Handle worker errors
    worker.onerror = (error) => {
      setError(`Worker error: ${error.message}`);
      setIsProcessing(false);
    };
    
    // Store worker reference
    workerRef.current = worker;
    
    // Cleanup function to terminate worker when component unmounts
    return () => {
      worker.terminate();
    };
  }, []);

  // Function to minify code
  const minifyCode = useCallback((content, fileType, fileExtension) => {
    if (!content) {
      setError('No content to minify');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    // Send message to worker with the code to minify
    workerRef.current.postMessage({
      content,
      fileType,
      fileExtension
    });
  }, []);

  // Batch processing function for multiple files
  const minifyBatch = useCallback(async (files, fileTypeDefault) => {
    if (!files || files.length === 0) {
      setError('No files to process');
      return [];
    }
    
    setIsProcessing(true);
    setError(null);
    
    const results = [];
    
    for (const file of files) {
      try {
        // Read file content
        const content = await readFileAsText(file);
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Process in worker and wait for result
        const minificationResult = await processInWorker(content, fileTypeDefault, fileExtension);
        
        // Calculate file sizes
        const originalSize = new Blob([content]).size;
        const minifiedSize = new Blob([minificationResult]).size;
        const reduction = originalSize - minifiedSize;
        const percentage = ((reduction / originalSize) * 100).toFixed(2);
        
        // Create output filename
        let outputFileName = file.name;
        const lastDotIndex = outputFileName.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          outputFileName = outputFileName.slice(0, lastDotIndex) + '.min' + outputFileName.slice(lastDotIndex);
        } else {
          outputFileName += '.min';
        }
        
        // Create download URL
        const minifiedBlob = new Blob([minificationResult], { type: 'text/plain' });
        const minifiedUrl = URL.createObjectURL(minifiedBlob);
        
        // Add to results
        results.push({
          originalName: file.name,
          minifiedName: outputFileName,
          originalSize: (originalSize / 1024).toFixed(2),
          minifiedSize: (minifiedSize / 1024).toFixed(2),
          reduction: (reduction / 1024).toFixed(2),
          percentage,
          url: minifiedUrl,
          content: minificationResult,
        });
      } catch (err) {
        results.push({
          originalName: file.name,
          error: err.message
        });
      }
    }
    
    setIsProcessing(false);
    return results;
  }, []);

  // Helper function to read file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // Helper function to process content in worker and return a promise
  const processInWorker = (content, fileType, fileExtension) => {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const response = event.data;
        
        if (response.success) {
          resolve(response.minifiedCode);
        } else {
          reject(new Error(response.error));
        }
      };
      
      workerRef.current.postMessage({
        content,
        fileType,
        fileExtension
      }, [messageChannel.port2]);
    });
  };

  // Return the hook's API
  return {
    isProcessing,
    error,
    result,
    minifyCode,
    minifyBatch
  };
};

export default useMinifier;