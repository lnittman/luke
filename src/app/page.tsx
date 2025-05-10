'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get initial window dimensions
    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial dimensions
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate responsive size for portrait image 
  // Use 70% of height and adjust width to maintain portrait aspect ratio
  const height = dimensions.height * 0.7;
  const width = height * 0.6; // Portrait aspect ratio (adjust as needed)

  return (
    <div className="flex items-center justify-center h-full w-full absolute inset-0">
      <div 
        className="relative"
        style={{ width, height }}
      >
        <Image
          src="/assets/hero.png"
          alt="Logo"
          fill
          priority
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 70vw, 60vw"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </div>
    </div>
  );
}