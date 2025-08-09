'use client'

import {
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from '@react-three/postprocessing'
import React, { Suspense } from 'react'
import * as THREE from 'three'

interface FloatingSceneProps {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  enableControls?: boolean
  fogColor?: string
  fogNear?: number
  fogFar?: number
  mousePosition?: { x: number; y: number }
  audioReactivity?: {
    bassLevel: number
    midLevel: number
    trebleLevel: number
    audioLevels: Float32Array
  }
}

interface SceneContextType {
  mousePosition?: { x: number; y: number }
  audioReactivity?: {
    bassLevel: number
    midLevel: number
    trebleLevel: number
    audioLevels: Float32Array
  }
}

export const SceneContext = React.createContext<SceneContextType>({})

export function FloatingScene({
  children,
  cameraPosition = [0, 0, 5],
  enableControls = false,
  fogColor,
  fogNear = 5,
  fogFar = 15,
}: FloatingSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {fogColor && <color args={[fogColor]} attach="background" />}
        {fogColor && <fog args={[fogColor, fogNear, fogFar]} attach="fog" />}

        <PerspectiveCamera fov={50} makeDefault position={cameraPosition} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight intensity={0.8} position={[10, 10, 10]} />
        <pointLight
          color="#4ECDC4"
          intensity={0.5}
          position={[-10, -10, -10]}
        />

        {/* Content */}
        <Suspense fallback={null}>
          {children}
          <Environment preset="city" />
        </Suspense>

        {/* Controls */}
        {enableControls && (
          <OrbitControls enablePan={false} enableZoom={false} />
        )}

        {/* Post-processing - disabled to prevent WebGL context issues */}
        {/* EffectComposer is causing 'Cannot read properties of null (reading alpha')' errors */}
      </Canvas>
    </div>
  )
}

// Animated particle field background
export function ParticleField({ count = 500 }) {
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])

  return (
    <Float floatIntensity={1} rotationIntensity={0} speed={0.5}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[positions, 3]}
            array={positions}
            attach="attributes-position"
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          blending={THREE.AdditiveBlending}
          color="rgb(var(--accent-1))"
          opacity={0.6}
          size={0.01}
          transparent
        />
      </points>
    </Float>
  )
}
