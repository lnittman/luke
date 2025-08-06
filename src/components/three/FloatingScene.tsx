'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

interface FloatingSceneProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  enableControls?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  mousePosition?: { x: number; y: number };
  audioReactivity?: {
    bassLevel: number;
    midLevel: number;
    trebleLevel: number;
    audioLevels: Float32Array;
  };
}

interface SceneContextType {
  mousePosition?: { x: number; y: number };
  audioReactivity?: {
    bassLevel: number;
    midLevel: number;
    trebleLevel: number;
    audioLevels: Float32Array;
  };
}

export const SceneContext = React.createContext<SceneContextType>({});

export function FloatingScene({ 
  children, 
  cameraPosition = [0, 0, 5],
  enableControls = false,
  fogColor,
  fogNear = 5,
  fogFar = 15
}: FloatingSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        {fogColor && <color attach="background" args={[fogColor]} />}
        {fogColor && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
        
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ECDC4" />
        
        {/* Content */}
        <Suspense fallback={null}>
          {children}
          <Environment preset="city" />
        </Suspense>
        
        {/* Controls */}
        {enableControls && <OrbitControls enablePan={false} enableZoom={false} />}
        
        {/* Post-processing - conditionally rendered to prevent errors */}
        <Suspense fallback={null}>
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              intensity={0.5}
            />
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Animated particle field background
export function ParticleField({ count = 500 }) {
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);
  
  return (
    <Float speed={0.5} rotationIntensity={0} floatIntensity={1}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color="rgb(var(--accent-1))"
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.6}
        />
      </points>
    </Float>
  );
}