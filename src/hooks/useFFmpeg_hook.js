import { useState, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const useFFmpeg = () => {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load FFmpeg instance
  const load = useCallback(async () => {
    if (ffmpeg) return ffmpeg;
    
    setIsLoading(true);
    try {
      const ffmpegInstance = new FFmpeg();
      ffmpegInstance.on('progress', ({ percent }) => {
        setProgress(Math.round(percent));
      });
      
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
      return ffmpegInstance;
    } catch (error) {
      console.error('FFmpeg loading error:', error);
      throw new Error(`Failed to load FFmpeg: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [ffmpeg]);

  // Convert audio using FFmpeg
  const convertAudio = useCallback(async (file, sourceFormat, targetFormat, bitrate = 128) => {
    const instance = ffmpeg || await load();
    
    try {
      await instance.writeFile(`input.${sourceFormat}`, await fetchFile(file));
      
      // Add more specific error handling
      try {
        await instance.exec([
          '-i', `input.${sourceFormat}`,
          '-b:a', `${bitrate}k`,
          `output.${targetFormat}`,
        ]);
      } catch (execError) {
        if (execError.message.includes('Unsupported codec')) {
          throw new Error(`Unsupported audio codec for ${sourceFormat} to ${targetFormat} conversion`);
        } else if (execError.message.includes('Invalid data')) {
          throw new Error(`The file appears to be corrupted or not a valid ${sourceFormat} file`);
        } else {
          throw execError;
        }
      }
  
      // Check if output file exists
      const files = await instance.listDir('/');
      if (!files.some(f => f.name === `output.${targetFormat}`)) {
        throw new Error(`Conversion failed: Output file not generated`);
      }
  
      const data = await instance.readFile(`output.${targetFormat}`);
      return new Blob([data.buffer], { type: `audio/${targetFormat}` });
    } catch (error) {
      console.error('Audio conversion error:', error);
      throw new Error(`Audio conversion failed: ${error.message}`);
    } finally {
      // Cleanup temporary files
      try {
        await instance.deleteFile(`input.${sourceFormat}`);
        await instance.deleteFile(`output.${targetFormat}`);
      } catch (e) {
        // Silently handle cleanup errors
        console.warn('Failed to cleanup temporary files:', e);
      }
    }
  }, [ffmpeg, load]);

  // Convert video using FFmpeg
  const convertVideo = useCallback(async (file, sourceFormat, targetFormat) => {
    const instance = ffmpeg || await load();
    
    try {
      await instance.writeFile(`input.${sourceFormat}`, await fetchFile(file));

      let command = ['-i', `input.${sourceFormat}`];
      if (targetFormat === 'gif') {
        command = [
          '-i', `input.${sourceFormat}`,
          '-vf', 'fps=10,scale=320:-1:flags=lanczos',
          '-loop', '0',
        ];
      }
      command.push(`output.${targetFormat}`);

      await instance.exec(command);

      const data = await instance.readFile(`output.${targetFormat}`);
      return new Blob([data.buffer], { type: `video/${targetFormat}` });
    } catch (error) {
      throw new Error(`Video conversion failed: ${error.message}`);
    }
  }, [ffmpeg, load]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (ffmpeg) {
        // Clean up any resources if needed
      }
    };
  }, [ffmpeg]);

  return { 
    ffmpeg, 
    isLoading, 
    progress, 
    load, 
    convertAudio, 
    convertVideo 
  };
};