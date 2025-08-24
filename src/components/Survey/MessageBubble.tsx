'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Send, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export interface Message {
  id: string;
  type: 'bot' | 'user' | 'options';
  content: string;
  options?: Option[];
  multiSelect?: boolean;
  inputType?: 'text' | 'email' | 'select';
  inputPlaceholder?: string;
  selectOptions?: { value: string; label: string }[];
}

export interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MessageBubbleProps {
  message: Message;
  onOptionSelect?: (optionId: string | string[]) => void;
  onInputSubmit?: (value: string) => void;
  isLatest?: boolean;
}

export default function MessageBubble({
  message,
  onOptionSelect,
  onInputSubmit,
  isLatest
}: MessageBubbleProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLatest && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out'
        }
      );
    }
  }, [isLatest]);

  const handleSubmit = () => {
    if (inputValue.trim() && onInputSubmit) {
      onInputSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (message.multiSelect) {
      const newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      setSelectedOptions(newSelection);
    } else if (onOptionSelect) {
      onOptionSelect(optionId);
    }
  };

  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length > 0 && onOptionSelect) {
      onOptionSelect(selectedOptions);
      setSelectedOptions([]);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={messageRef}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      {message.type === 'bot' && (
        <div className="flex items-start space-x-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div
            className="bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-md shadow-xl border border-gray-700/50"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-gray-100">{message.content}</p>
          </motion.div>
        </div>
      )}

      {message.type === 'user' && (
        <div className="flex justify-end mb-4">
          <motion.div
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl rounded-tr-none p-4 max-w-md shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-white">{message.content}</p>
          </motion.div>
        </div>
      )}

      {message.type === 'options' && message.inputType && (
        <div className="mb-4">
          <motion.div
            className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message.inputType === 'select' ? (
              <select
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-gray-900/80 text-gray-100 rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">Sélectionnez...</option>
                {message.selectOptions?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={message.inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={message.inputPlaceholder}
                className="w-full bg-gray-900/80 text-gray-100 rounded-xl px-4 py-3 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500"
              />
            )}
            <motion.button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-3 font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: inputValue.trim() ? 1.02 : 1 }}
              whileTap={{ scale: inputValue.trim() ? 0.98 : 1 }}
            >
              <span>Continuer</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      )}

      {message.type === 'options' && message.options && (
        <div className="mb-4">
          <AnimatePresence>
            <motion.div className="grid gap-2">
              {message.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={
                    'bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border transition-all text-left flex items-center space-x-3 ' +
                    (selectedOptions.includes(option.id)
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700/50 hover:border-green-500/50')
                  }
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.icon && <div className="text-green-400">{option.icon}</div>}
                  <span className="text-gray-100 flex-1">{option.label}</span>
                  {selectedOptions.includes(option.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {message.multiSelect && selectedOptions.length > 0 && (
            <motion.button
              onClick={handleMultiSelectSubmit}
              className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-4 py-3 font-medium transition-all flex items-center justify-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Valider la sélection ({selectedOptions.length})</span>
              <Check className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}