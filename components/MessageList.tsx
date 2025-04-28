'use client';

import React, { useState } from 'react';
import { Message } from '@/lib/types';
import Image from 'next/image';

interface MessageListProps {
  messages: Message[];
  onReply?: (message: Message) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onPin?: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onReply,
  onReaction,
  onPin
}) => {
  // Function to handle reply button click
  const handleReplyClick = (message: Message) => {
    if (onReply) {
      onReply(message);
    }
  };
  
  // Function to handle reaction click
  const handleReactionClick = (messageId: string, emoji: string) => {
    if (onReaction) {
      onReaction(messageId, emoji);
    }
  };
  
  // Function to handle pin message
  const handlePinClick = (message: Message) => {
    if (onPin) {
      onPin(message);
    }
  };
  
  return (
    <div className="messages space-y-6">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onReply={handleReplyClick}
          onReaction={handleReactionClick}
          onPin={handlePinClick}
        />
      ))}
    </div>
  );
};

interface MessageItemProps {
  message: Message;
  onReply: (message: Message) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onPin: (message: Message) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onReply,
  onReaction,
  onPin
}) => {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div 
      className="message-group flex"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
        message.isBot ? 'bg-green-500' : 'bg-indigo-500'
      }`}>
        {message.author.avatar}
      </div>
      
      {/* Message content */}
      <div className="flex-1">
        {/* Message header */}
        <div className="flex items-center mb-1">
          <span className={`font-semibold ${message.isBot ? 'text-green-500' : 'text-white'}`}>
            {message.author.name}
          </span>
          
          {message.isBot && (
            <span className="ml-1 px-1 py-0.5 bg-green-500 text-white text-xs rounded">
              BOT
            </span>
          )}
          
          <span className="ml-2 text-gray-400 text-xs">
            {message.timestamp}
          </span>
          
          {/* Message actions */}
          {showActions && (
            <div className="ml-auto flex space-x-2">
              <button 
                className="p-1 text-gray-400 hover:text-white transition-colors"
                onClick={() => onReply(message)}
                aria-label="Reply to message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              
              <button 
                className="p-1 text-gray-400 hover:text-white transition-colors"
                onClick={() => onPin(message)}
                aria-label="Pin message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Message content */}
        <div className="text-white mb-2">
          {message.content.split(' ').map((word, i) => (
            word.startsWith('@') ? (
              <span key={i} className="text-blue-400 mr-1">{word}</span>
            ) : (
              <span key={i} className="mr-1">{word}</span>
            )
          ))}
        </div>
        
        {/* Attachment if any */}
        {message.attachment && (
          <div className="mb-2 max-w-md">
            <Image 
              src={message.attachment.url} 
              alt={message.attachment.alt || "Attachment"} 
              width={500}
              height={300}
              className="rounded-md w-full"
            />
          </div>
        )}
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.reactions.map((reaction, index) => (
              <button 
                key={index}
                className={`flex items-center px-2 py-0.5 rounded-full text-sm ${
                  reaction.active 
                    ? 'bg-indigo-500/30 text-indigo-200' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => onReaction(message.id, reaction.emoji)}
                aria-label={`React with ${reaction.emoji}`}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
            
            <button 
              className="flex items-center px-2 py-0.5 rounded-full text-sm bg-gray-700 hover:bg-gray-600 text-gray-400"
              onClick={() => onReaction(message.id, '👍')}
              aria-label="Add reaction"
            >
              <span>+</span>
            </button>
          </div>
        )}
        
        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="pl-4 border-l-2 border-gray-700 mt-3 space-y-3">
            {message.replies.map((reply) => (
              <div key={reply.id} className="flex">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 bg-indigo-500">
                  {reply.author.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-white">
                      {reply.author.name}
                    </span>
                    <span className="ml-2 text-gray-400 text-xs">
                      {reply.timestamp}
                    </span>
                  </div>
                  
                  <div className="text-white">
                    {reply.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 