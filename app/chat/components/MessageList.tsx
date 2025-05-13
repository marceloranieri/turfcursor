'use client';

import React from 'react';
import { Message as MessageType, User, Reaction as ReactionType } from '@/lib/supabase/client';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: MessageType[];
  users: {[key: string]: User};
  reactions: ReactionType[];
  onReply: (messageId: string) => void;
  onReact: (messageId: string, reaction: string) => void;
  onGeniusAward: (messageId: string) => void;
}

export default function MessageList({
  messages,
  users,
  reactions,
  onReply,
  onReact,
  onGeniusAward
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-center text-text-secondary py-8">
          No messages yet. Be the first to start the conversation!
        </div>
      ) : (
        messages.map(message => {
          const messageUser = users[message.user_id];
          if (!messageUser) return null; // Skip if user data not loaded
          
          const messageReactions = reactions.filter(r => r.message_id === message.id);
          const replyToMessage = message.reply_to 
            ? messages.find(m => m.id === message.reply_to) 
            : undefined;
          
          return (
            <MessageBubble
              key={message.id}
              message={message}
              user={messageUser}
              reactions={messageReactions}
              replyTo={replyToMessage}
              onReply={onReply}
              onReact={onReact}
              onGeniusAward={onGeniusAward}
              isWizardMessage={message.is_wizard}
              isPinned={message.is_pinned}
            />
          );
        })
      )}
    </div>
  );
} 