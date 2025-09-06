'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Float,
  MeshReflectorMaterial,
  Text,
  Cloud,
  Stars,
  Sparkles,
  Trail,
  Html,
  Sphere,
  Box,
  Cylinder,
  useTexture,
  Environment,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveEcosystemProps {
  onInteraction?: (element: string) => void;
  userData?: any;
}

// Producteur Local Component
function LocalProducer({ position, onClick }: { position: [number, number, number], onClick?: () => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        ref={meshRef} 
        position={position}
        onClick={() => {
          setClicked(true);
          onClick?.();
          setTimeout(() => setClicked(false), 200);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Farm Building */}
        <mesh castShadow>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial 
            color={hovered ? "#4ade80" : "#2563eb"} 
            emissive={hovered ? "#4ade80" : "#1e40af"}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[2.5, 1.5, 4]} />
          <meshStandardMaterial 
            color="#dc2626" 
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Growing Products Animation */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * 2;
          const z = Math.sin(angle) * 2;
          
          return (
            <Float key={i} speed={3} floatIntensity={1}>
              <mesh position={[x, 0.5, z]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                  color={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][i]}
                  emissive={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][i]}
                  emissiveIntensity={0.3}
                />
              </mesh>
            </Float>
          );
        })}

        {/* Interactive Label */}
        <Html position={[0, 3, 0]} center occlude>
          <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            hovered ? 'bg-green-500 text-white scale-110' : 'bg-white/80 text-gray-800'
          }`}>
            Ferme Locale
          </div>
        </Html>

        {/* Click Effect */}
        {clicked && (
          <mesh scale={[5, 0.1, 5]} position={[0, -1, 0]}>
            <cylinderGeometry args={[1, 1, 0.1, 32]} />
            <meshBasicMaterial 
              color="#4ade80" 
              transparent 
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Smart Locker System
function SmartLockerSystem({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [openLockers, setOpenLockers] = useState<number[]>([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newOpen = Array.from({ length: 2 }, () => Math.floor(Math.random() * 9));
      setOpenLockers(newOpen);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5, 4, 2]} />
        <meshStandardMaterial 
          color="#1f2937"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Locker Grid 3x3 */}
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const isOpen = openLockers.includes(i);
        
        return (
          <group key={i}>
            {/* Locker Door */}
            <mesh 
              position={[-1.5 + col * 1.5, 1 - row * 1.2, 1.05]}
              rotation={[0, isOpen ? -0.5 : 0, 0]}
              castShadow
            >
              <boxGeometry args={[1.3, 1, 0.1]} />
              <meshStandardMaterial 
                color={isOpen ? "#4ade80" : "#374151"}
                emissive={isOpen ? "#4ade80" : "#000000"}
                emissiveIntensity={isOpen ? 0.2 : 0}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Inside Content (when open) */}
            {isOpen && (
              <Float speed={4} floatIntensity={0.5}>
                <mesh position={[-1.5 + col * 1.5, 1 - row * 1.2, 0.8]}>
                  <boxGeometry args={[0.5, 0.5, 0.5]} />
                  <meshStandardMaterial 
                    color="#f59e0b"
                    emissive="#f59e0b"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              </Float>
            )}

            {/* Door Handle */}
            <mesh position={[-1.5 + col * 1.5 + 0.5, 1 - row * 1.2, 1.1]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial 
                color="#d1d5db"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        );
      })}

      {/* Digital Display */}
      <mesh position={[0, 2.5, 1.02]}>
        <planeGeometry args={[4, 0.8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <Html position={[0, 2.5, 1.03]} transform occlude>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded text-white text-sm font-bold animate-pulse">
          OUVERT 24/7 • SANS CONTACT
        </div>
      </Html>

      {/* Ground Light Effect */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 4, 32]} />
        <meshBasicMaterial 
          color="#4ade80"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Delivery Flow System
function DeliveryFlow() {
  const particlesRef = useRef<THREE.Points>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Animate delivery particles along path
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const offset = i / 3 * 0.1;
        positions[i] = Math.sin(t + offset) * 10;
        positions[i + 1] = 2 + Math.sin(t * 2 + offset) * 0.5;
        positions[i + 2] = Math.cos(t + offset) * 10;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate trail
    if (trailRef.current) {
      trailRef.current.rotation.y = t * 0.5;
    }
  });

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * 10;
      positions[i * 3 + 1] = 2;
      positions[i * 3 + 2] = Math.sin(angle) * 10;
    }
    return positions;
  }, []);

  return (
    <>
      {/* Delivery Path Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={30}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#4ade80"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Delivery Vehicle */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={trailRef}>
          <mesh position={[8, 2, 0]} castShadow>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial 
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.1}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          
          {/* Package Trail */}
          <Trail
            width={3}
            length={10}
            color="#4ade80"
            attenuation={(t) => t * t}
          >
            <mesh position={[8, 2, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
            </mesh>
          </Trail>
        </group>
      </Float>

      {/* Path Visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[8, 12, 64, 1, 0, Math.PI * 2]} />
        <meshBasicMaterial 
          color="#4ade80"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// Mobile App Interface
function MobileAppInterface({ position }: { position: [number, number, number] }) {
  const [notifications, setNotifications] = useState(0);
  const phoneRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      if (hovered) {
        phoneRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group 
        ref={phoneRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Phone Frame */}
        <mesh castShadow>
          <boxGeometry args={[2, 4, 0.2]} />
          <meshStandardMaterial 
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.8, 3.8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Interactive UI */}
        <Html position={[0, 0, 0.12]} transform occlude>
          <div className="w-44 h-80 bg-gradient-to-b from-green-900 to-black rounded-lg p-4 relative">
            {/* Header */}
            <div className="text-white text-center mb-4">
              <div className="text-xl font-bold mb-1">WhatsClose</div>
              <div className="text-xs opacity-80">Vos producteurs locaux</div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['🥬', '🥖', '🧀', '🍎'].map((emoji, i) => (
                <div 
                  key={i}
                  className={`bg-white/10 rounded-lg p-3 text-center transition-all ${
                    i === notifications ? 'ring-2 ring-green-400 scale-105' : ''
                  }`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-xs text-white/70">Dispo</div>
                </div>
              ))}
            </div>

            {/* Order Button */}
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold text-sm animate-pulse">
              Commander →
            </button>

            {/* Notification Badge */}
            {notifications > 0 && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                {notifications}
              </div>
            )}
          </div>
        </Html>

        {/* Glow Effect */}
        {hovered && (
          <mesh scale={[3, 5, 1]} position={[0, 0, -0.5]}>
            <planeGeometry />
            <meshBasicMaterial 
              color="#4ade80"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Main Ecosystem Component
export default function InteractiveEcosystem({ onInteraction, userData }: InteractiveEcosystemProps) {
  const { camera } = useThree();
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  const handleElementClick = (element: string) => {
    setFocusedElement(element);
    onInteraction?.(element);
    
    // Camera focus animation
    const positions: Record<string, THREE.Vector3> = {
      producer: new THREE.Vector3(-10, 5, 10),
      locker: new THREE.Vector3(10, 5, 10),
      delivery: new THREE.Vector3(0, 10, 15),
      app: new THREE.Vector3(0, 5, 8),
    };
    
    if (positions[element]) {
      // Animate camera to focus on element
      // (You would implement smooth camera transition here)
    }
  };

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4ade80" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
      <Cloud position={[0, 20, -30]} opacity={0.2} color="#4ade80" speed={0.2} />
      <Sparkles count={100} scale={30} size={2} speed={0.5} color="#4ade80" opacity={0.5} />

      {/* Main Elements */}
      <LocalProducer 
        position={[-10, 0, 0]} 
        onClick={() => handleElementClick('producer')}
      />
      
      <SmartLockerSystem position={[10, 0, 0]} />
      
      <DeliveryFlow />
      
      <MobileAppInterface position={[0, 3, 5]} />

      {/* Ground with Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={50}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.5}
        />
      </mesh>

      {/* Info Panel */}
      {focusedElement && (
        <Html position={[0, 8, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white max-w-md"
          >
            <h3 className="text-xl font-bold mb-2">
              {focusedElement === 'producer' && 'Producteurs Locaux'}
              {focusedElement === 'locker' && 'Casiers Intelligents'}
              {focusedElement === 'delivery' && 'Livraison Express'}
              {focusedElement === 'app' && 'Application Mobile'}
            </h3>
            <p className="text-sm text-gray-300">
              {focusedElement === 'producer' && 'Des fermes locales partenaires garantissent la fraîcheur et la qualité des produits.'}
              {focusedElement === 'locker' && 'Récupérez vos courses 24/7 dans nos casiers réfrigérés sécurisés.'}
              {focusedElement === 'delivery' && 'Livraison quotidienne directe du producteur au casier.'}
              {focusedElement === 'app' && 'Commandez en 2 clics et recevez des notifications en temps réel.'}
            </p>
            <button
              onClick={() => setFocusedElement(null)}
              className="mt-4 text-xs text-green-400 hover:text-green-300"
            >
              Fermer ×
            </button>
          </motion.div>
        </Html>
      )}

      {/* User Personalization */}
      {userData?.city && (
        <Text
          position={[0, 10, -20]}
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Bientôt à {userData.city}
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4ade80"
            emissiveIntensity={0.2}
          />
        </Text>
      )}
    </>
  );
}