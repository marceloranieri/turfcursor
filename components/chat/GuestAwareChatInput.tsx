'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import { Smile, Image as ImageIcon, Check, Send, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiPicker } from './EmojiPicker';
import { ImageUpload } from './ImageUpload';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import dynamic from 'next/dynamic';

const SignInModal = dynamic(() => import('@/components/auth/SignInModal'), {
  loading: () => <div>Loading...</div>,
});

interface GuestAwareChatInputProps {
  onSendMessage?: (message: string, imageUrl?: string) => void;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function GuestAwareChatInput({
  onSendMessage,
  onChange,
  placeholder = "Type a message...",
  className = "",
}: GuestAwareChatInputProps) {
  const { isGuest, handleGuestAction } = useGuestMode();
  const { user } = useAuth();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user) {
      setShowSignInModal(true);
      return;
    }

    handleGuestAction(async () => {
      setIsSending(true);
      try {
        await onSendMessage?.(message, imageUrl || undefined);
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

  return (
    <div className="relative">
      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} />
      )}

      <div className={`relative ${isGuest ? 'opacity-70' : ''} ${className}`}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            placeholder={isGuest ? "Sign in to send messages..." : placeholder}
            className={`flex-1 p-2 bg-transparent text-text-primary placeholder-text-secondary resize-none focus:outline-none min-h-[40px] max-h-[150px] ${
              isGuest ? 'cursor-not-allowed' : ''
            }`}
            disabled={isGuest}
            rows={1}
          />

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
              type="submit"
              disabled={!message.trim() || isGuest}
              className={`p-2 rounded-full transition-colors relative ${
                !message.trim() || isGuest
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
        </form>

        {showEmojiPicker && (
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            position="top"
          />
        )}

        {showImageUpload && (
          <ImageUpload
            onUpload={handleImageUpload}
            onClose={() => setShowImageUpload(false)}
          />
        )}

        {imageUrl && (
          <div className="relative mt-2 inline-block">
            <Image
              src={imageUrl}
              alt="Upload preview"
              width={200}
              height={200}
              className="rounded-lg max-h-[200px] w-auto object-contain"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setImageUrl(null);
              }}
              className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 