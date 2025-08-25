'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import Scene3D from './Scene3D';
import ChatSurvey from '../Survey/ChatSurvey3D';
import SuccessScreen from './SuccessScreen';

export default function WhatsCloseExperience() {
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleSceneInteraction = (type: string) => {
    if (type === 'market') {
      setShowInfo(true);
      setTimeout(() => setShowInfo(false), 3000);
    }
  };

  const handleSurveyComplete = (data: any) => {
    setUserData(data);
    setSurveyCompleted(true);
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 8, 15], fov: 60 }}>
        <Scene3D onInteraction={handleSceneInteraction} />
        <Environment preset="city" />
      </Canvas>

      {/* Info Popup */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 max-w-md z-40"
          >
            <h3 className="text-xl font-bold text-white mb-2">🌱 Circuit Court Révolutionné</h3>
            <p className="text-gray-300 text-sm">
              WhatsClose connecte directement producteurs locaux et consommateurs. 
              Commandez sur l'app, récupérez dans nos casiers intelligents 24/7. 
              Simple, local, accessible !
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Instructions */}
      {!surveyCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="bg-black/80 backdrop-blur text-white px-6 py-3 rounded-2xl font-medium shadow-lg border border-green-500/30 flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-green-400" />
            <span>Explorez la scène 3D avec votre souris !</span>
          </div>
        </motion.div>
      )}

      {/* Survey Chat */}
      <ChatSurvey onComplete={handleSurveyComplete} />

      {/* Success Screen */}
      <AnimatePresence>
        {surveyCompleted && userData && (
          <SuccessScreen userData={userData} />
        )}
      </AnimatePresence>
    </div>
  );
}