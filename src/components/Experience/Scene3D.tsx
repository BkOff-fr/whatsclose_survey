'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float,
  MeshReflectorMaterial,
  PerspectiveCamera,
  Sparkles,
  Cloud,
  Stars,
  Text
} from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  onInteraction: (type: string) => void;
}

function LocalMarket({ position, onClick }: any) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        ref={meshRef} 
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Market Stand */}
        <mesh castShadow>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[1.5, 1, 4]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
        
        {/* Products */}
        <mesh position={[-0.5, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ff9f43" />
        </mesh>
        <mesh position={[0, 0.3, 0.2]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#10ac84" />
        </mesh>
        <mesh position={[0.5, 0.3, -0.1]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#ee5a6f" />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Producteur Local
        </Text>
        
        {/* Hover effect */}
        {hovered && (
          <mesh scale={[3, 3, 3]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1, 32]} />
            <meshBasicMaterial color="#4ade80" opacity={0.5} transparent />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function SmartLocker({ position }: any) {
  const meshRef = useRef<THREE.Group>(null);
  const [activeLocker, setActiveLocker] = useState<number | null>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Locker Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Locker Doors Grid */}
      {[...Array(12)].map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const isActive = activeLocker === i;
        
        return (
          <group key={i} onClick={() => setActiveLocker(isActive ? null : i)}>
            <mesh position={[-0.9 + col * 0.9, 1.3 - row * 0.9, 1.01]} castShadow>
              <boxGeometry args={[0.8, 0.8, 0.05]} />
              <meshStandardMaterial 
                color={isActive ? "#4ade80" : "#34495e"} 
                metalness={0.6} 
                roughness={0.3}
                emissive={isActive ? "#4ade80" : "#000000"}
                emissiveIntensity={isActive ? 0.2 : 0}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[-0.6 + col * 0.9, 1.3 - row * 0.9, 1.05]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="#95a5a6" metalness={0.9} />
            </mesh>
            {/* Number */}
            <Text
              position={[-0.9 + col * 0.9, 1.3 - row * 0.9, 1.08]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {(i + 1).toString().padStart(2, '0')}
            </Text>
          </group>
        );
      })}
      
      {/* Screen */}
      <mesh position={[0, 0, 1.02]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#3498db" />
      </mesh>
      
      {/* 24/7 Sign */}
      <Float speed={3} floatIntensity={0.2}>
        <group position={[0, 2.5, 0]}>
          <mesh>
            <boxGeometry args={[1.2, 0.4, 0.1]} />
            <meshBasicMaterial color="#e74c3c" />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            24/7
          </Text>
        </group>
      </Float>
      
      {/* Label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        Casiers Intelligents
      </Text>
    </group>
  );
}

function DeliveryPath() {
  const points = [];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const x = Math.sin(t * Math.PI * 2) * 5;
    const z = Math.cos(t * Math.PI * 2) * 5;
    points.push(new THREE.Vector3(x, 0.1, z));
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#4ade80" opacity={0.6} transparent />
    </line>
  );
}

function AnimatedProduct({ delay = 0 }: { delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay;
    const t = (time * 0.2) % 1;
    setProgress(t);
    
    if (meshRef.current) {
      const x = Math.sin(t * Math.PI * 2) * 5;
      const z = Math.cos(t * Math.PI * 2) * 5;
      meshRef.current.position.set(x, 0.5, z);
      meshRef.current.rotation.y = time;
    }
  });
  
  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial 
        color={progress < 0.5 ? "#ff9f43" : "#4ade80"} 
        emissive={progress > 0.8 ? "#4ade80" : "#000000"}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function CentralLogo() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={[0, 3, 0]}>
        <Text
          fontSize={1.5}
          color="#4ade80"
          anchorX="center"
          anchorY="middle"
        >
          WhatsClose
          <meshStandardMaterial
            color="#4ade80"
            metalness={0.3}
            roughness={0.4}
            emissive="#4ade80"
            emissiveIntensity={0.1}
          />
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Le local à portée de main
        </Text>
      </group>
    </Float>
  );
}

export default function Scene3D({ onInteraction }: Scene3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 15]} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -5]} intensity={0.5} color="#4ade80" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
      
      {/* Sky and environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Cloud position={[-10, 10, -10]} opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} />
      <Cloud position={[10, 12, -15]} opacity={0.4} speed={0.2} width={8} depth={1} segments={15} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1a1a"
          metalness={0.5}
        />
      </mesh>
      
      {/* Central Logo */}
      <CentralLogo />
      
      {/* Markets */}
      <LocalMarket position={[-8, 0, -5]} onClick={() => onInteraction('market')} />
      <LocalMarket position={[8, 0, -5]} onClick={() => onInteraction('market')} />
      <LocalMarket position={[0, 0, -8]} onClick={() => onInteraction('market')} />
      
      {/* Smart Locker */}
      <SmartLocker position={[0, 0, 5]} />
      
      {/* Delivery Path */}
      <DeliveryPath />
      
      {/* Animated Products */}
      <AnimatedProduct delay={0} />
      <AnimatedProduct delay={1} />
      <AnimatedProduct delay={2} />
      
      {/* Sparkles for magical effect */}
      <Sparkles count={200} scale={20} size={3} speed={0.5} color="#4ade80" />
    </>
  );
}