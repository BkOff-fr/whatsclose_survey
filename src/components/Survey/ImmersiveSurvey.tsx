'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Heart, 
  Clock, 
  Package,
  Sparkles,
  ChevronRight,
  User,
  Mail,
  Building
} from 'lucide-react';
import { UserData } from '@/types';

interface ImmersiveSurveyProps {
  onComplete: (data: UserData) => void;
  onSceneInteraction?: (scene: string) => void;
}

const questions = [
  {
    id: 'welcome',
    title: 'Imaginez un monde',
    subtitle: 'où vos produits locaux préférés sont disponibles 24/7',
    description: 'WhatsClose révolutionne votre façon de consommer local. Prêt pour l\'aventure ?',
    type: 'intro',
    backgroundGradient: 'from-emerald-900/20 via-black to-green-950/20'
  },
  {
    id: 'firstName',
    title: 'Commençons par nous connaître',
    subtitle: 'Quel est votre prénom ?',
    type: 'input',
    field: 'firstName',
    placeholder: 'Entrez votre prénom...',
    icon: <User className="w-6 h-6" />,
    backgroundGradient: 'from-blue-900/20 via-black to-purple-950/20'
  },
  {
    id: 'city',
    title: (data: UserData) => `Enchanté ${data.firstName} !`,
    subtitle: 'Dans quelle ville souhaitez-vous voir WhatsClose ?',
    type: 'input',
    field: 'city',
    placeholder: 'Ex: Lyon, Paris, Marseille...',
    icon: <Building className="w-6 h-6" />,
    backgroundGradient: 'from-purple-900/20 via-black to-pink-950/20'
  },
  {
    id: 'consumption',
    title: 'Vos habitudes locales',
    subtitle: 'À quelle fréquence consommez-vous des produits locaux ?',
    type: 'select',
    field: 'localConsumption',
    options: [
      { 
        value: 'daily', 
        label: 'Chaque jour', 
        description: 'Je suis un vrai locavore',
        icon: '🌟',
        gradient: 'from-yellow-500 to-orange-500'
      },
      { 
        value: 'weekly', 
        label: 'Chaque semaine', 
        description: 'C\'est mon rituel hebdomadaire',
        icon: '❤️',
        gradient: 'from-pink-500 to-red-500'
      },
      { 
        value: 'monthly', 
        label: 'Occasionnellement', 
        description: 'Quand j\'en ai l\'occasion',
        icon: '🌱',
        gradient: 'from-green-500 to-teal-500'
      },
      { 
        value: 'rarely', 
        label: 'Rarement', 
        description: 'J\'aimerais le faire plus souvent',
        icon: '🔄',
        gradient: 'from-blue-500 to-purple-500'
      }
    ],
    backgroundGradient: 'from-orange-900/20 via-black to-red-950/20'
  },
  {
    id: 'vision',
    title: 'Découvrez l\'écosystème WhatsClose',
    subtitle: 'Une révolution locale en 4 innovations',
    description: 'Explorez notre vision en 3D. Cliquez sur les éléments pour interagir.',
    type: 'experience',
    backgroundGradient: 'from-green-900/20 via-black to-emerald-950/20'
  },
  {
    id: 'features',
    title: 'Qu\'est-ce qui vous inspire le plus ?',
    subtitle: 'Sélectionnez toutes les innovations qui vous parlent',
    type: 'multiselect',
    field: 'impressedBy',
    options: [
      {
        value: 'lockers',
        label: 'Casiers Intelligents',
        description: 'Récupérez vos produits 24/7',
        icon: '📦',
        gradient: 'from-blue-500 to-indigo-500'
      },
      {
        value: 'local',
        label: 'Circuit Ultra-Court',
        description: 'Du producteur à vous en 24h',
        icon: '🌾',
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        value: 'app',
        label: 'Application Intuitive',
        description: 'Commandez en 2 clics',
        icon: '📱',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        value: 'fresh',
        label: 'Fraîcheur Garantie',
        description: 'Produits du jour disponibles',
        icon: '🥬',
        gradient: 'from-lime-500 to-green-500'
      }
    ],
    backgroundGradient: 'from-indigo-900/20 via-black to-purple-950/20'
  },
  {
    id: 'email',
    title: (data: UserData) => `${data.firstName}, rejoignez les pionniers`,
    subtitle: 'Soyez parmi les premiers à ${data.city || "votre ville"}',
    description: 'Recevez un accès prioritaire et 1 mois offert au lancement',
    type: 'input',
    field: 'email',
    placeholder: 'votre@email.com',
    inputType: 'email',
    icon: <Mail className="w-6 h-6" />,
    backgroundGradient: 'from-violet-900/20 via-black to-indigo-950/20'
  }
];

