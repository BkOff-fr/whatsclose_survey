'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, MapPin, CreditCard, Check, ChevronRight, ArrowRight } from 'lucide-react';
import { useSurveyStore } from '@/hooks/useSurveyStore';
import MessageBubble, { Message } from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ProgressBar from '../ui/Progress';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ChatSurvey() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    surveyData,
    currentStep,
    progress,
    updateSurveyData,
    setCurrentStep,
    setProgress,
    markAsCompleted
  } = useSurveyStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((message: Message, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, delay);
  }, []);

  const surveyFlow = [
    // Introduction
    () => {
      addMessage({
        id: 'intro',
        type: 'bot',
        content: "👋 Bienvenue sur WhatsClose ! Je suis là pour découvrir vos besoins et créer la meilleure expérience pour vous."
      });
      setTimeout(() => nextStep(), 2000);
    },
    
    // Prénom
    () => {
      addMessage({
        id: 'ask-firstname',
        type: 'bot',
        content: "Pour commencer, quel est votre prénom ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'input-firstname',
          type: 'options',
          content: '',
          inputType: 'text',
          inputPlaceholder: 'Votre prénom...'
        });
      }, 1000);
    },
    
    // Nom
    () => {
      addMessage({
        id: 'ask-lastname',
        type: 'bot',
        content: 'Enchanté ' + surveyData.firstName + ' ! Et votre nom de famille ?'
      });
      setTimeout(() => {
        addMessage({
          id: 'input-lastname',
          type: 'options',
          content: '',
          inputType: 'text',
          inputPlaceholder: 'Votre nom...'
        });
      }, 1000);
    },
    
    // Email
    () => {
      addMessage({
        id: 'ask-email',
        type: 'bot',
        content: "Parfait ! Quelle est votre adresse email pour qu'on puisse vous tenir informé(e) ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'input-email',
          type: 'options',
          content: '',
          inputType: 'email',
          inputPlaceholder: 'votre@email.com'
        });
      }, 1000);
    },
    
    // Lieu de vie
    () => {
      addMessage({
        id: 'ask-location',
        type: 'bot',
        content: "Dans quelle ville ou région habitez-vous ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'input-location',
          type: 'options',
          content: '',
          inputType: 'text',
          inputPlaceholder: 'Ex: Lyon, Bordeaux, Lille...'
        });
      }, 1000);
    },
    
    // Type de lieu
    () => {
      addMessage({
        id: 'ask-location-type',
        type: 'bot',
        content: "Comment décririez-vous votre lieu de vie ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'input-location-type',
          type: 'options',
          content: '',
          inputType: 'select',
          selectOptions: [
            { value: 'city-large', label: 'Ville (>100k habitants)' },
            { value: 'city-medium', label: 'Ville moyenne (20-100k)' },
            { value: 'city-small', label: 'Petite ville (5-20k)' },
            { value: 'countryside', label: 'Village/Campagne (<5k)' }
          ]
        });
      }, 1000);
    },
    
    // Fréquence d'achat
    () => {
      addMessage({
        id: 'ask-frequency',
        type: 'bot',
        content: "Passons à vos habitudes ! À quelle fréquence achetez-vous des produits locaux (marchés, producteurs, AMAP...) ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-frequency',
          type: 'options',
          content: '',
          options: [
            { id: 'weekly', label: 'Chaque semaine', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'monthly', label: '2-3 fois par mois', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'occasionally', label: 'Occasionnellement', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'rarely', label: 'Rarement ou jamais', icon: <ShoppingCart className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Lieu d'achat
    () => {
      addMessage({
        id: 'ask-shopping-location',
        type: 'bot',
        content: "Où achetez-vous le plus souvent vos fruits et légumes ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-shopping-location',
          type: 'options',
          content: '',
          options: [
            { id: 'supermarket', label: 'Supermarché', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'market', label: 'Marché', icon: <MapPin className="w-5 h-5" /> },
            { id: 'producer', label: 'Chez un producteur', icon: <Heart className="w-5 h-5" /> },
            { id: 'other', label: 'Autre (bio, AMAP...)', icon: <ArrowRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Priorités
    () => {
      addMessage({
        id: 'ask-priorities',
        type: 'bot',
        content: "Qu'est-ce qui compte le plus pour vous dans vos achats ? (Plusieurs choix possibles)"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-priorities',
          type: 'options',
          content: '',
          multiSelect: true,
          options: [
            { id: 'price', label: 'Prix abordable', icon: <CreditCard className="w-5 h-5" /> },
            { id: 'quality', label: 'Qualité des produits', icon: <Check className="w-5 h-5" /> },
            { id: 'local', label: 'Origine locale', icon: <MapPin className="w-5 h-5" /> },
            { id: 'convenience', label: 'Praticité', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'speed', label: 'Rapidité', icon: <ArrowRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Expérience casier
    () => {
      addMessage({
        id: 'ask-locker-experience',
        type: 'bot',
        content: "Avez-vous déjà utilisé un système de retrait en casier ou drive fermier ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-locker-experience',
          type: 'options',
          content: '',
          options: [
            { id: 'yes', label: "Oui, j'ai déjà essayé", icon: <Check className="w-5 h-5" /> },
            { id: 'no', label: 'Non, jamais', icon: <ChevronRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Intérêt pour l'app
    () => {
      addMessage({
        id: 'ask-app-interest',
        type: 'bot',
        content: "L'idée de WhatsClose : une app pour commander des produits locaux et les récupérer dans des casiers 24/7. Ça vous intéresse ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-app-interest',
          type: 'options',
          content: '',
          options: [
            { id: 'very-interested', label: 'Très intéressé(e) !', icon: <Heart className="w-5 h-5" /> },
            { id: 'interested', label: 'Plutôt intéressé(e)', icon: <Check className="w-5 h-5" /> },
            { id: 'maybe', label: 'Pourquoi pas', icon: <ChevronRight className="w-5 h-5" /> },
            { id: 'not-interested', label: 'Pas vraiment', icon: <ChevronRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Fréquence d'utilisation
    () => {
      addMessage({
        id: 'ask-usage-frequency',
        type: 'bot',
        content: "Si WhatsClose existait, à quelle fréquence pensez-vous l'utiliser ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-usage-frequency',
          type: 'options',
          content: '',
          options: [
            { id: 'daily', label: 'Tous les jours', icon: <Heart className="w-5 h-5" /> },
            { id: 'weekly', label: 'Chaque semaine', icon: <Check className="w-5 h-5" /> },
            { id: 'monthly', label: 'Occasionnellement', icon: <ChevronRight className="w-5 h-5" /> },
            { id: 'rarely', label: 'Rarement', icon: <ChevronRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Produits souhaités
    () => {
      addMessage({
        id: 'ask-products',
        type: 'bot',
        content: "Quels types de produits aimeriez-vous trouver sur WhatsClose ? (Plusieurs choix possibles)"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-products',
          type: 'options',
          content: '',
          multiSelect: true,
          options: [
            { id: 'fruits-vegetables', label: 'Fruits & Légumes', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'dairy', label: 'Produits laitiers', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'meat', label: 'Viande & Charcuterie', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'bakery', label: 'Pain & Viennoiseries', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'drinks', label: 'Boissons locales', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'prepared', label: 'Plats préparés', icon: <ShoppingCart className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Préférence de commande
    () => {
      addMessage({
        id: 'ask-order-preference',
        type: 'bot',
        content: "Préféreriez-vous commander..."
      });
      setTimeout(() => {
        addMessage({
          id: 'options-order-preference',
          type: 'options',
          content: '',
          options: [
            { id: 'predefined', label: 'Des paniers prédéfinis', icon: <ShoppingCart className="w-5 h-5" /> },
            { id: 'custom', label: 'À la carte', icon: <Heart className="w-5 h-5" /> },
            { id: 'both', label: 'Un mix des deux', icon: <Check className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Prix
    () => {
      addMessage({
        id: 'ask-pricing',
        type: 'bot',
        content: "Seriez-vous prêt(e) à payer un petit supplément pour la praticité du service (livraison en casier 24/7) ?"
      });
      setTimeout(() => {
        addMessage({
          id: 'options-pricing',
          type: 'options',
          content: '',
          options: [
            { id: 'yes', label: 'Oui, si le service le justifie', icon: <Check className="w-5 h-5" /> },
            { id: 'depends', label: 'Ça dépend du montant', icon: <CreditCard className="w-5 h-5" /> },
            { id: 'no', label: 'Non, prix identiques SVP', icon: <ChevronRight className="w-5 h-5" /> }
          ]
        });
      }, 1000);
    },
    
    // Finalisation
    () => {
      addMessage({
        id: 'thank-you',
        type: 'bot',
        content: 'Merci infiniment ' + surveyData.firstName + ' ! 🎉 Vos réponses nous aident à construire le WhatsClose de demain.'
      });
      setTimeout(() => {
        addMessage({
          id: 'final',
          type: 'bot',
          content: "On vous tiendra informé(e) de notre lancement très bientôt ! D'ici là, n'hésitez pas à parler de WhatsClose autour de vous. 💚"
        });
        markAsCompleted();
      }, 2000);
    }
  ];

  const totalSteps = surveyFlow.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setProgress((newStep / totalSteps) * 100);
    }
  };

  const handleUserResponse = (messageId: string, value: string | string[]) => {
    // Add user message
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      type: 'user',
      content: Array.isArray(value) ? value.join(', ') : value
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Update survey data based on the step
    switch (messageId) {
      case 'input-firstname':
        updateSurveyData({ firstName: value as string });
        break;
      case 'input-lastname':
        updateSurveyData({ lastName: value as string });
        break;
      case 'input-email':
        updateSurveyData({ email: value as string });
        break;
      case 'input-location':
        updateSurveyData({ location: value as string });
        break;
      case 'input-location-type':
        updateSurveyData({ locationType: value as string });
        break;
      case 'options-frequency':
        updateSurveyData({ shoppingFrequency: value as string });
        break;
      case 'options-shopping-location':
        updateSurveyData({ shoppingLocation: value as string });
        break;
      case 'options-priorities':
        updateSurveyData({ priorities: value as string[] });
        break;
      case 'options-locker-experience':
        updateSurveyData({ hasUsedLocker: value === 'yes' });
        break;
      case 'options-app-interest':
        updateSurveyData({ interestedInApp: value as string });
        break;
      case 'options-usage-frequency':
        updateSurveyData({ usageFrequency: value as string });
        break;
      case 'options-products':
        updateSurveyData({ desiredProducts: value as string[] });
        break;
      case 'options-order-preference':
        updateSurveyData({ orderPreference: value as string });
        break;
      case 'options-pricing':
        updateSurveyData({ willingToPayExtra: value as string });
        break;
    }
    
    // Move to next step
    setTimeout(() => nextStep(), 500);
  };

  useEffect(() => {
    if (currentStep < totalSteps) {
      surveyFlow[currentStep]();
    }
  }, [currentStep]);

  return (
    <>
      <ProgressBar
        progress={progress}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      
      <div 
        ref={containerRef}
        className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-4 pt-24 pb-8"
      >
        <motion.div 
          className="min-h-[calc(100vh-12rem)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onOptionSelect={(value) => handleUserResponse(message.id, value)}
                onInputSubmit={(value) => handleUserResponse(message.id, value)}
                isLatest={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>
          
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </motion.div>
      </div>
    </>
  );
}