'use client';

import React from 'react';
import { FooterNavigation } from '@/components/shared/footer-navigation';

export default function TestHotkeys() {
  const [keyPresses, setKeyPresses] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setKeyPresses(prev => [...prev.slice(-9), `Key: ${event.key}, Code: ${event.code}`]);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Hotkey Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-2">Instructions:</h2>
        <ul className="list-disc pl-6">
          <li>Press h - should navigate to Home</li>
          <li>Press a - should navigate to About</li>
          <li>Press w - should navigate to Work</li>
          <li>Press p - should navigate to Projects</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Last 10 Key Presses:</h2>
        <div className="font-mono text-sm bg-black/10 p-4 rounded">
          {keyPresses.length === 0 ? (
            <p className="text-gray-500">No keys pressed yet...</p>
          ) : (
            keyPresses.map((key, index) => (
              <div key={index}>{key}</div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8">
        <FooterNavigation />
      </div>
    </div>
  );
}