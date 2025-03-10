import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook that uses a Web Worker for code unminification/beautification
const useUnminifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const workerRef = useRef(null);

  // Initialize the worker
  useEffect(() => {
    // Create the worker
    const worker = new Worker(new URL('../web_workers/unminifier.worker.js', import.meta.url));
    
    // Set up message handler
    worker.onmessage = (event) => {
      const response = event.data;
      
      if (response.success) {
        setResult({
          formattedCode: response.formattedCode,
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

  // Function to unminify code
  const unminifyCode = useCallback((content, fileType, fileExtension) => {
    if (!content) {
      setError('No content to format');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    // Send message to worker with the code to format
    workerRef.current.postMessage({
      content,
      fileType,
      fileExtension
    });
  }, []);

  // Batch processing function for multiple files
  const unminifyBatch = useCallback(async (files, fileTypeDefault) => {
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
        const formattingResult = await processInWorker(content, fileTypeDefault, fileExtension);
        
        // Calculate file sizes
        const originalSize = new Blob([content]).size;
        const formattedSize = new Blob([formattingResult]).size;
        const difference = formattedSize - originalSize;
        const percentage = ((difference / originalSize) * 100).toFixed(2);
        
        // Create output filename
        let outputFileName = file.name;
        // Replace .min if it exists in the filename
        outputFileName = outputFileName.replace('.min.', '.formatted.');
        
        // If no .min was present, add .formatted before the extension
        if (outputFileName === file.name) {
          const lastDotIndex = outputFileName.lastIndexOf('.');
          if (lastDotIndex !== -1) {
            outputFileName = outputFileName.slice(0, lastDotIndex) + '.formatted' + outputFileName.slice(lastDotIndex);
          } else {
            outputFileName += '.formatted';
          }
        }
        
        // Create download URL
        const formattedBlob = new Blob([formattingResult], { type: 'text/plain' });
        const formattedUrl = URL.createObjectURL(formattedBlob);
        
        // Add to results
        results.push({
          originalName: file.name,
          formattedName: outputFileName,
          originalSize: (originalSize / 1024).toFixed(2),
          formattedSize: (formattedSize / 1024).toFixed(2),
          difference: (difference / 1024).toFixed(2),
          percentage,
          url: formattedUrl,
          content: formattingResult,
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
          resolve(response.formattedCode);
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
    unminifyCode,  // Properly included here
    unminifyBatch
  };
};

export default useUnminifier;