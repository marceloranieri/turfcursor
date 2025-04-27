'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import { FaLock, FaPaperPlane, FaSmile, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestAwareChatInputProps {
  onSendMessage: (message: string) => void;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const GuestAwareChatInput: React.FC<GuestAwareChatInputProps> = ({
  onSendMessage,
  onChange,
  placeholder = "Type a message...",
  className = "",
}) => {
  const { isGuest, handleGuestAction, SignInModalComponent } = useGuestMode();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    };

    textarea.addEventListener('input', adjustHeight);
    return () => textarea.removeEventListener('input', adjustHeight);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    handleGuestAction(() => {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, '/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    onChange?.(value);
  };

  return (
    <div className="relative">
      {SignInModalComponent}

      <div className={`relative ${isGuest ? 'opacity-70' : ''} ${className}`}>
        <div className="flex items-end gap-2 bg-background-tertiary rounded-lg p-2">
          {/* Message input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isGuest ? "Sign in to send messages..." : placeholder}
            className={`flex-1 p-2 bg-transparent text-text-primary placeholder-text-secondary resize-none focus:outline-none min-h-[40px] max-h-[150px] ${
              isGuest ? 'cursor-not-allowed' : ''
            }`}
            disabled={isGuest}
            rows={1}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-2 py-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => {/* TODO: Implement emoji picker */}}
              disabled={isGuest}
              aria-label="Add emoji"
            >
              <FaSmile className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => {/* TODO: Implement image upload */}}
              disabled={isGuest}
              aria-label="Upload image"
            >
              <FaImage className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              disabled={message.trim() === '' || isGuest}
              className={`p-2 rounded-full transition-colors ${
                message.trim() === '' || isGuest
                  ? 'text-text-secondary'
                  : 'text-accent-secondary hover:bg-background-secondary'
              }`}
              aria-label="Send message"
            >
              <FaPaperPlane className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Guest overlay */}
        {isGuest && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-lg p-2 flex items-center gap-2">
              <FaLock className="text-accent-secondary" />
              <span className="text-white text-sm font-medium">Sign in to chat</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 