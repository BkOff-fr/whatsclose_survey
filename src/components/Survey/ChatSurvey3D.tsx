'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Package, 
  Clock,
  Sparkle,
  ChevronRight,
  Check,
  CreditCard
} from 'lucide-react';

interface ChatSurveyProps {
  onComplete: (data: any) => void;
}

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
}

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export default function ChatSurvey({ onComplete }: ChatSurveyProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const questions = [
    {
      type: 'bot',
      content: "👋 Bienvenue sur WhatsClose ! Je suis là pour découvrir comment nous pouvons révolutionner vos courses locales.",
      delay: 0
    },
    {
      type: 'input',
      content: "Pour commencer, quel est votre prénom ?",
      field: 'firstName',
      placeholder: 'Votre prénom...'
    },
    {
      type: 'input',
      content: (data: any) => `Enchanté ${data.firstName} ! Et votre nom de famille ?`,
      field: 'lastName',
      placeholder: 'Votre nom...'
    },
    {
      type: 'input',
      content: "Quelle est votre adresse email ?",
      field: 'email',
      placeholder: 'votre@email.com',
      inputType: 'email'
    },
    {
      type: 'input',
      content: "Dans quelle ville habitez-vous ?",
      field: 'city',
      placeholder: 'Ex: Lyon, Paris, Bordeaux...'
    },
    {
      type: 'options',
      content: "À quelle fréquence achetez-vous des produits locaux ?",
      field: 'frequency',
      options: [
        { id: 'weekly', label: 'Chaque semaine', icon: <ShoppingCart className="w-4 h-4" /> },
        { id: 'monthly', label: '2-3 fois/mois', icon: <Clock className="w-4 h-4" /> },
        { id: 'rarely', label: 'Rarement', icon: <ChevronRight className="w-4 h-4" /> }
      ]
    },
    {
      type: 'multi-options',
      content: "Qu'est-ce qui est important pour vous ? (Plusieurs choix)",
      field: 'priorities',
      options: [
        { id: 'quality', label: 'Qualité', icon: <Heart className="w-4 h-4" /> },
        { id: 'local', label: 'Local', icon: <MapPin className="w-4 h-4" /> },
        { id: 'price', label: 'Prix', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'convenience', label: 'Praticité', icon: <Package className="w-4 h-4" /> }
      ]
    },
    {
      type: 'options',
      content: "Des casiers 24/7 pour vos produits locaux, ça vous tente ?",
      field: 'interest',
      options: [
        { id: 'love', label: "J'adore l'idée !", icon: <Heart className="w-4 h-4" /> },
        { id: 'interested', label: 'Intéressant', icon: <Check className="w-4 h-4" /> },
        { id: 'maybe', label: 'Pourquoi pas', icon: <ChevronRight className="w-4 h-4" /> }
      ]
    },
    {
      type: 'bot',
      content: (data: any) => `🎉 Merci ${data.firstName} ! Vous faites partie des pionniers de WhatsClose. On vous contactera très bientôt !`,
      final: true
    }
  ];

  useEffect(() => {
    if (currentStep < questions.length) {
      const question = questions[currentStep];
      setIsTyping(true);
      
      setTimeout(() => {
        const content = typeof question.content === 'function' 
          ? question.content(userData)
          : question.content;
          
        setMessages(prev => [...prev, {
          type: 'bot',
          content: content,
          id: Date.now()
        }]);
        setIsTyping(false);
        
        if (question.final) {
          setTimeout(() => onComplete(userData), 2000);
        }
      }, 1000);
    }
  }, [currentStep, userData]);

  const handleSubmit = (value: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    
    const question = questions[currentStep] as any;
    
    // Store user data
    if (question.field) {
      setUserData((prev: any) => ({
        ...prev,
        [question.field]: value
      }));
    }
    
    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: Array.isArray(value) 
        ? value.map(v => question.options?.find((o: Option) => o.id === v)?.label || v).join(', ')
        : value,
      id: Date.now()
    }]);
    
    // Clear input and selections
    setInputValue('');
    setSelectedOptions([]);
    
    // Next question
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 500);
  };

  const handleOptionSelect = (optionId: string) => {
    const question = questions[currentStep] as any;
    
    if (question.type === 'multi-options') {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(prev => prev.filter(id => id !== optionId));
      } else {
        setSelectedOptions(prev => [...prev, optionId]);
      }
    } else {
      handleSubmit(optionId);
    }
  };

  const currentQuestion = questions[currentStep] as any;
  const progress = (currentStep / questions.length) * 100;

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-[600px] bg-black/90 backdrop-blur-xl border-l border-t border-green-500/30 rounded-tl-3xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Sparkle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">WhatsClose Assistant</h3>
              <p className="text-xs text-green-400">Découvrons vos besoins</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">{Math.round(progress)}%</div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
              }`}>
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs">WhatsClose est en train d'écrire...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-4 border-t border-green-500/20 bg-black/50">
        {currentQuestion && !currentQuestion.final && !isTyping && (
          <>
            {currentQuestion.type === 'input' && (
              <div className="flex gap-2">
                <input
                  type={currentQuestion.inputType || 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(inputValue)}
                  placeholder={currentQuestion.placeholder}
                  className="flex-1 bg-gray-900 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <button
                  onClick={() => handleSubmit(inputValue)}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-green-500/25"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {(currentQuestion.type === 'options' || currentQuestion.type === 'multi-options') && (
              <div className="space-y-2">
                {currentQuestion.options.map((option: Option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedOptions.includes(option.id)
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-green-500/50'
                    }`}
                  >
                    {option.icon}
                    <span className="flex-1 text-left">{option.label}</span>
                    {selectedOptions.includes(option.id) && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
                
                {currentQuestion.type === 'multi-options' && selectedOptions.length > 0 && (
                  <button
                    onClick={() => handleSubmit(selectedOptions)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-3 font-medium transition-all hover:shadow-lg hover:shadow-green-500/25"
                  >
                    Valider ({selectedOptions.length} choix)
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}