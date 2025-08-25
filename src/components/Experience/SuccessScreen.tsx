'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessScreenProps {
  userData: {
    firstName?: string;
    email?: string;
    city?: string;
  };
}

export default function SuccessScreen({ userData }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-3xl p-12 max-w-lg text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Merci {userData?.firstName} ! 🎉
        </h2>
        
        <p className="text-gray-300 mb-6">
          Vous faites partie des pionniers de WhatsClose. 
          Nous allons révolutionner ensemble l'accès aux produits locaux !
        </p>
        
        <div className="space-y-3">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-green-400 font-semibold mb-1">📧 Email de confirmation envoyé</p>
            <p className="text-xs text-gray-400">Vérifiez votre boîte de réception</p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-green-400 font-semibold mb-1">📍 Zone de lancement</p>
            <p className="text-xs text-gray-400">{userData?.city || 'Votre région'} - Q1 2025</p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-green-400 font-semibold mb-1">🎁 Avantage early adopter</p>
            <p className="text-xs text-gray-400">1 mois gratuit à l'ouverture</p>
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
        >
          Recommencer l'expérience
        </button>
      </motion.div>
    </motion.div>
  );
}