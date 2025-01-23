import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
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

// Add this component for preloading
function VideoPreloader({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      preload="auto"
      style={{ display: 'none' }}
      playsInline
      muted
    />
  );
}

export function VideoPlayer({
  src,
  title,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video state when src changes
    video.currentTime = 0;
    setIsPlaying(false);

    // Try to preload the video
    video.load();
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setProgress(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white/80">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono">{title}</h2>
          <div className="flex items-center gap-2 text-white/60">
            {hasPrev && (
              <button
                onClick={onPrev}
                className="hover:text-white transition-colors"
              >
                ←
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="hover:text-white transition-colors"
              >
                →
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors font-mono"
        >
          esc
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        {/* Video container */}
        <div className="relative w-full max-w-5xl mx-4">
          <video
            ref={videoRef}
            src={src}
            className="w-full rounded-lg"
            playsInline
            onClick={togglePlay}
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {!isPlaying && (
              <div className="rounded-full bg-white/10 p-4">
                <span className="text-4xl">▶️</span>
              </div>
            )}
          </motion.div>

          {/* Controls container - positioned absolutely under the video */}
          <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-4">
            {/* Seek bar */}
            <div 
              className="w-full max-w-xl h-1 rounded-full bg-white/10 cursor-pointer"
              onClick={handleSeek}
            >
              <motion.div 
                className="h-full rounded-full bg-white/30"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>

            {/* Play/Pause button with navigation */}
            <div className="flex items-center gap-4 text-2xl">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={clsx(
                  "transition-opacity",
                  hasPrev ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"
                )}
              >
                ⬅️
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
                ➡️
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 