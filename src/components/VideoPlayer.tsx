import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video state when src changes
    video.currentTime = 0;
    setIsPlaying(false);

    // Try to preload the video
    video.load();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 z-50 flex flex-col"
    >
      <div className="relative flex-1 flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 text-white/50 hover:text-white transition-colors"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        )}

        {/* Video player */}
        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
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
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 