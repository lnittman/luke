import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

interface Video {
  src: string;
  title: string;
}

interface VideoPlayerProps {
  videos: Video[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const VideoPlayer = ({
  videos,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const currentVideo = videos[currentIndex];
  const hasNext = currentIndex < videos.length - 1;
  const hasPrev = currentIndex > 0;

  // Reset playback state when the video changes
  useEffect(() => {
    setIsPlaying(false);
    setLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      // Automatically go to next video if available
      if (hasNext) {
        onNext();
      }
    };
    
    const handleCanPlayThrough = () => {
      setLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [onNext, hasNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        if (hasNext) onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        if (hasPrev) onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };
  
  const restartOrPrev = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.currentTime > 3) {
      // If we're more than 3 seconds in, restart this video
      videoRef.current.currentTime = 0;
    } else {
      // Otherwise go to previous video
      if (hasPrev) onPrev();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video container */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={currentVideo.src}
          className={clsx(
            "max-w-full max-h-full", 
            loading && "opacity-0"
          )}
          playsInline
          onClick={togglePlay}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        {/* Video controls */}
        <motion.div 
          className="absolute inset-x-0 top-0 p-4 flex justify-between items-center text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xl font-medium">
            {currentVideo.title}
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </motion.div>
        
        {/* Bottom controls */}
        <motion.div 
          className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <button 
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors",
                !hasPrev && "opacity-50 cursor-not-allowed"
              )}
              onClick={restartOrPrev}
              disabled={!hasPrev}
            >
              ←
            </button>
            <button 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <button 
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors",
                !hasNext && "opacity-50 cursor-not-allowed"
              )}
              onClick={onNext}
              disabled={!hasNext}
            >
              →
            </button>
          </div>
          <div className="text-sm">
            {currentIndex + 1} / {videos.length}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}; 