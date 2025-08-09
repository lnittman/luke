'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Base component for floating 3D icons
function FloatingIcon({ children, floatSpeed = 1, rotationSpeed = 0.5, floatIntensity = 1 }: any) {
  return (
    <Float 
      speed={floatSpeed} 
      rotationIntensity={rotationSpeed} 
      floatIntensity={floatIntensity}
    >
      {children}
    </Float>
  );
}

// 💬 react-lm - Chat bubble with pulsing effect
export function ChatIcon() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });
  
  return (
    <FloatingIcon>
      <group>
        {/* Chat bubble body */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#4ECDC4"
            metalness={0.2}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0}
            envMapIntensity={1}
          />
        </mesh>
        {/* Chat tail */}
        <mesh position={[-0.7, -0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.3, 0.6, 3]} />
          <meshPhysicalMaterial
            color="#4ECDC4"
            metalness={0.2}
            roughness={0.1}
          />
        </mesh>
      </group>
    </FloatingIcon>
  );
}

// 🌐 webs - Globe with orbiting particles
export function GlobeIcon() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
    }
  });
  
  // Create particle positions
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 1.2 + Math.random() * 0.3;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  return (
    <FloatingIcon floatSpeed={0.5}>
      <group ref={groupRef}>
        {/* Globe */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial
            color="#00D9FF"
            thickness={0.5}
            roughness={0}
            transmission={0.95}
            ior={1.5}
            chromaticAberration={0.05}
            backside={true}
          />
        </mesh>
        {/* Grid lines */}
        <mesh>
          <sphereGeometry args={[1.01, 32, 16]} />
          <meshBasicMaterial color="#00D9FF" wireframe opacity={0.3} transparent />
        </mesh>
        {/* Orbiting particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#00D9FF"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.8}
          />
        </points>
      </group>
    </FloatingIcon>
  );
}

// ⚽️ voet - Soccer ball with dynamic rotation
export function SoccerIcon() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <FloatingIcon floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#1A1A1A"
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* White patches */}
      <mesh>
        <icosahedronGeometry args={[1.02, 0]} />
        <meshBasicMaterial color="#FFFFFF" wireframe />
      </mesh>
    </FloatingIcon>
  );
}

// 🌸 ther - Blooming flower with animated petals
export function FlowerIcon() {
  const petalRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    petalRefs.current.forEach((petal, i) => {
      if (petal) {
        const offset = i * (Math.PI * 2 / 8);
        petal.rotation.z = Math.sin(state.clock.elapsedTime + offset) * 0.2;
        petal.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.1);
      }
    });
  });
  
  const Petal = ({ angle, index }: { angle: number; index: number }) => (
    <mesh
      ref={(el) => el && (petalRefs.current[index] = el)}
      position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0]}
      rotation={[0, 0, angle]}
    >
      <capsuleGeometry args={[0.3, 0.6, 16, 16]} />
      <meshPhysicalMaterial
        color="#FFB7C5"
        metalness={0}
        roughness={0.2}
        transmission={0.3}
        thickness={0.5}
        ior={1.3}
      />
    </mesh>
  );
  
  return (
    <FloatingIcon floatSpeed={0.3} rotationSpeed={0.2}>
      <group>
        {/* Center */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFD700"
            metalness={0.5}
            roughness={0.2}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Petals */}
        {Array.from({ length: 8 }, (_, i) => (
          <Petal key={i} angle={(i * Math.PI * 2) / 8} index={i} />
        ))}
      </group>
    </FloatingIcon>
  );
}

// 🎯 mind - Neural network visualization
export function MindIcon() {
  const nodesRef = useRef<THREE.Group>(null);
  const connectionsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      nodesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  const nodePositions = [
    [0, 0, 0],
    [1, 0, 0.5],
    [-1, 0, 0.5],
    [0, 1, -0.5],
    [0, -1, -0.5],
    [0.7, 0.7, 0],
    [-0.7, 0.7, 0],
    [0.7, -0.7, 0],
    [-0.7, -0.7, 0],
  ];
  
  return (
    <FloatingIcon floatSpeed={0.5}>
      <group>
        {/* Nodes */}
        <group ref={nodesRef}>
          {nodePositions.map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[i === 0 ? 0.2 : 0.1, 16, 16]} />
              <meshPhysicalMaterial
                color={i === 0 ? "#FF6B6B" : "#4ECDC4"}
                metalness={0.8}
                roughness={0.1}
                emissive={i === 0 ? "#FF6B6B" : "#4ECDC4"}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
        {/* Connections */}
        <group ref={connectionsRef}>
          {nodePositions.slice(1).map((pos, i) => (
            <mesh key={i} position={[pos[0] / 2, pos[1] / 2, pos[2] / 2]}>
              <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
              <meshBasicMaterial
                color="#4ECDC4"
                opacity={0.3}
                transparent
              />
            </mesh>
          ))}
        </group>
      </group>
    </FloatingIcon>
  );
}

