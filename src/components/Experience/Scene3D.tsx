'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float,
  MeshReflectorMaterial,
  Text,
  Cloud,
  Stars,
  Ring,
  Html,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  mode: 'chat' | 'story';
}

// Floating Particles System
function FloatingParticles() {
  const points = useRef<THREE.Points>(null);
  const particlesCount = 500;
  
  const positions = new Float32Array(particlesCount * 3);
  for(let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if(points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#4ade80" 
        transparent 
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Ambient Environment
function AmbientEnvironment() {
  return (
    <>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Cloud
        position={[-20, 10, -30]}
        opacity={0.3}
        speed={0.2}
        color="#4ade80"
      />
      <Cloud
        position={[20, 15, -40]}
        opacity={0.2}
        speed={0.1}
        color="#22c55e"
      />
      <Cloud
        position={[0, 20, -50]}
        opacity={0.15}
        speed={0.15}
        color="#10b981"
      />
      <FloatingParticles />
      <Sparkles count={200} scale={50} size={2} speed={0.5} color="#4ade80" opacity={0.5} />
    </>
  );
}

// Scene 1: Local Market
function SceneMarket({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Market Stand Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 0.2, 4]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            metalness={0.3} 
            roughness={0.7}
          />
        </mesh>
        
        {/* Market Roof */}
        <mesh position={[0, 3, 0]} castShadow>
          <coneGeometry args={[3.5, 3, 4]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            emissive="#ff6b6b" 
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Product Displays */}
        {[
          { pos: [-1.5, 0.5, 0], color: '#ff9f43', scale: 1 },
          { pos: [0, 0.5, 0.5], color: '#10ac84', scale: 0.8 },
          { pos: [1.5, 0.5, -0.3], color: '#ee5a6f', scale: 0.9 },
          { pos: [-0.8, 0.5, -0.8], color: '#f368e0', scale: 0.7 },
          { pos: [0.8, 0.5, 0.8], color: '#48dbfb', scale: 0.75 }
        ].map((item, i) => (
          <mesh key={i} position={item.pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.6 * item.scale, 0.6 * item.scale, 0.6 * item.scale]} />
            <meshStandardMaterial 
              color={item.color}
              emissive={item.color}
              emissiveIntensity={hovered ? 0.2 : 0.05}
            />
          </mesh>
        ))}
        
        {/* Floating Label */}
        <Float speed={2} floatIntensity={0.5}>
          <Text 
            position={[0, 5, 0]} 
            fontSize={0.5} 
            color="#ffffff" 
            anchorX="center"
            font="/fonts/inter-bold.woff"
          >
            Producteurs Locaux
            <meshStandardMaterial
              color="#ffffff"
              emissive="#4ade80"
              emissiveIntensity={0.2}
            />
          </Text>
        </Float>
        
        {/* Hover Glow Effect */}
        {hovered && (
          <mesh scale={[8, 0.1, 6]} position={[0, -0.1, 0]}>
            <planeGeometry />
            <meshBasicMaterial 
              color="#4ade80" 
              opacity={0.3} 
              transparent 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Scene 2: Smart Locker
function SceneLocker({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeLockers, setActiveLockers] = useState<number[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newActive = Array.from({ length: 3 }, () => Math.floor(Math.random() * 12));
      setActiveLockers(newActive);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Main Structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[8, 10, 4]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Locker Grid */}
      {[...Array(12)].map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const isActive = activeLockers.includes(i);
        
        return (
          <group key={i}>
            <mesh position={[-2.5 + col * 2.5, 3 - row * 2, 2.1]} castShadow>
              <boxGeometry args={[2, 1.8, 0.1]} />
              <meshStandardMaterial 
                color={isActive ? "#4ade80" : "#0f172a"}
                emissive={isActive ? "#4ade80" : "#000000"}
                emissiveIntensity={isActive ? 0.3 : 0}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[-2.5 + col * 2.5 + 0.7, 3 - row * 2, 2.2]}>
              <boxGeometry args={[0.4, 0.08, 0.08]} />
              <meshStandardMaterial color="#95a5a6" metalness={0.9} />
            </mesh>
          </group>
        );
      })}
      
      {/* Digital Screen */}
      <mesh position={[0, 0, 2.05]}>
        <planeGeometry args={[6, 1]} />
        <meshBasicMaterial color="#3498db">
          <Html transform occlude position={[0, 0, 0.01]}>
            <div className="w-48 h-8 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center rounded">
              <span className="text-white font-bold text-xs">INTERFACE DIGITALE</span>
            </div>
          </Html>
        </meshBasicMaterial>
      </mesh>
      
      {/* 24/7 Sign */}
      <Float speed={2} floatIntensity={0.5}>
        <group position={[0, 6, 0]}>
          <mesh>
            <boxGeometry args={[2, 0.8, 0.2]} />
            <meshStandardMaterial 
              color="#e74c3c"
              emissive="#e74c3c"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            24/7
          </Text>
        </group>
      </Float>
      
      <Text position={[0, -6, 0]} fontSize={0.4} color="#ffffff" anchorX="center">
        Casiers Intelligents
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4ade80"
          emissiveIntensity={0.2}
        />
      </Text>
    </group>
  );
}

// Scene 3: Delivery System
function SceneDelivery({ position }: { position: [number, number, number] }) {
  const truckRef = useRef<THREE.Mesh>(null);
  const packageRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (truckRef.current) {
      const t = state.clock.elapsedTime * 0.3;
      truckRef.current.position.x = Math.sin(t) * 8;
      truckRef.current.position.z = Math.cos(t) * 8;
      truckRef.current.rotation.y = -t + Math.PI / 2;
    }
    
    packageRefs.current.forEach((ref, i) => {
      if (ref) {
        const offset = (i * Math.PI * 2) / 3;
        const t = state.clock.elapsedTime * 0.5 + offset;
        ref.position.x = Math.sin(t) * 5;
        ref.position.z = Math.cos(t) * 5;
        ref.rotation.y = t;
      }
    });
  });

  return (
    <group position={position}>
      {/* Delivery Truck */}
      <mesh ref={truckRef} castShadow position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 1.5]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Packages */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) packageRefs.current[i] = el;
          }}
          position={[0, 0.5, 0]}
          castShadow
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial 
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Delivery Path */}
      <Ring 
        args={[7, 9, 64]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.1, 0]}
      >
        <meshBasicMaterial 
          color="#4ade80" 
          opacity={0.3} 
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Ring>
      
      <Ring 
        args={[4.5, 5.5, 64]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.1, 0]}
      >
        <meshBasicMaterial 
          color="#22c55e" 
          opacity={0.2} 
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Ring>
      
      <Text position={[0, 4, 0]} fontSize={0.5} color="#ffffff" anchorX="center">
        Livraison Express
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4ade80"
          emissiveIntensity={0.2}
        />
      </Text>
    </group>
  );
}

