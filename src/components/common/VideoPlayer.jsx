// src/components/common/VideoPlayer.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * VideoPlayer component
 * A reusable video player with play/pause controls and loading state
 * 
 * @param {Object} props
 * @param {string} props.src - Video source URL
 * @param {string} props.poster - Poster image URL
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.autoPlay - Whether to autoplay the video
 * @param {boolean} props.loop - Whether to loop the video
 * @param {boolean} props.muted - Whether to mute the video
 * @param {boolean} props.controls - Whether to show native video controls
 */
const VideoPlayer = ({
  src,
  poster = "/api/placeholder/1280/720",
  className = '',
  autoPlay = false,
  loop = true,
  muted = true,
  controls = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  
  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle video loaded event
  const handleLoaded = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className={`relative group ${className}`}>
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <svg 
            className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover rounded-lg ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        onLoadedData={handleLoaded}
        playsInline
      />
      
      {/* Custom play/pause overlay button - only visible if not using native controls */}
      {!controls && (
        <motion.button
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default VideoPlayer;