export default function ImmersiveSurvey({ onComplete, onSceneInteraction }: ImmersiveSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleNext = (value?: any) => {
    if (currentQuestion.field) {
      setUserData(prev => ({
        ...prev,
        [currentQuestion.field!]: value || inputValue || selectedOptions
      }));
    }

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setInputValue('');
        setSelectedOptions([]);
      } else {
        onComplete(userData as UserData);
      }
      setIsTransitioning(false);
    }, 500);
  };

  const handleSelectOption = (value: string) => {
    if (currentQuestion.type === 'multiselect') {
      setSelectedOptions(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      handleNext(value);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at 50% 50%, transparent, black), linear-gradient(135deg, ${currentQuestion.backgroundGradient})`
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="relative h-full flex items-center justify-center p-8"
        >
          <div className="max-w-4xl w-full">
            {/* Question Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {typeof currentQuestion.title === 'function' 
                  ? currentQuestion.title(userData as UserData)
                  : currentQuestion.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                {currentQuestion.subtitle}
              </p>
              {currentQuestion.description && (
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  {currentQuestion.description}
                </p>
              )}
            </motion.div>

            {/* Input Types */}
            {currentQuestion.type === 'intro' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNext()}
                  className="px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Commencer l'aventure</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Sparkles className="inline-block ml-3 w-6 h-6" />
                </motion.button>
              </motion.div>
            )}

            {currentQuestion.type === 'input' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl rounded-2xl" />
                  <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        {currentQuestion.icon}
                      </div>
                      <input
                        type={currentQuestion.inputType || 'text'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && inputValue && handleNext()}
                        placeholder={currentQuestion.placeholder}
                        className="flex-1 bg-transparent text-2xl text-white placeholder-white/30 outline-none"
                        autoFocus
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNext()}
                      disabled={!inputValue}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Continuer
                      <ChevronRight className="inline-block ml-2 w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentQuestion.type === 'select' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-6 max-w-3xl mx-auto"
              >
                {currentQuestion.options?.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectOption(option.value)}
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                         style={{
                           background: `linear-gradient(135deg, ${option.gradient})`
                         }} />
                    <div className="relative p-8 border border-white/10 rounded-2xl">
                      <div className="text-4xl mb-4">{option.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{option.label}</h3>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-8"
                >
                  {currentQuestion.options?.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(option.value)}
                      className={`relative overflow-hidden transition-all ${
                        selectedOptions.includes(option.value)
                          ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-black'
                          : ''
                      }`}
                    >
                      <div className={`absolute inset-0 backdrop-blur-xl rounded-xl transition-all ${
                        selectedOptions.includes(option.value)
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                          : 'bg-white/5'
                      }`} />
                      <div className="relative p-6 border border-white/10 rounded-xl">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{option.icon}</div>
                          <div className="flex-1 text-left">
                            <h3 className="text-lg font-bold text-white">{option.label}</h3>
                            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                          </div>
                          {selectedOptions.includes(option.value) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <span className="text-white text-xs">✓</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
                {selectedOptions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNext()}
                      className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all"
                    >
                      Valider mes choix ({selectedOptions.length})
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}

            {currentQuestion.type === 'experience' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="mb-8 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-2xl mx-auto">
                  <p className="text-lg text-gray-300 mb-6">
                    Explorez l'écosystème WhatsClose en 3D. Cliquez sur les éléments pour découvrir comment nous révolutionnons le commerce local.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSceneInteraction?.('explore');
                      handleNext();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all"
                  >
                    Explorer l'expérience 3D
                    <Sparkles className="inline-block ml-2 w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center mt-12 gap-2"
            >
              {questions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-green-500'
                      : index < currentStep
                      ? 'w-2 bg-green-600'
                      : 'w-2 bg-white/20'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}