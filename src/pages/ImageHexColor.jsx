import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaInfoCircle, FaCode, FaEyeDropper, FaHistory, FaTrash } from 'react-icons/fa';
import { AnimatedElement, AnimateInView, StaggerContainer, fadeInVariants, scaleInVariants, slideInVariants } from '../components/animations/FadeIn';
import { v4 as uuidv4 } from 'uuid';

const ImageHexColor = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomColor, setZoomColor] = useState(null);

  // References
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }

    setImageFile(file);
    
    // Create image preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle image load to canvas
  useEffect(() => {
    if (!imagePreview) return;
    
    const image = new Image();
    image.src = imagePreview;
    image.onload = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw image to canvas
      ctx.drawImage(image, 0, 0);
      
      // Store reference to the loaded image
      imageRef.current = image;
    };
  }, [imagePreview]);

  // Handle mouse events for color picking
  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate mouse position relative to canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    
    setMousePosition({ x, y });
    
    // Get pixel color at cursor position
    if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      
      // Convert RGB to hex
      const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      setZoomColor({ 
        hex, 
        rgb: `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})` 
      });
    }
  };

  // Handle color selection
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !zoomColor) return;
    
    // Add selected color to history
    const newColorEntry = {
      id: uuidv4(),
      hex: zoomColor.hex,
      rgb: zoomColor.rgb,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setSelectedColor(zoomColor);
    
    // Add to history and keep only latest 10 entries
    setColorHistory(prevHistory => {
      const updatedHistory = [newColorEntry, ...prevHistory];
      return updatedHistory.slice(0, 10);
    });
    
    // Copy hex code to clipboard
    navigator.clipboard.writeText(zoomColor.hex)
      .then(() => {
        // Show brief visual feedback that color was copied
        setIsSelecting(true);
        setTimeout(() => setIsSelecting(false), 500);
      })
      .catch(err => {
        console.error('Failed to copy color code:', err);
      });
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  };

  // Clear current image and selections
  const handleClear = () => {
    setImageFile(null);
    setImagePreview('');
    setSelectedColor(null);
    setZoomColor(null);
  };

  // Remove a color from history
  const removeColorFromHistory = (id) => {
    setColorHistory(prevHistory => 
      prevHistory.filter(item => item.id !== id)
    );
  };

  // Keyboard shortcuts
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

  // Get text color that will contrast with background
  const getContrastColor = (hexColor) => {
    if (!hexColor) return 'black';
    
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? 'black' : 'white';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          <AnimatedElement variants={fadeInVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Image Color Picker Utility
            </h1>
          </AnimatedElement>
          <AnimatedElement variants={fadeInVariants} delay={1}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Upload an image and extract exact hex color codes with an intuitive picker
            </p>
          </AnimatedElement>

          <div className="max-w-6xl mx-auto">
            <AnimateInView variants={scaleInVariants} viewport={{ amount: 0.1, once: true }}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Color Picker Column */}
                <div className="lg:w-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <AnimatedElement variants={slideInVariants} direction="left">
                        <div className="flex items-center mb-4">
                          <FaEyeDropper className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Color Picker
                          </h2>
                        </div>
                      </AnimatedElement>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        {/* Image Upload Section */}
                        {!imagePreview && (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <FaImage className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={40} />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Upload an image to start picking colors
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors"
                            >
                              Choose Image
                            </label>
                          </div>
                        )}

                        {/* Image Preview and Color Picker */}
                        {imagePreview && (
                          <div ref={containerRef} className="relative">
                            {/* Selected color indicator */}
                            {selectedColor && (
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-10 h-10 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600 mr-3" 
                                    style={{ backgroundColor: selectedColor.hex }}
                                  />
                                  <div>
                                    <div className="font-medium text-gray-800 dark:text-white">
                                      {selectedColor.hex}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {selectedColor.rgb}
                                    </div>
                                  </div>
                                </div>
                                <div className={`text-xs text-green-600 dark:text-green-400 transition-opacity ${isSelecting ? 'opacity-100' : 'opacity-0'}`}>
                                  Copied to clipboard!
                                </div>
                              </div>
                            )}

                            {/* Color zoom preview */}
                            {zoomColor && (
                              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                                <div className="text-center mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                                  Click to copy
                                </div>
                                <div 
                                  className="w-16 h-16 rounded mb-1 cursor-pointer"
                                  style={{ backgroundColor: zoomColor.hex }}
                                />
                                <div className="text-center text-xs font-mono text-gray-800 dark:text-gray-200">
                                  {zoomColor.hex}
                                </div>
                              </div>
                            )}

                            {/* Canvas for image and color picking */}
                            <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                              <canvas 
                                ref={canvasRef}
                                className="max-w-full h-auto cursor-crosshair"
                                onMouseMove={handleCanvasMouseMove}
                                onClick={handleCanvasClick}
                                style={{ maxHeight: '400px' }}
                              />
                              <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="max-w-full h-auto invisible" 
                                  style={{ maxHeight: '400px' }}
                                />
                              </div>
                            </div>

                            {/* Action button */}
                            <div className="mt-4">
                              <button
                                onClick={handleClear}
                                className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                              >
                                Clear Image
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Color History */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-md font-medium text-gray-800 dark:text-white">
                            Color History
                          </h3>
                          <FaHistory className="text-gray-500 dark:text-gray-400" size={16} />
                        </div>
                        <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                          {colorHistory.length > 0 ? (
                            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-600">
                              {colorHistory.map(entry => (
                                <div 
                                  key={entry.id} 
                                  className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div 
                                      className="w-8 h-8 rounded mr-3 shadow-sm border border-gray-200 dark:border-gray-700" 
                                      style={{ backgroundColor: entry.hex }}
                                    />
                                    <div>
                                      <div className="font-mono text-sm text-gray-800 dark:text-gray-200">
                                        {entry.hex}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {entry.timestamp}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button 
                                      className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                      onClick={() => navigator.clipboard.writeText(entry.hex)}
                                      title="Copy hex code"
                                    >
                                      <FaCode size={14} />
                                    </button>
                                    <button 
                                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                      onClick={() => removeColorFromHistory(entry.id)}
                                      title="Remove from history"
                                    >
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No colors picked yet
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
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">About Image Color Picker</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <p className="text-gray-600 dark:text-gray-300">
                                The Image Color Picker is a powerful utility that allows you to extract exact color codes from any 
                                image. Simply upload an image and click anywhere on it to identify and copy the precise hex and RGB 
                                values of specific colors.
                              </p>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={2}>
                              <br></br><p className="text-gray-600 dark:text-gray-300">
                                Whether you're a designer looking to match colors from reference images, a developer implementing 
                                a design, or just curious about the exact colors in your favorite photos, this tool makes the 
                                process intuitive and efficient.
                              </p><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={3}>
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Key Benefits</h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>Real-time color preview as you hover</li>
                                  <li>One-click copying to clipboard</li>
                                  <li>Both HEX and RGB format support</li>
                                  <li>Color history tracking</li>
                                  <li>Responsive design for all devices</li>
                                  <li>Dark mode support for reduced eye strain</li>
                                </ul>
                              </div>
                            </AnimatedElement>
                          </StaggerContainer>
                        )}

                        {activeTab === 'features' && (
                          <StaggerContainer>
                            <AnimatedElement variants={fadeInVariants}>
                              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Color Picker Features</h3><br></br>
                            </AnimatedElement>
                            <AnimatedElement variants={fadeInVariants} delay={1}>
                              <div className="space-y-4">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Intuitive Color Selection</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Hover over any part of your image to see a magnified color preview. Click to capture the exact color 
                                    code and automatically copy it to your clipboard.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Multiple Color Formats</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Get both hexadecimal (#RRGGBB) and RGB color codes for perfect integration with your design 
                                    tools and development environment.
                                  </p>
                                </div>
                                
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Color History</h4>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Keep track of colors you've selected during your session, making it easy to compare and use multiple 
                                    colors from the same image.
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
              <p>The Image Hex Color Picker runs entirely in your browser. No data is sent to any server.</p>
              <p>
                <FaImage className="inline mr-1" />
                Built with modern web technologies for fast, accurate results.
              </p>
            </div>
          </AnimateInView>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default ImageHexColor;