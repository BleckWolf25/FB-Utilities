import React, { useState, useEffect } from 'react';

const LegalWarnToast = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const toastDuration = 30000; // 30 seconds
  const intervalTime = 150; // Update progress every 150ms for smooth animation

  useEffect(() => {
    // Set up timer to hide toast after 15 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, toastDuration);

    // Set up progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress - (100 / (toastDuration / intervalTime));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, intervalTime);

    // Clean up timers when component unmounts
    return () => {
      clearTimeout(hideTimer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
        
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Important Legal Notice</h3>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  By using any utility on this website, you automatically accept our 
                  <a href="/privacy-policy" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline mx-1">Privacy Policy</a>
                  and
                  <a href="/terms-of-service" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline mx-1">Terms of Service</a>.
                  Please read these documents, which can be found in the footer of the website.
                </p>
              </div>
            </div>
            
            {/* Close button */}
            <button 
              onClick={() => setVisible(false)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalWarnToast;