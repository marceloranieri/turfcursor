'use client';

import React, { useState } from 'react';
import { useGuestMode } from '@/lib/hooks/useGuestMode';
import DiscordButton from '@/components/ui/DiscordButton';
import { FaLock } from 'react-icons/fa';

interface GuestAwareChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const GuestAwareChatInput: React.FC<GuestAwareChatInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type a message..." 
}) => {
  const { isGuest, handleGuestAction, SignInModalComponent } = useGuestMode();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    handleGuestAction(() => {
      onSendMessage(message);
      setMessage('');
    }, '/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      {SignInModalComponent}
      
      <div className={`relative ${isGuest ? 'opacity-70' : ''}`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isGuest ? "Sign in to send messages..." : placeholder}
          className={`w-full p-3 pr-12 rounded-lg bg-background-tertiary text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 ${isGuest ? 'cursor-not-allowed' : ''}`}
          rows={1}
          disabled={isGuest}
        />
        
        {isGuest && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-lg p-2 flex items-center gap-2">
              <FaLock className="text-accent-secondary" />
              <span className="text-white text-sm font-medium">Sign in to chat</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleSendMessage}
          disabled={message.trim() === '' || isGuest}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${
            message.trim() === '' || isGuest
              ? 'bg-background-tertiary/50 text-text-secondary cursor-not-allowed'
              : 'bg-accent-secondary text-white hover:bg-accent-secondary/90'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GuestAwareChatInput; 