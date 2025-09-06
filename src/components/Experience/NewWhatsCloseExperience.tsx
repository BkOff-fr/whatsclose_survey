'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Preload, PerformanceMonitor, Stats } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { UserData } from '@/types';
import { 
  Sparkles, 
  Compass, 
  X, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Home,
  Mouse,
  Move3d,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

// Dynamic imports avec loading states
const ImmersiveSurvey = dynamic(() => import('../Survey/ImmersiveSurvey'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

const InteractiveEcosystem = dynamic(() => import('./InteractiveEcosystem'), {
  ssr: false,
});

const SuccessScreen = dynamic(() => import('./SuccessScreen'), {
  ssr: false,
});

// Types
type ExperienceState = 'survey' | '3d-exploration' | 'success';

interface ScenePreset {
  name: string;
  icon: string;
  position: [number, number, number];
  target: [number, number, number];
  description: string;
}

// Canvas Loader
const CanvasLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
    />
  </div>
);

// Camera Controller Component
function CameraController({ 
  position, 
  autoRotate, 
  enabled 
}: { 
  position: [number, number, number];
  autoRotate: boolean;
  enabled: boolean;
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(...position);
  }, [position, camera]);
  
  return (
    <OrbitControls
      enabled={enabled}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={50}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      makeDefault
    />
  );
}

// Main Experience Component
export default function NewWhatsCloseExperience() {
  // State management
  const [experienceState, setExperienceState] = useState<ExperienceState>('survey');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [show3D, setShow3D] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'low'>('high');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 10, 20]);
  const [showStats, setShowStats] = useState(false);

  // Scene presets
  const scenePresets: ScenePreset[] = [
    {
      name: 'Vue d\'ensemble',
      icon: '🌍',
      position: [15, 15, 25],
      target: [0, 0, 0],
      description: 'Vue complète de l\'écosystème'
    },
    {
      name: 'Producteurs',
      icon: '🌾',
      position: [-10, 8, 15],
      target: [-10, 0, 0],
      description: 'Focus sur les fermes locales'
    },
    {
      name: 'Casiers',
      icon: '📦',
      position: [10, 8, 15],
      target: [10, 0, 0],
      description: 'Système de casiers intelligents'
    },
    {
      name: 'Livraison',
      icon: '🚚',
      position: [0, 20, 20],
      target: [0, 5, 0],
      description: 'Circuit de distribution'
    },
    {
      name: 'Application',
      icon: '📱',
      position: [0, 8, 12],
      target: [0, 3, 5],
      description: 'Interface mobile'
    }
  ];

  // Preload 3D scene
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow3D(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show help on first 3D exploration
  useEffect(() => {
    if (experienceState === '3d-exploration' && !localStorage.getItem('whatsclose_3d_visited')) {
      setShowHelp(true);
      setTimeout(() => {
        setShowHelp(false);
        localStorage.setItem('whatsclose_3d_visited', 'true');
      }, 5000);
    }
  }, [experienceState]);

  // Handle survey completion
  const handleSurveyComplete = (data: UserData) => {
    setUserData(data);
    setExperienceState('success');
  };

  // Handle scene interactions
  const handleSceneInteraction = (element: string) => {
    if (element === 'explore') {
      setExperienceState('3d-exploration');
      setAutoRotate(false);
      setShowControls(true);
    } else {
      setFocusedElement(element);
      const preset = scenePresets.find(p => p.name.toLowerCase().includes(element));
      if (preset) {
        setCameraPosition(preset.position);
      }
    }
  };

  // Handle restart
  const handleRestart = () => {
    setUserData(null);
    setExperienceState('survey');
    setFocusedElement(null);
    setAutoRotate(true);
    setCameraPosition([0, 10, 20]);
  };

  // Apply camera preset
  const applyCameraPreset = (preset: ScenePreset) => {
    setCameraPosition(preset.position);
    setAutoRotate(false);
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Scene Layer */}
      <AnimatePresence>
        {show3D && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: experienceState === '3d-exploration' ? 1 : 0.3,
              filter: experienceState === '3d-exploration' ? 'blur(0px)' : 'blur(2px)'
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{ 
              pointerEvents: experienceState === '3d-exploration' ? 'auto' : 'none' 
            }}
          >
            <Canvas 
              shadows 
              dpr={performanceMode === 'high' ? [1, 2] : [1, 1]}
              gl={{ 
                antialias: performanceMode === 'high',
                alpha: true 
              }}
            >
              <Suspense fallback={<CanvasLoader />}>
                <PerspectiveCamera 
                  makeDefault 
                  position={cameraPosition}
                  fov={60}
                  near={0.1}
                  far={1000}
                />
                
                <CameraController
                  position={cameraPosition}
                  autoRotate={autoRotate}
                  enabled={experienceState === '3d-exploration'}
                />

                <InteractiveEcosystem 
                  onInteraction={handleSceneInteraction}
                  userData={userData}
                />
                
                {performanceMode === 'high' && (
                  <PerformanceMonitor
                    onDecline={() => setPerformanceMode('low')}
                    flipflops={3}
                    avgMs={16}
                    factor={1}
                  />
                )}
                
                {showStats && <Stats />}
                
                <Preload all />
              </Suspense>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Layers */}
      <AnimatePresence mode="wait">
        {/* Survey Mode */}
        {experienceState === 'survey' && (
          <motion.div
            key="survey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <ImmersiveSurvey
              onComplete={handleSurveyComplete}
              onSceneInteraction={handleSceneInteraction}
            />
          </motion.div>
        )}

        {/* 3D Exploration Mode */}
        {experienceState === '3d-exploration' && (
          <motion.div
            key="3d-exploration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 pointer-events-none"
          >
            {/* Top Bar */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Compass className="w-8 h-8 text-green-500" />
                    Explorez l'écosystème WhatsClose
                  </h2>
                  <p className="text-gray-300">
                    Cliquez sur les éléments pour découvrir notre innovation
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Performance Toggle */}
                  <button
                    onClick={() => setPerformanceMode(prev => prev === 'high' ? 'low' : 'high')}
                    className="p-3 bg-white/10 backdrop-blur rounded-xl text-white hover:bg-white/20 transition-all"
                    title="Mode performance"
                  >
                    {performanceMode === 'high' ? '🚀' : '🔋'}
                  </button>
                  
                  {/* Stats Toggle */}
                  <button
                    onClick={() => setShowStats(prev => !prev)}
                    className="p-3 bg-white/10 backdrop-blur rounded-xl text-white hover:bg-white/20 transition-all"
                    title="Afficher stats"
                  >
                    📊
                  </button>
                  
                  {/* Help Button */}
                  <button
                    onClick={() => setShowHelp(prev => !prev)}
                    className="p-3 bg-white/10 backdrop-blur rounded-xl text-white hover:bg-white/20 transition-all"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  
                  {/* Back to Survey */}
                  <button
                    onClick={() => setExperienceState('survey')}
                    className="p-3 bg-green-500/20 backdrop-blur rounded-xl text-green-400 hover:bg-green-500/30 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Scene Presets */}
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute left-6 top-1/2 -translate-y-1/2 space-y-3 pointer-events-auto"
            >
              {scenePresets.map((preset, index) => (
                <motion.button
                  key={preset.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applyCameraPreset(preset)}
                  className="group flex items-center gap-3 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-black/80 hover:border-green-500/50 transition-all"
                  title={preset.description}
                >
                  <span className="text-2xl">{preset.icon}</span>
                  <div className="text-left hidden group-hover:block">
                    <div className="text-sm font-bold text-white">{preset.name}</div>
                    <div className="text-xs text-gray-400">{preset.description}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Bottom Controls */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto"
            >
              <div className="max-w-4xl mx-auto">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    {/* Play Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setAutoRotate(prev => !prev)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          autoRotate 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        Rotation auto
                      </button>
                      
                      <button
                        onClick={() => setCameraPosition([15, 15, 25])}
                        className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                        title="Réinitialiser vue"
                      >
                        <Home className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExperienceState('survey')}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-green-500/25 transition-all flex items-center gap-2"
                    >
                      Continuer le questionnaire
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Controls Help */}
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-6 border-t border-white/10 flex justify-center gap-8 text-xs text-gray-400"
                    >
                      <span className="flex items-center gap-2">
                        <Mouse className="w-4 h-4" />
                        Clic gauche : Rotation
                      </span>
                      <span className="flex items-center gap-2">
                        <Move3d className="w-4 h-4" />
                        Clic droit : Déplacement
                      </span>
                      <span className="flex items-center gap-2">
                        <Maximize className="w-4 h-4" />
                        Molette : Zoom
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Help Overlay */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur flex items-center justify-center pointer-events-auto"
                  onClick={() => setShowHelp(false)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black/80 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-8 max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">
                      🎮 Guide d'exploration
                    </h3>
                    <div className="space-y-4 text-gray-300">
                      <p>Bienvenue dans l'écosystème interactif WhatsClose !</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-400">Navigation :</h4>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>Rotation</strong> : Clic gauche + glisser</li>
                          <li>• <strong>Déplacement</strong> : Clic droit + glisser</li>
                          <li>• <strong>Zoom</strong> : Molette de souris</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-400">Interactions :</h4>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>Cliquez</strong> sur les éléments pour les explorer</li>
                          <li>• <strong>Survolez</strong> pour voir les animations</li>
                          <li>• Utilisez les <strong>raccourcis</strong> à gauche pour naviguer</li>
                        </ul>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowHelp(false)}
                      className="mt-6 w-full py-3 bg-green-500/20 text-green-400 rounded-xl font-semibold hover:bg-green-500/30 transition-all"
                    >
                      Compris !
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Success Screen */}
        {experienceState === 'success' && userData && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20"
          >
            <SuccessScreen 
              userData={userData} 
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Effects Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-noise mix-blend-overlay" />
        
        {/* Animated Gradient */}
        {experienceState === 'survey' && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-emerald-950/20 animate-gradient" />
          </div>
        )}
      </div>
    </div>
  );
}