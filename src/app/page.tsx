'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Loading Screen amélioré
const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-emerald-950/10 animate-gradient" />
    </div>

    {/* Loading content */}
    <div className="relative z-10 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
      >
        <Sparkles className="w-12 h-12 text-white" />
        <div className="absolute inset-0 rounded-3xl bg-green-400/30 blur-2xl animate-pulse" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-6xl font-bold text-white mb-4"
      >
        WhatsClose
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-gray-400 mb-8"
      >
        Préparation de votre expérience immersive...
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto backdrop-blur"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ width: "100%" }}
        />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-gray-500"
      >
        💡 Astuce: Utilisez votre souris pour explorer l'environnement 3D
      </motion.div>
    </div>

    {/* Floating orbs */}
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 bg-green-500/10 rounded-full blur-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </div>
);

// Import dynamique avec SSR désactivé
const NewWhatsCloseExperience = dynamic(
  () => import('@/components/Experience/NewWhatsCloseExperience'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

export default function Home() {
  return (
    <main className="min-h-screen relative bg-black overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <NewWhatsCloseExperience />
      </Suspense>
    </main>
  );
}