'use client';

import { useEffect, useRef, HTMLAttributes } from 'react';

interface AnimatedAsciiProps extends HTMLAttributes<HTMLDivElement> {
  frames: string[];
  interval?: number;
  delay?: number;
  color?: string;
}

export function AnimatedAscii({ 
  frames, 
  interval = 100, 
  delay = 0,
  color = 'rgb(var(--text-secondary))',
  className,
  ...props 
}: AnimatedAsciiProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frameIndex = useRef(0);

  useEffect(() => {
    if (!ref.current || frames.length === 0) return;

    // Set initial frame
    ref.current.innerHTML = frames[0];

    const startAnimation = () => {
      const intervalId = setInterval(() => {
        if (!ref.current) return;
        
        frameIndex.current = (frameIndex.current + 1) % frames.length;
        ref.current.innerHTML = frames[frameIndex.current];
      }, interval);

      return intervalId;
    };

    // Start after delay
    const timeoutId = setTimeout(() => {
      const intervalId = startAnimation();
      
      // Store intervalId for cleanup
      ref.current?.setAttribute('data-interval-id', String(intervalId));
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      const intervalId = ref.current?.getAttribute('data-interval-id');
      if (intervalId) {
        clearInterval(Number(intervalId));
      }
    };
  }, [frames, interval, delay]);

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        lineHeight: 1.2,
        color,
        ...props.style,
      }}
      {...props}
    />
  );
}

// Preset ASCII animations
export const ASCII_PRESETS = {
  glitch: [
    `╔════╗
║████║
║████║
╚════╝`,
    `╔═══╗
║███║
║███║
╚═══╝`,
    `╔══╗
║██║
║██║
╚══╝`,
    `╔═╗
║█║
║█║
╚═╝`,
    `╔╗
║║
║║
╚╝`,
    `╔═╗
║█║
║█║
╚═╝`,
    `╔══╗
║██║
║██║
╚══╝`,
    `╔═══╗
║███║
║███║
╚═══╝`,
  ],
  
  pulse: [
    `     
  •  
     `,
    `     
 •·• 
     `,
    `  ·  
·•·•·
  ·  `,
    ` ·•· 
•·•·•
 ·•· `,
    `·•·•·
•·•·•
·•·•·`,
    ` ·•· 
•·•·•
 ·•· `,
    `  ·  
·•·•·
  ·  `,
    `     
 •·• 
     `,
  ],
  
  spinner: [
    `╱`,
    `─`,
    `╲`,
    `│`,
  ],
  
  matrix: [
    `10110
01001
11010
00101
10011`,
    `01001
11010
00101
10011
10110`,
    `11010
00101
10011
10110
01001`,
    `00101
10011
10110
01001
11010`,
    `10011
10110
01001
11010
00101`,
  ],

  error404: [
    `┌─────┐
│ 404 │
└─────┘`,
    `╔═════╗
║ 404 ║
╚═════╝`,
    `┏━━━━━┓
┃ 404 ┃
┗━━━━━┛`,
    `╭─────╮
│ 404 │
╰─────╯`,
  ],

  loading: [
    `[    ]`,
    `[■   ]`,
    `[■■  ]`,
    `[■■■ ]`,
    `[■■■■]`,
    `[ ■■■]`,
    `[  ■■]`,
    `[   ■]`,
  ],
};