// Scene 4: Mobile App
function SceneApp({ position }: { position: [number, number, number] }) {
  const phoneRef = useRef<THREE.Group>(null);
  const [screenActive, setScreenActive] = useState(true);
  
  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
      phoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setScreenActive(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={phoneRef} position={position}>
        {/* Phone Body */}
        <mesh castShadow>
          <boxGeometry args={[3, 6, 0.3]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[2.7, 5.7]} />
          <meshStandardMaterial 
            color={screenActive ? "#4ade80" : "#1f2937"}
            emissive={screenActive ? "#4ade80" : "#000000"}
            emissiveIntensity={screenActive ? 0.2 : 0}
          />
        </mesh>
        
        {/* UI Elements */}
        <Html position={[0, 0, 0.2]} transform occlude>
          <div className={`w-32 h-64 rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
            screenActive ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gray-800'
          }`}>
            <div className="text-white text-center">
              <div className="text-2xl font-bold mb-2">WhatsClose</div>
              <div className="text-xs mb-4">Commandez en 2 clics</div>
              {screenActive && (
                <div className="space-y-2">
                  <div className="bg-white/20 rounded p-2 text-xs">🥬 Légumes frais</div>
                  <div className="bg-white/20 rounded p-2 text-xs">🥖 Pain artisanal</div>
                  <div className="bg-white/20 rounded p-2 text-xs">🧀 Fromages locaux</div>
                </div>
              )}
            </div>
          </div>
        </Html>
        
        {/* Notification Badge */}
        {screenActive && (
          <Float speed={3} floatIntensity={1}>
            <mesh position={[1.2, 2.5, 0.5]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        )}
        
        <Text position={[0, 4, 0]} fontSize={0.5} color="#ffffff" anchorX="center">
          Application Mobile
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4ade80"
            emissiveIntensity={0.2}
          />
        </Text>
      </group>
    </Float>
  );
}

export default function Scene3D({ mode }: Scene3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -5]} intensity={0.5} color="#4ade80" />
      <pointLight position={[10, 10, -5]} intensity={0.5} color="#22c55e" />
      <pointLight position={[0, 15, 0]} intensity={0.3} color="#ffffff" />
      
      {/* Environment */}
      <AmbientEnvironment />
      
      {/* Scene Elements */}
      <SceneMarket position={[-15, 0, -10]} />
      <SceneLocker position={[15, 0, -10]} />
      <SceneDelivery position={[0, 0, -30]} />
      <SceneApp position={[0, 0, 10]} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.8}
        />
      </mesh>
    </>
  );
}