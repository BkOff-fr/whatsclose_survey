'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Users, Shield } from 'lucide-react';
import Scene3D from './Scene3D';
import ChatSurvey from '../Survey/ChatSurvey3D';
import StoryNavigation from '../Survey/StoryNavigation';
import CameraController from './CameraController';

export default function WhatsCloseExperience() {
  const [mode, setMode] = useState<'chat' | 'story'>('chat');
  const [currentScene, setCurrentScene] = useState(1);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleStartStory = () => {
    setMode('story');
    setCurrentScene(1);
  };

  const handleBackToChat = () => {
    setMode('chat');
  };

  const handleNavigate = (scene: number) => {
    if (scene >= 1 && scene <= 4) {
      setCurrentScene(scene);
    }
  };

  const handleComplete = (data: any) => {
    setUserData(data);
    setSurveyCompleted(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (mode === 'story') {
        if (e.key === 'ArrowRight' && currentScene < 4) {
          setCurrentScene(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && currentScene > 1) {
          setCurrentScene(prev => prev - 1);
        } else if (e.key === 'Escape') {
          handleBackToChat();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mode, currentScene]);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Scene */}
      <div className={`absolute inset-0 transition-all duration-1000 ${mode === 'chat' ? '' : 'scale-105'}`}>
        <Canvas shadows dpr={[1, 2]}>
          <CameraController mode={mode} sceneIndex={currentScene} />
          <Scene3D mode={mode} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Vignette Effect for Chat Mode */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          mode === 'chat' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 70%)'
        }}
      />

      {/* Chat Interface */}
      <AnimatePresence>
        {mode === 'chat' && !surveyCompleted && (
          <ChatSurvey 
            onComplete={handleComplete}
            onStartStory={handleStartStory}
            isVisible={mode === 'chat'}
          />
        )}
      </AnimatePresence>

      {/* Story Navigation */}
      <AnimatePresence>
        {mode === 'story' && (
          <StoryNavigation 
            currentScene={currentScene}
            totalScenes={4}
            onNavigate={handleNavigate}
            onBackToChat={handleBackToChat}
          />
        )}
      </AnimatePresence>

      {/* Success Screen */}
      <AnimatePresence>
        {surveyCompleted && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="bg-gradient-to-br from-green-500/10 via-black/50 to-green-600/10 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-12 max-w-lg text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(74, 222, 128, 0.5)' }}
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                Bienvenue dans le futur, {userData.firstName} !
              </h2>
              
              <p className="text-gray-300 mb-8 text-lg">
                Vous faites partie des pionniers qui vont transformer la consommation locale.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Accès prioritaire</p>
                  <p className="text-xs text-gray-500 mt-1">Lancement {userData.city}</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">Avantages exclusifs</p>
                  <p className="text-xs text-gray-500 mt-1">1 mois offert</p>
                </div>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all transform hover:scale-105"
              >
                Recommencer l'expérience
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}