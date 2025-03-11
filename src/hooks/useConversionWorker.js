import { useState, useCallback, useRef, useEffect } from 'react';

export const useConversionWorker = (workerType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState(null);
  const workerRef = useRef(null);
  
  // Initialize worker only once
  useEffect(() => {
    // Skip if we already have a worker
    if (workerRef.current) return;
    
    let workerInstance;
    
    switch (workerType) {
      case 'image':
        workerInstance = new Worker(new URL('../web_workers/imageConverter.worker.js', import.meta.url), { type: 'module' });
        break;
      case 'document':
        // Create a classic worker (not a module worker) to support importScripts
        workerInstance = new Worker(new URL('../web_workers/documentConverter.worker.js', import.meta.url), 
          { type: 'classic' });
        
        // Initialize the worker with options
        workerInstance.postMessage({
          type: 'init',
          payload: {
            useBundledPdfJs: true
          }
        });
        break;
      default:
        console.warn(`No worker defined for type: ${workerType}`);
        return;
    }
    
    // Setup message handler
    workerInstance.onmessage = (event) => {
      const { type, payload, message } = event.data;
      
      if (type === 'progress') {
        setProgress(payload || 0);
        if (message) setProgressMessage(message);
      }
      else if (type === 'error') {
        setError(payload);
        setIsProcessing(false);
      }
      else if (type === 'success') {
        setIsProcessing(false);
        setProgress(100);
      }
    };
    
    workerRef.current = workerInstance;
    
    // Cleanup worker on unmount
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [workerType]);

  /**
   * Processes a file using a dedicated web worker
   * @param {File} file - The file to process
   * @param {string} sourceFormat - The source file format (e.g., 'jpg', 'png')
   * @param {string} targetFormat - The target file format to convert to
   * @param {Object} options - Additional conversion options
   * @returns {Promise<Blob>} A promise that resolves to the converted file as a Blob
   */
  const processFile = useCallback((file, sourceFormat, targetFormat, options = {}) => {
    if (!workerRef.current) {
      return Promise.reject(new Error('Worker not initialized'));
    }
    
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setProgress(0);
      setProgressMessage('Starting conversion...');
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const worker = workerRef.current;
          
          // Setup one-time message handler for this conversion
          const messageHandler = (event) => {
            const { type, payload, message } = event.data;
            
            if (type === 'success') {
              worker.removeEventListener('message', messageHandler);
              resolve(payload);
            }
            else if (type === 'error') {
              worker.removeEventListener('message', messageHandler);
              reject(new Error(payload));
            }
            else if (type === 'progress') {
              setProgress(payload || 0);
              if (message) setProgressMessage(message);
            }
          };
          
          worker.addEventListener('message', messageHandler);
          
          // Send data to worker
          worker.postMessage({
            type: 'convert',
            payload: {
              file: new Blob([arrayBuffer], { type: file.type }),
              sourceFormat,
              targetFormat,
              useOcr: options.useOcr || false
            }
          }, [arrayBuffer]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }, [workerType]);

  return {
    processFile,
    isProcessing,
    progress,
    progressMessage,
    error
  };
};