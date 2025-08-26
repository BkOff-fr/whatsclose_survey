'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-green-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
        >
          <Sparkle className="w-12 h-12 text-white" />
          <div className="absolute inset-0 rounded-3xl bg-green-400/30 blur-2xl animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold text-white mb-4"
        >
          WhatsClose
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-400 mb-8"
        >
          Chargement de l'expérience immersive...
        </motion.p>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ width: "100%" }}
          />
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay }}
              style={{ boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)' }}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}