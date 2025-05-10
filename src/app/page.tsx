'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [imageSize, setImageSize] = useState({ width: 300, height: 500 });

  useEffect(() => {
    function updateImageDimensions() {
      // Make image responsive based on viewport height
      const newHeight = window.innerHeight * 0.5; // 50% of viewport height
      const aspectRatio = 0.6; // Portrait aspect ratio
      const newWidth = newHeight * aspectRatio;
      
      setImageSize({ width: newWidth, height: newHeight });
    }

    updateImageDimensions();

    window.addEventListener('resize', updateImageDimensions);

    return () => window.removeEventListener('resize', updateImageDimensions);
  }, []);

  return (
    <div 
      className="relative"
      style={{ width: imageSize.width, height: imageSize.height }}
    >
      <Image
        src="/assets/hero.png"
        alt="Hero Image"
        fill
        priority
        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}