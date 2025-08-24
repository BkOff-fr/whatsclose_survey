'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [progress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-20 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="h-1 bg-gray-800 relative overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-green-500 to-green-400 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
        
        {/* Sparkle effect at the end of progress bar */}
        {progress > 0 && progress < 100 && (
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: `${progress}%` }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
          </motion.div>
        )}
      </div>
      
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-white font-bold">WhatsClose Survey</h1>
            <p className="text-xs text-gray-400">Découvrons vos besoins ensemble</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Étape {currentStep} sur {totalSteps}
          </div>
          <motion.div
            className="text-sm font-medium text-green-400"
            key={progress}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}