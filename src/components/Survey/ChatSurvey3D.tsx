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
  CreditCard,
  Star,
  Zap
} from 'lucide-react';

interface ChatSurveyProps {
  onComplete: (data: any) => void;
  onStartStory: () => void;
  isVisible: boolean;
}

interface Message {
  id: string; // <-- change from number to string for robust unique keys
  type: 'bot' | 'user';
  content: string;
}

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

let messageId = 0;

export default function ChatSurvey({ onComplete, onStartStory, isVisible }: ChatSurveyProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [storyTriggered, setStoryTriggered] = useState(false);
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
      content: "👋 Bienvenue dans l'expérience WhatsClose ! Je suis votre guide personnel pour découvrir une nouvelle façon de consommer local.",
      delay: 0
    },
    {
      type: 'input',
      content: "Pour personnaliser cette expérience, quel est votre prénom ?",
      field: 'firstName',
      placeholder: 'Entrez votre prénom...'
    },
    {
      type: 'input',
      content: (data: any) => `Enchanté ${data.firstName} ! Dans quelle ville habitez-vous ?`,
      field: 'city',
      placeholder: 'Ex: Lyon, Paris, Marseille...'
    },
    {
      type: 'options',
      content: "À quelle fréquence consommez-vous des produits locaux ?",
      field: 'localConsumption',
      options: [
        { id: 'daily', label: 'Tous les jours', icon: <Star className="w-4 h-4" /> },
        { id: 'weekly', label: 'Chaque semaine', icon: <Heart className="w-4 h-4" /> },
        { id: 'monthly', label: 'Occasionnellement', icon: <Clock className="w-4 h-4" /> },
        { id: 'rarely', label: 'Rarement', icon: <ChevronRight className="w-4 h-4" /> }
      ]
    },
    {
      type: 'story',
      content: (data: any) => `Parfait ${data.firstName} ! 🚀 Préparez-vous pour une expérience immersive. Je vais vous montrer comment WhatsClose va révolutionner vos courses locales...`,
      triggerStory: true
    },
    {
      type: 'multi-options',
      content: "Qu'est-ce qui vous a le plus impressionné ?",
      field: 'impressedBy',
      options: [
        { id: 'lockers', label: 'Casiers 24/7', icon: <Package className="w-4 h-4" /> },
        { id: 'local', label: 'Produits locaux', icon: <MapPin className="w-4 h-4" /> },
        { id: 'app', label: 'Application simple', icon: <Zap className="w-4 h-4" /> },
        { id: 'delivery', label: 'Livraison rapide', icon: <ShoppingCart className="w-4 h-4" /> }
      ]
    },
    {
      type: 'input',
      content: "Pour vous tenir informé du lancement dans votre ville, quelle est votre adresse email ?",
      field: 'email',
      placeholder: 'votre@email.com',
      inputType: 'email'
    },
    {
      type: 'options',
      content: "Une dernière question : seriez-vous prêt à payer un abonnement mensuel pour ce service ?",
      field: 'subscription',
      options: [
        { id: 'yes', label: 'Oui, absolument', icon: <Check className="w-4 h-4" /> },
        { id: 'maybe', label: 'Ça dépend du prix', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'no', label: 'Je préfère payer à l\'usage', icon: <ChevronRight className="w-4 h-4" /> }
      ]
    },
    {
      type: 'bot',
      content: (data: any) => `🎉 Merci ${data.firstName} ! Vous êtes officiellement un pionnier WhatsClose. Nous vous contacterons dès que nous lancerons à ${data.city}.`,
      final: true
    }
  ];

  useEffect(() => {
    if (currentStep < questions.length) {
      const question = questions[currentStep] as any;
      
      if (question.triggerStory && !storyTriggered) {
        setStoryTriggered(true);
        setTimeout(() => {
          onStartStory();
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 3000);
        }, 2000);
      }
      
      setIsTyping(true);
      
      setTimeout(() => {
        const content = typeof question.content === 'function' 
          ? question.content(userData)
          : question.content;
          
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            content: content,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` // robust unique id
          }
        ]);
        setIsTyping(false);
        
        if (question.final) {
          setTimeout(() => onComplete(userData), 2000);
        }
      }, 1000);
    }
  }, [currentStep, userData, onStartStory, onComplete, storyTriggered]);

  const handleSubmit = (value: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    
    const question = questions[currentStep] as any;
    
    if (question.field) {
      setUserData((prev: any) => ({
        ...prev,
        [question.field]: value
      }));
    }
    
    const displayValue = Array.isArray(value) 
      ? value.map(v => question.options?.find((o: Option) => o.id === v)?.label || v).join(', ')
      : question.options 
        ? question.options.find((o: Option) => o.id === value)?.label || value
        : value;
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: displayValue,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` // robust unique id
    }]);
    
    setInputValue('');
    setSelectedOptions([]);
    
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md h-[600px] pointer-events-auto"
      >
        <div className="h-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          {/* Glass effect overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg relative"
                >
                  <Sparkle className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-green-400/20 blur-xl" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">WhatsClose</h3>
                  <p className="text-xs text-green-400">Votre assistant personnel</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">{Math.round(progress)}%</div>
            </div>
            <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-green-400/50 blur-sm" />
              </motion.div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] p-4 rounded-2xl relative ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg rounded-br-sm' 
                        : 'bg-white/10 backdrop-blur text-white rounded-bl-sm border border-white/5'
                    }`}
                  >
                    {message.content}
                    {message.type === 'user' && (
                      <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl -z-10" />
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4"
              >
                <div className="flex gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <motion.span
                      key={delay}
                      className="w-2.5 h-2.5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: delay / 1000 }}
                      style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">WhatsClose réfléchit...</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 bg-black/30 backdrop-blur">
            {currentQuestion && !currentQuestion.final && !isTyping && !currentQuestion.triggerStory && (
              <AnimatePresence mode="wait">
                {currentQuestion.type === 'input' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3"
                  >
                    <input
                      type={currentQuestion.inputType || 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(inputValue)}
                      placeholder={currentQuestion.placeholder}
                      className="flex-1 bg-white/10 backdrop-blur text-white rounded-2xl px-5 py-3.5 border border-white/20 focus:border-green-500/50 focus:outline-none focus:bg-white/15 transition-all placeholder-white/40"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSubmit(inputValue)}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl px-5 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-green-500/25 shadow-lg relative"
                    >
                      <Send className="w-5 h-5" />
                      <div className="absolute inset-0 rounded-2xl bg-green-500/30 blur-xl -z-10" />
                    </motion.button>
                  </motion.div>
                )}
                
                {(currentQuestion.type === 'options' || currentQuestion.type === 'multi-options') && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option: Option, index: number) => (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all group ${
                          selectedOptions.includes(option.id)
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'border-white/20 bg-white/5 backdrop-blur text-white hover:bg-white/10 hover:border-green-500/30'
                        }`}
                      >
                        <span className={`transition-all ${
                          selectedOptions.includes(option.id) 
                            ? 'text-green-400 scale-110' 
                            : 'text-green-400/60 group-hover:scale-110 group-hover:text-green-400'
                        }`}>
                          {option.icon}
                        </span>
                        <span className="flex-1 text-left">{option.label}</span>
                        {selectedOptions.includes(option.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                      </motion.button>
                    ))}
                    
                    {currentQuestion.type === 'multi-options' && selectedOptions.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit(selectedOptions)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl px-6 py-4 font-semibold transition-all hover:shadow-lg hover:shadow-green-500/25 relative"
                      >
                        Valider ({selectedOptions.length} choix)
                        <div className="absolute inset-0 rounded-2xl bg-green-500/30 blur-xl -z-10" />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}