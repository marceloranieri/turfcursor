'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import { Smile, Image as ImageIcon, Check, Send, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiPicker } from './EmojiPicker';
import { ImageUpload } from './ImageUpload';
import Image from 'next/image';

interface GuestAwareChatInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

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

  const handleSendMessage = async () => {
    if (message.trim() === '' && !imageUrl) return;

    handleGuestAction(async () => {
      setIsSending(true);
      try {
        await onSendMessage(message, imageUrl || undefined);
        setMessage('');
        setImageUrl(null);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        setIsSent(true);
        setTimeout(() => setIsSent(false), 2000);
      } finally {
        setIsSending(false);
      }
    });
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

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);
    setMessage(newMessage);
    onChange?.(newMessage);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    });

    setShowEmojiPicker(false);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setShowImageUpload(false);
  };

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  return (
    <div className="relative">
      {SignInModalComponent && (
        <SignInModalComponent
          isOpen={showSignInModal}
          onClose={closeSignInModal}
        />
      )}

      <div className={`relative ${isGuest ? 'opacity-70' : ''} ${className}`}>
        <div className="flex items-end gap-2 bg-background-tertiary rounded-lg p-2">
          {/* Message input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isGuest}
              aria-label="Add emoji"
            >
              <Smile size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isGuest}
              aria-label="Upload image"
            >
              <ImageIcon size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              disabled={message.trim() === '' && !imageUrl || isGuest}
              className={`p-2 rounded-full transition-colors relative ${
                message.trim() === '' && !imageUrl || isGuest
                  ? 'text-text-secondary'
                  : 'text-accent-secondary hover:bg-background-secondary'
              }`}
              aria-label="Send message"
            >
              {isSending ? (
                <div className="w-5 h-5 loading-spinner" />
              ) : isSent ? (
                <Check size={20} />
              ) : (
                <Send size={20} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            position="top"
          />
        )}

        {/* Image upload */}
        {showImageUpload && (
          <ImageUpload
            onUpload={handleImageUpload}
            onCancel={() => {
              setShowImageUpload(false);
              setImageUrl(null);
            }}
          />
        )}

        {/* Image preview */}
        <AnimatePresence>
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 bg-background-secondary rounded-lg shadow-lg p-2"
            >
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt="Upload preview"
                  width={200}
                  height={200}
                  className="rounded-lg max-w-[200px] max-h-[200px] object-contain"
                />
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setImageUrl(null);
                  }}
                  className="absolute -top-2 -right-2 bg-background-primary rounded-full p-1 text-text-secondary hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest overlay */}
        {isGuest && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-lg p-2 flex items-center gap-2">
              <Lock size={20} className="mr-2" />
              <span className="text-white text-sm font-medium">Sign in to chat</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 