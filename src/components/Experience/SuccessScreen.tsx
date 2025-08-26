'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Users, 
  Shield, 
  Star, 
  Gift,
  Mail,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { UserData } from '@/types';
import { api } from '@/lib/api';
import { formatDate } from '@/utils/helpers';

interface SuccessScreenProps {
  userData: UserData;
  onRestart?: () => void;
}

export default function SuccessScreen({ userData, onRestart }: SuccessScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Soumettre les données à l'API
    const submitData = async () => {
      if (submissionStatus !== 'idle') return;
      
      setIsSubmitting(true);
      try {
        const result = await api.submitSurvey(userData);
        setSubmissionStatus(result.success ? 'success' : 'error');
      } catch (error) {
        console.error('Submission error:', error);
        setSubmissionStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitData();
  }, [userData, submissionStatus]);

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Accès Prioritaire',
      description: `Lancement ${userData.city} - Q1 2025`,
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Avantages Exclusifs',
      description: '1 mois offert + réductions',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Statut Pionnier',
      description: 'Badge early adopter',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Surprises',
      description: 'Cadeaux de lancement',
      color: 'from-pink-500 to-red-500'
    }
  ];

  const nextSteps = [
    { icon: <Mail />, text: 'Email de confirmation envoyé' },
    { icon: <Calendar />, text: 'Invitation beta en janvier' },
    { icon: <MapPin />, text: 'Premiers casiers dans votre ville' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="relative max-w-4xl w-full"
      >
        <div className="bg-gradient-to-br from-green-500/10 via-black/50 to-green-600/10 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-8 md:p-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-400/30 blur-2xl animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 gradient-text">
              Félicitations {userData.firstName} ! 🎉
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Vous faites partie des <span className="text-green-400 font-semibold">127 premiers pionniers</span> qui vont transformer la consommation locale à {userData.city}.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 mb-8"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                    {step.icon}
                  </div>
                  <span className="text-gray-300 text-sm">{step.text}</span>
                  {index === 0 && submissionStatus === 'success' && (
                    <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Envoyé
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart || (() => window.location.reload())}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all relative"
            >
              Recommencer l'expérience
              <div className="absolute inset-0 rounded-2xl bg-green-500/30 blur-xl -z-10" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://whatsclose.com', '_blank')}
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              En savoir plus
            </motion.button>
          </motion.div>

          {/* Submission Status */}
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <div className="inline-flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                Enregistrement en cours...
              </div>
            </motion.div>
          )}

          {submissionStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <p className="text-yellow-400 text-sm">
                ⚠️ L'enregistrement a échoué, mais vos informations sont sauvegardées localement.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}