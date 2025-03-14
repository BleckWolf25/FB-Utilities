// This is a Web Worker file that will handle image conversion

// Handle image conversion
self.onmessage = async (event) => {
    const { imageData, targetFormat } = event.data;
    
    try {
      // Create image from blob
      const imageBlob = new Blob([imageData]);
      const imageBitmap = await createImageBitmap(imageBlob);
      
      // Create a canvas to draw the image
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0);
      
      // Determine MIME type for the target format
      const mimeType = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        bmp: 'image/bmp',
      }[targetFormat] || 'image/png';
      
      // Convert to the target format
      const blob = await canvas.convertToBlob({ type: mimeType, quality: 0.92 });
      
      // Send the result back to the main thread
      const arrayBuffer = await blob.arrayBuffer();
      self.postMessage({
        status: 'success',
        result: arrayBuffer,
        type: mimeType
      }, [arrayBuffer]);
    } catch (error) {
      self.postMessage({
        status: 'error',
        error: `Image conversion failed: ${error.message}`
      });
    }
};