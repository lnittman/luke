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

  // Calculate responsive size (40-70% of the smallest dimension)
  const size = Math.min(dimensions.width, dimensions.height) * 0.5;

  return (
    <div className="flex items-center justify-center h-full w-full min-h-screen overflow-hidden">
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/assets/logo-2.png"
          alt="Logo"
          fill
          priority
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 33vw"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}