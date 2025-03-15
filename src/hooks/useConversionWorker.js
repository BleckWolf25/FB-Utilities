import { useState, useEffect, useCallback } from 'react';

export const useConversionWorker = (workerType) => {
  const [worker, setWorker] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [initializationError, setInitializationError] = useState(null);
  
  // Initialize worker on mount
  useEffect(() => {
    let workerInstance;
    
    try {
      if (workerType === 'image') {
        workerInstance = new Worker(new URL('../web_workers/imageConverter.worker.js', import.meta.url));
      } else if (workerType === 'document') {
        workerInstance = new Worker(new URL('../web_workers/documentConverter.worker.js', import.meta.url));
      }
      
      if (workerInstance) {
        // Set up message event handler
        workerInstance.onmessage = (e) => {
          const { type, payload, message } = e.data;
          
          if (type === 'initialized') {
            console.log(`${workerType} worker initialized successfully`);
            setIsInitialized(true);
          } else if (type === 'progress') {
            setProgress(payload || 0);
            if (message) setProgressMessage(message);
          } else if (type === 'error') {
            console.error(`${workerType} worker error:`, payload);
            setInitializationError(payload);
          }
        };
        
        // Handle worker errors
        workerInstance.onerror = (error) => {
          console.error(`${workerType} worker error:`, error);
          setInitializationError(`Failed to initialize ${workerType} worker: ${error.message}`);
        };
        
        setWorker(workerInstance);
        
        // Initialize the worker with a timeout to ensure it responds
        workerInstance.postMessage({ 
          type: 'init',
          payload: { enableOcr: workerType === 'document' } 
        });
        
        // Set a timeout to check if the worker initialized properly
        const initTimeout = setTimeout(() => {
          if (!isInitialized) {
            console.warn(`${workerType} worker failed to initialize within timeout`);
            setInitializationError(`${workerType} worker initialization timed out`);
          }
        }, 5000);
        
        return () => {
          clearTimeout(initTimeout);
          if (workerInstance) {
            workerInstance.terminate();
          }
        };
      }
    } catch (error) {
      console.error(`Failed to create ${workerType} worker:`, error);
      setInitializationError(`Failed to create ${workerType} worker: ${error.message}`);
    }
  }, [workerType]);

  // Process file with worker
  const processFile = useCallback(async (file, sourceFormat, targetFormat, options = {}) => {
    // Check for initialization before proceeding
    if (initializationError) {
      throw new Error(`Worker initialization failed: ${initializationError}`);
    }
    
    if (!worker) {
      throw new Error('Worker not created');
    }
    
    if (!isInitialized) {
      // Try to wait a bit for initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!isInitialized) {
        throw new Error('Worker not initialized. Please try again.');
      }
    }
    
    setIsProcessing(true);
    setProgress(0);
    setProgressMessage('Starting conversion process');
    
    try {
      const result = await new Promise((resolve, reject) => {
        const messageHandler = (e) => {
          const { type, payload, message } = e.data;
          
          if (type === 'progress') {
            setProgress(payload || 0);
            if (message) setProgressMessage(message);
          } else if (type === 'success') {
            worker.removeEventListener('message', messageHandler);
            resolve(payload);
          } else if (type === 'error') {
            worker.removeEventListener('message', messageHandler);
            reject(new Error(payload || 'Conversion failed'));
          }
        };
        
        worker.addEventListener('message', messageHandler);
        
        // Set a timeout to prevent hanging conversions
        const timeoutId = setTimeout(() => {
          worker.removeEventListener('message', messageHandler);
          reject(new Error('Conversion timed out'));
        }, 120000); // 2 minutes timeout
        
        worker.postMessage({
          type: 'convert',
          payload: { 
            file,
            sourceFormat,
            targetFormat,
            ...options 
          }
        });
      });
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [worker, isInitialized, initializationError]);
  
  return {
    isInitialized,
    isProcessing,
    progress,
    progressMessage,
    processFile,
    error: initializationError
  };
};