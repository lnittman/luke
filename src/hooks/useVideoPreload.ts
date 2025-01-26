import { useEffect, useRef } from 'react';

interface VideoPreloadOptions {
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function useVideoPreload(videos: string[], options: VideoPreloadOptions = {}) {
  const videoElementsRef = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    const { onLoad, onError } = options;
    
    // Clear previous video elements
    videoElementsRef.current.forEach(video => {
      video.src = '';
      video.load();
    });
    videoElementsRef.current = [];

    // Create and preload new video elements
    const videoElements = videos.map(src => {
      const video = document.createElement('video');
      video.playsInline = true;
      video.muted = true;
      video.preload = 'auto';

      // Add event listeners
      video.addEventListener('loadeddata', () => {
        onLoad?.();
      });

      video.addEventListener('error', () => {
        onError?.(new Error(`Failed to load video: ${src}`));
      });

      video.src = src;
      return video;
    });

    videoElementsRef.current = videoElements;

    // Cleanup function
    return () => {
      videoElements.forEach(video => {
        video.src = '';
        video.load();
      });
    };
  }, [videos, options.onLoad, options.onError]);

  return videoElementsRef.current;
} 