// 🔧 code-agent - Gear system with interlocking motion
export function GearIcon() {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (gear1Ref.current) gear1Ref.current.rotation.z = time;
    if (gear2Ref.current) gear2Ref.current.rotation.z = -time * 1.5;
    if (gear3Ref.current) gear3Ref.current.rotation.z = time * 0.8;
  });
  
  const Gear = ({ radius = 1, teeth = 12 }) => {
    const shape = new THREE.Shape();
    const toothHeight = radius * 0.2;
    const toothWidth = (Math.PI * 2) / teeth / 2;
    
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
      
      if (i === 0) {
        shape.moveTo(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
      }
      
      shape.lineTo(
        Math.cos(angle) * (radius + toothHeight),
        Math.sin(angle) * (radius + toothHeight)
      );
      shape.lineTo(
        Math.cos(nextAngle) * (radius + toothHeight),
        Math.sin(nextAngle) * (radius + toothHeight)
      );
      shape.lineTo(
        Math.cos(nextAngle) * radius,
        Math.sin(nextAngle) * radius
      );
    }
    
    shape.closePath();
    
    return <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: false }]} />;
  };
  
  return (
    <FloatingIcon floatSpeed={0.3}>
      <group>
        <mesh ref={gear1Ref} position={[0, 0, 0]}>
          <Gear radius={0.8} teeth={16} />
          <meshPhysicalMaterial
            color="#95A5A6"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh ref={gear2Ref} position={[1.2, 0, 0.1]}>
          <Gear radius={0.5} teeth={12} />
          <meshPhysicalMaterial
            color="#7F8C8D"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh ref={gear3Ref} position={[-0.5, -0.8, -0.1]}>
          <Gear radius={0.4} teeth={10} />
          <meshPhysicalMaterial
            color="#BDC3C7"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </FloatingIcon>
  );
}

// 🚀 mhx - Rocket with particle trail
export function RocketIcon() {
  const rocketRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (rocketRef.current) {
      rocketRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
    
    if (trailRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.02;
        if (positions[i + 1] < -2) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 0.3;
          positions[i + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  // Create trail particles
  const particleCount = 100;
  const trailPositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    trailPositions[i * 3] = (Math.random() - 0.5) * 0.3;
    trailPositions[i * 3 + 1] = -Math.random() * 2;
    trailPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  
  return (
    <FloatingIcon floatSpeed={0.5}>
      <group>
        <group ref={rocketRef}>
          {/* Rocket body */}
          <mesh>
            <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
            <meshPhysicalMaterial
              color="#E74C3C"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          {/* Rocket nose */}
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.2, 0.4, 8]} />
            <meshPhysicalMaterial
              color="#C0392B"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          {/* Fins */}
          {[0, 120, 240].map((angle) => (
            <mesh
              key={angle}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.25,
                -0.3,
                Math.sin((angle * Math.PI) / 180) * 0.25
              ]}
              rotation={[0, (angle * Math.PI) / 180, 0]}
            >
              <boxGeometry args={[0.15, 0.3, 0.02]} />
              <meshPhysicalMaterial
                color="#34495E"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
        {/* Particle trail */}
        <points ref={trailRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={trailPositions}
              itemSize={3}
              args={[trailPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#FFA500"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.6}
          />
        </points>
      </group>
    </FloatingIcon>
  );
}

// 🦾 prosys - Mechanical arm with articulated joints
export function MechArmIcon() {
  const joint1Ref = useRef<THREE.Mesh>(null);
  const joint2Ref = useRef<THREE.Mesh>(null);
  const joint3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (joint1Ref.current) {
      joint1Ref.current.rotation.z = Math.sin(time) * 0.5;
    }
    if (joint2Ref.current) {
      joint2Ref.current.rotation.z = Math.sin(time * 1.5) * 0.7;
    }
    if (joint3Ref.current) {
      joint3Ref.current.rotation.x = Math.sin(time * 2) * 0.3;
    }
  });
  
  return (
    <FloatingIcon floatSpeed={0.2} rotationSpeed={0.1}>
      <group>
        {/* Base */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
          <meshPhysicalMaterial
            color="#2C3E50"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        {/* First segment */}
        <group ref={joint1Ref} position={[0, 0.1, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshPhysicalMaterial
              color="#34495E"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Second segment */}
          <group ref={joint2Ref} position={[0, 0.8, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshPhysicalMaterial
                color="#7F8C8D"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* End effector */}
            <group ref={joint3Ref} position={[0, 0.6, 0]}>
              <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshPhysicalMaterial
                  color="#E74C3C"
                  metalness={0.5}
                  roughness={0.2}
                  emissive="#E74C3C"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </FloatingIcon>
  );
}

// 🎵 sine - Music wave visualization
export function MusicIcon() {
  const waveRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (waveRef.current) {
      waveRef.current.children.forEach((bar, i) => {
        const time = state.clock.elapsedTime;
        bar.scale.y = 1 + Math.sin(time * 2 + i * 0.5) * 0.5;
        bar.position.y = bar.scale.y / 2;
      });
    }
  });
  
  return (
    <FloatingIcon floatSpeed={0.5}>
      <group ref={waveRef}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[(i - 5.5) * 0.2, 0, 0]}>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshPhysicalMaterial
              color={`hsl(${200 + i * 10}, 70%, 50%)`}
              metalness={0.5}
              roughness={0.2}
              emissive={`hsl(${200 + i * 10}, 70%, 30%)`}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    </FloatingIcon>
  );
}

// Map project IDs to their 3D icons
export const projectIcons = {
  'react-llm': ChatIcon,
  'webs-xyz': GlobeIcon,
  'voet': SoccerIcon,
  'ther': FlowerIcon,
  'mind': MindIcon,
  'code-agent': GearIcon,
  'mhx': RocketIcon,
  'prosys': MechArmIcon,
  'sine': MusicIcon,
} as const;