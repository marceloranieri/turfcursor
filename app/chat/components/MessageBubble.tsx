'use client';

import React, { useState } from 'react';
import { User, Reaction, Message as MessageType } from '@/lib/supabase/client';
import { ArrowUturnLeftIcon, HandThumbUpIcon, HandThumbDownIcon, GiftIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const ReactionPicker = dynamic(() => import('@/components/ReactionPicker'), { ssr: false });

interface MessageBubbleProps {
  message: MessageType;
  user: User;
  reactions: Reaction[];
  replyTo?: MessageType;
  onReply: (messageId: string) => void;
  onReact: (messageId: string, reaction: string) => void;
  onGeniusAward: (messageId: string) => void;
  isWizardMessage?: boolean;
  isPinned?: boolean;
}

export default function MessageBubble({
  message,
  user,
  reactions,
  replyTo,
  onReply,
  onReact,
  onGeniusAward,
  isWizardMessage = false,
  isPinned = false,
}: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  // Group reactions by content
  const groupedReactions = reactions.reduce<Record<string, Reaction[]>>((acc, reaction) => {
    const content = reaction.content ?? '';
    if (!(content in acc)) {
      acc[content] = [];
    }
    // At this point, we know acc[content] exists
    acc[content]!.push(reaction);
    return acc;
  }, {});
  
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
  
  return (
    <div className={`my-4 ${isWizardMessage ? 'message-bubble wizard' : ''}`}>
      {/* Reply reference */}
      {replyTo && (
        <div className="flex items-center text-xs text-text-muted ml-12 mb-1">
          <ArrowUturnLeftIcon className="w-3 h-3 mr-1" />
          <span>Replying to message</span>
        </div>
      )}
      
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
            
            {/* Harmony points (if any) */}
            {(message.upvotes > 0 || message.downvotes > 0) && (
              <span className={`ml-2 harmony-points ${message.upvotes - message.downvotes < 0 ? 'negative' : ''}`}>
                {message.upvotes - message.downvotes > 0 ? '+' : ''}{message.upvotes - message.downvotes}
              </span>
            )}
          </div>
          
          {/* Message content */}
          <div className="mt-1 text-text-primary whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(message.id, emoji)}
                  className="reaction-button flex items-center px-2 py-0.5 rounded-full text-sm bg-gray-700 hover:bg-gray-600"
                  aria-label={`React with ${emoji}`}
                >
                  <span>{emoji}</span>
                  <span className="ml-1">{reactions.length}</span>
                </button>
              ))}
              
              <button 
                className="flex items-center px-2 py-0.5 rounded-full text-sm bg-gray-700 hover:bg-gray-600 text-gray-400"
                onClick={() => onReact(message.id, '👍')}
                aria-label="Add reaction"
              >
                <span>+</span>
              </button>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-2 flex items-center space-x-2 text-text-muted">
            <button
              onClick={() => onReply(message.id)}
              className="flex items-center text-xs hover:text-accent-primary transition-colors"
              aria-label="Reply to message"
            >
              <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
              Reply
            </button>
            
            <button
              onClick={() => onReact(message.id, '👍')}
              className={`flex items-center text-xs hover:text-accent-primary transition-colors ${
                message.upvotes > 0 ? 'text-accent-primary' : ''
              }`}
              aria-label="Upvote message"
            >
              <HandThumbUpIcon className="w-4 h-4 mr-1" />
              {message.upvotes > 0 ? message.upvotes : ''}
            </button>
            
            <button
              onClick={() => onReact(message.id, '👎')}
              className={`flex items-center text-xs hover:text-accent-primary transition-colors ${
                message.downvotes > 0 ? 'text-danger' : ''
              }`}
              aria-label="Downvote message"
            >
              <HandThumbDownIcon className="w-4 h-4 mr-1" />
              {message.downvotes > 0 ? message.downvotes : ''}
            </button>
            
            <button
              onClick={handleReactionClick}
              className="flex items-center text-xs hover:text-accent-primary transition-colors"
              aria-label="Add reaction"
            >
              <FaceSmileIcon className="w-4 h-4 mr-1" />
              React
            </button>
            
            <button
              onClick={() => onGeniusAward(message.id)}
              className="flex items-center text-xs hover:text-gold transition-colors"
              aria-label="Pin message"
            >
              <GiftIcon className="w-4 h-4 mr-1" />
              Pin
            </button>
          </div>
          
          {/* Emoji picker */}
          {showReactionPicker && (
            <div className="mt-2 relative">
              <ReactionPicker 
                onSelectEmoji={handleEmojiSelect} 
                onClose={() => setShowReactionPicker(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 