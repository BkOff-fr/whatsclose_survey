'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function TypingIndicator() {
  useEffect(() => {
    gsap.to('.typing-dot', {
      y: -10,
      stagger: 0.15,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-4"
    >
      <div className="flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-gray-700/50">
        <div className="flex space-x-1">
          <div className="typing-dot w-2 h-2 bg-green-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-green-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-green-400 rounded-full" />
        </div>
        <span className="text-gray-400 text-sm">WhatsClose est en train d'écrire...</span>
      </div>
    </motion.div>
  );
}