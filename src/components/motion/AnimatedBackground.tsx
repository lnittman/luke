'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'grid' | 'dots' | 'lines';
  className?: string;
  color?: string;
  opacity?: number;
}

export function AnimatedBackground({ 
  variant = 'grid',
  className = '',
  color = 'rgb(var(--accent-1))',
  opacity = 0.1
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;

      if (variant === 'grid') {
        // Animated grid
        const spacing = 50;
        const offset = Math.sin(time * 0.001) * 10;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += spacing) {
          ctx.moveTo(x + offset, 0);
          ctx.lineTo(x + offset, canvas.height);
        }
        for (let y = 0; y < canvas.height; y += spacing) {
          ctx.moveTo(0, y + offset);
          ctx.lineTo(canvas.width, y + offset);
        }
        ctx.stroke();
      } else if (variant === 'dots') {
        // Animated dots
        const spacing = 30;
        const radius = 2;
        
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            const wave = Math.sin(time * 0.002 + x * 0.01 + y * 0.01) * 5;
            ctx.beginPath();
            ctx.arc(x + wave, y + wave, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (variant === 'lines') {
        // Animated lines
        const count = 20;
        
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const y = (canvas.height / count) * i;
          const wave = Math.sin(time * 0.002 + i * 0.5) * 20;
          
          ctx.moveTo(0, y);
          for (let x = 0; x < canvas.width; x += 10) {
            const localWave = Math.sin(x * 0.01 + time * 0.003) * 10;
            ctx.lineTo(x, y + wave + localWave);
          }
        }
        ctx.stroke();
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}