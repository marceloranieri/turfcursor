'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import DiscordButton from '@/components/ui/DiscordButton';
import { formatDistanceToNow } from 'date-fns';
import { GuestAwareReactionButton } from './GuestAwareReactionButton';
import { FaReply } from '@react-icons/all-files/fa/FaReply';
import { FaRegSmile } from '@react-icons/all-files/fa/FaRegSmile';
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';
import { FaGift } from '@react-icons/all-files/fa/FaGift';
import EmojiPicker from './EmojiPicker';
import { createLogger } from '@/lib/logger';
import type { Message as MessageType, Profile, Reaction } from '@/lib/types/database.types';

const logger = createLogger('Message');

interface MessageProps {
  message: MessageType;
  user?: Profile;
  reactions?: Reaction[];
  onReply: (messageId: string) => void;
  onReact: (messageId: string, reaction: string) => void;
  onGeniusAward: (messageId: string) => void;
  isWizardMessage?: boolean;
  isPinned?: boolean;
  isGuest?: boolean;
}

export default function Message({
  message,
  user,
  reactions = [],
  onReply,
  onReact,
  onGeniusAward,
  isWizardMessage = false,
  isPinned = false,
  isGuest = false,
}: MessageProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleReactionClick = () => {
    setShowReactionPicker(!showReactionPicker);
  };
  
  const handleEmojiSelect = (emoji: string) => {
    onReact(message.id, emoji);
    setShowReactionPicker(false);
  };

  if (!user) {
    return (
      <div className="my-4 opacity-50">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center text-lg font-semibold text-text-primary">
              ?
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="font-semibold text-text-primary">Deleted User</span>
              <span className="ml-2 text-sm text-text-muted">
                {formatTime(message.created_at)}
              </span>
            </div>
            <div className="mt-1 text-text-primary whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`my-4 ${isWizardMessage ? 'message-bubble wizard' : ''}`}>
      <div className="flex items-start">
        {/* User avatar */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center text-lg font-semibold text-text-primary">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            {/* Username */}
            <span className="font-semibold text-text-primary">
              {user.username}
              {user.is_debate_maestro && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold text-background">
                  Debate Maestro
                </span>
              )}
            </span>
            
            {/* Timestamp */}
            <span className="ml-2 text-sm text-text-muted">
              {formatTime(message.created_at)}
            </span>
          </div>
          
          {/* Message content */}
          <div className="mt-1 text-text-primary whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Action buttons */}
          <div className="mt-2 flex items-center space-x-2 text-text-muted">
            <GuestAwareReactionButton
              onClick={() => onReply(message.id)}
              className="flex items-center text-xs hover:text-accent-primary transition-colors"
              isGuest={isGuest}
              icon={FaRegSmile}
            />
            
            <GuestAwareReactionButton
              onClick={() => onReact(message.id, '👍')}
              className={`flex items-center text-xs hover:text-accent-primary transition-colors ${
                message.upvotes > 0 ? 'text-accent-primary' : ''
              }`}
              isGuest={isGuest}
              icon={FaThumbsUp}
            >
              {message.upvotes > 0 ? message.upvotes : ''}
            </GuestAwareReactionButton>
            
            <GuestAwareReactionButton
              onClick={() => onReact(message.id, '👎')}
              className={`flex items-center text-xs hover:text-accent-primary transition-colors ${
                message.downvotes > 0 ? 'text-danger' : ''
              }`}
              isGuest={isGuest}
              icon={FaThumbsDown}
            >
              {message.downvotes > 0 ? message.downvotes : ''}
            </GuestAwareReactionButton>
            
            <GuestAwareReactionButton
              onClick={handleReactionClick}
              className="flex items-center text-xs hover:text-accent-primary transition-colors"
              isGuest={isGuest}
              icon={FaRegSmile}
            >
              React
            </GuestAwareReactionButton>
            
            <GuestAwareReactionButton
              onClick={() => onGeniusAward(message.id)}
              className="flex items-center text-xs hover:text-gold transition-colors"
              isGuest={isGuest}
              icon={FaGift}
            >
              Genius
            </GuestAwareReactionButton>
          </div>
          
          {/* Emoji picker */}
          {showReactionPicker && (
            <div className="mt-2 relative">
              <EmojiPicker 
                onSelect={handleEmojiSelect} 
                onClose={() => setShowReactionPicker(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 