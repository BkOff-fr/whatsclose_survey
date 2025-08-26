'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  Smartphone,
  X
} from 'lucide-react';

interface StoryNavigationProps {
  currentScene: number;
  totalScenes: number;
  onNavigate: (scene: number) => void;
  onBackToChat: () => void;
}

export default function StoryNavigation({ 
  currentScene, 
  totalScenes, 
  onNavigate, 
  onBackToChat 
}: StoryNavigationProps) {
  const scenes = [
    { 
      title: "Producteurs Locaux", 
      description: "Des produits frais directement des fermes de votre région",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Casiers Intelligents 24/7", 
      description: "Récupérez vos courses quand vous voulez, où vous voulez",
      icon: <Package className="w-5 h-5" />,
      color: "from-blue-500 to-purple-500"
    },
    { 
      title: "Livraison Express", 
      description: "Du producteur au casier en moins de 24h",
      icon: <Truck className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500"
    },
    { 
      title: "Application Mobile", 
      description: "Commandez en 2 clics, payez en ligne, c'est simple !",
      icon: <Smartphone className="w-5 h-5" />,
      color: "from-green-500 to-teal-500"
    }
  ];

  const currentSceneData = scenes[currentScene - 1];

  return (
    <>
      {/* Skip/Close Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onBackToChat}
        className="fixed top-8 right-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all group"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
      </motion.button>

      {/* Main Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          {/* Scene Info */}
          <motion.div 
            key={currentScene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 max-w-md"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${currentSceneData.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              {currentSceneData.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentSceneData.title}
            </h3>
            <p className="text-gray-300 text-sm">
              {currentSceneData.description}
            </p>
          </motion.div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(currentScene - 1)}
              disabled={currentScene === 1}
              className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all backdrop-blur"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            {/* Progress Dots */}
            <div className="flex gap-2 px-4">
              {Array.from({ length: totalScenes }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => onNavigate(i + 1)}
                  whileHover={{ scale: 1.2 }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentScene - 1 
                      ? 'w-8 bg-gradient-to-r from-green-400 to-green-600' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  style={i === currentScene - 1 ? { 
                    boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)' 
                  } : {}}
                />
              ))}
            </div>
            
            {currentScene < totalScenes ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate(currentScene + 1)}
                className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all relative"
              >
                <ArrowRight className="w-5 h-5" />
                <div className="absolute inset-0 rounded-xl bg-green-500/30 blur-xl -z-10" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToChat}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all relative"
              >
                Continuer
                <div className="absolute inset-0 rounded-xl bg-green-500/30 blur-xl -z-10" />
              </motion.button>
            )}
          </div>

          {/* Keyboard Hints */}
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> Précédent
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> Suivant
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> Retour
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scene Indicator (Top) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2">
          <span className="text-white/60 text-sm">Étape</span>
          <span className="text-white font-bold text-lg mx-2">{currentScene}</span>
          <span className="text-white/60 text-sm">sur {totalScenes}</span>
        </div>
      </motion.div>
    </>
  );
}