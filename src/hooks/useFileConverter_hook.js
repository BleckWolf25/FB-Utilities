import { useState, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { useFFmpeg } from './useFFmpeg_hook';

export const useFileConverter = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  const [error, setError] = useState(null);
  const [conversionProgressMessage, setConversionProgressMessage] = useState('');
  
  const { isLoading: isFFmpegLoading, progress: ffmpegProgress, convertAudio, convertVideo } = useFFmpeg();

  // Reset the converter state
  const resetState = useCallback(() => {
    setFile(null);
    setFileName('');
    setSourceFormat('');
    setTargetFormat('');
    setConvertedFile(null);
    setError(null);
    setConversionProgress(0);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile, converterOptions) => {
    if (!selectedFile) return;

    setError(null);
    setConvertedFile(null);
    setConversionProgress(0);

    if (selectedFile.size > converterOptions.maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${converterOptions.maxSize}MB.`);
      return false;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (converterOptions.sourceFormats.includes(extension)) {
      setSourceFormat(extension);
    } else if (extension === 'jpeg' && converterOptions.sourceFormats.includes('jpg')) {
      setSourceFormat('jpg');
    }
    
    return true;
  }, []);

  // Convert image
  const convertImage = useCallback(async (imageFile, from, to) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const mimeType = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
            bmp: 'image/bmp',
          }[to] || 'image/png';

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error(`Failed to convert to ${to.toUpperCase()}`));
              return;
            }
            const newFileName = fileName.replace(new RegExp(`\\.${from}$`), `.${to}`);
            resolve({ name: newFileName, blob, type: mimeType });
          }, mimeType, 0.92);
        } catch (error) {
          reject(new Error(`Image conversion failed: ${error.message}`));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }, [fileName]);

  // Convert document
  const convertDocument = useCallback(async (docFile, from, to) => {
    try {
      if (from === 'pdf' && to === 'txt') {
        const arrayBuffer = await docFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ') + '\n';
          setConversionProgress(Math.round((i / pdf.numPages) * 100));
        }
        const blob = new Blob([text], { type: 'text/plain' });
        return {
          name: fileName.replace('.pdf', '.txt'),
          blob,
          type: 'text/plain',
        };
      }

      if (from === 'html' && to === 'pdf') {
        const reader = new FileReader();
        const htmlContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read HTML file'));
          reader.readAsText(docFile);
        });

        const doc = new jsPDF();
        const blob = await new Promise((resolve) => {
          doc.html(htmlContent, {
            callback: (doc) => {
              setConversionProgress(100);
              resolve(doc.output('blob'));
            },
            x: 10,
            y: 10,
          });
        });
        
        return {
          name: fileName.replace('.html', '.pdf'),
          blob,
          type: 'application/pdf',
        };
      }

      // Handle other document conversions
      const reader = new FileReader();
      const content = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(docFile);
      });

      let result, mimeType;
      if (from === 'txt' && to === 'html') {
        result = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${fileName.replace('.txt', '')}</title></head><body>${content.split('\n').map((line) => `<p>${line}</p>`).join('')}</body></html>`;
        mimeType = 'text/html';
      } else if (from === 'html' && to === 'txt') {
        result = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        mimeType = 'text/plain';
      } else {
        result = content;
        mimeType = `text/${to}`;
      }

      setConversionProgress(100);
      const blob = new Blob([result], { type: mimeType });
      return {
        name: fileName.replace(new RegExp(`\\.${from}$`), `.${to}`),
        blob,
        type: mimeType,
      };
    } catch (error) {
      throw new Error(`Document conversion failed: ${error.message}`);
    }
  }, [fileName]);

  // Main conversion function
  const convert = useCallback(async (converterType) => {
    if (!file || !sourceFormat || !targetFormat) {
      setError('Please select a file, source format, and target format.');
      return;
    }
    if (sourceFormat === targetFormat) {
      setError('Source and target formats must be different.');
      return;
    }

    setIsConverting(true);
    setError(null);
    setConversionProgress(0);

    try {
      let result;
      switch (converterType) {
        case 'image':
          result = await convertImage(file, sourceFormat, targetFormat);
          setConversionProgress(100);
          break;
        case 'audio':
          const audioBlob = await convertAudio(file, sourceFormat, targetFormat);
          result = {
            name: fileName.replace(new RegExp(`\\.${sourceFormat}$`), `.${targetFormat}`),
            blob: audioBlob,
            type: `audio/${targetFormat}`
          };
          break;
        case 'video':
          const videoBlob = await convertVideo(file, sourceFormat, targetFormat);
          result = {
            name: fileName.replace(new RegExp(`\\.${sourceFormat}$`), `.${targetFormat}`),
            blob: videoBlob,
            type: `video/${targetFormat}`
          };
          break;
        case 'document':
          result = await convertDocument(file, sourceFormat, targetFormat);
          break;
        default:
          throw new Error('Unsupported conversion type');
      }

      setConvertedFile({
        name: result.name,
        url: URL.createObjectURL(result.blob),
        size: result.blob.size,
        type: result.type,
      });
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [file, fileName, sourceFormat, targetFormat, convertImage, convertDocument, convertAudio, convertVideo]);

  // Update progress from FFmpeg
  useEffect(() => {
    if (ffmpegProgress > 0) {
      setConversionProgress(ffmpegProgress);
    }
  }, [ffmpegProgress]);

  return {
    file,
    fileName,
    sourceFormat,
    targetFormat,
    isConverting,
    conversionProgress,
    conversionProgressMessage,
    convertedFile,
    error,
    isFFmpegLoading,
    setSourceFormat,
    setTargetFormat,
    setIsConverting,
    setError,
    setConvertedFile,
    handleFileSelect,
    convert,
    resetState
  };
};