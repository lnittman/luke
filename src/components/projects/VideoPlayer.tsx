import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

interface VideoPlayerProps {
  src: string;
  title: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const VideoPlayer = ({
  src,
  title,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setIsPlaying(false);
    video.load();
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (hasNext && onNext) {
        onNext();
      }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft') restartOrPrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose, onNext, onPrev, hasNext, hasPrev]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const restartOrPrev = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > 3) {
      // If we're more than 3 seconds in, restart the video
      video.currentTime = 0;
    } else if (hasPrev && onPrev) {
      // If we're at the start and there's a previous video, go to it
      onPrev();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 z-[400] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-2 sm:p-4 flex items-center justify-between text-white/80">
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="text-xs sm:text-sm font-mono">{title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors font-mono text-xs sm:text-sm"
        >
          esc
        </button>
      </div>

      {/* Main content */}
      <div 
        className="flex-1 flex items-center justify-center"
        onClick={(e) => {
          // Only close if clicking the background, not the video or controls
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Video container with controls */}
        <div className="relative w-full max-w-5xl mx-2 sm:mx-4 flex flex-col items-center">
          {/* Video wrapper */}
          <div className="relative w-full max-h-[70vh] flex items-center justify-center mb-16 sm:mb-24 md:mb-28">
            <video
              ref={videoRef}
              src={src}
              className="max-h-full max-w-full rounded-lg"
              playsInline
              onClick={togglePlay}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Controls container */}
            <div className="absolute bottom-[-5rem] sm:bottom-[-6rem] md:bottom-[-8rem] left-0 right-0 flex justify-center px-2 sm:px-4 py-4 sm:py-8">
              {/* Play/Pause button with navigation */}
              <div className="flex items-center gap-4 sm:gap-8 text-2xl sm:text-3xl">
                <button
                  onClick={restartOrPrev}
                  className="text-white/60 hover:text-white transition-opacity"
                >
                  ⏮️
                </button>
                <button
                  onClick={togglePlay}
                  className="text-white/60 hover:text-white transition-opacity"
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className={clsx(
                    "transition-opacity",
                    hasNext ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"
                  )}
                >
                  ⏭️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 