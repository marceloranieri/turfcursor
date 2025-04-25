import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { FaceSmileIcon, PhotoIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import GiphySearch from './GiphySearch';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'gif') => void;
  replyingTo?: string;
  onCancelReply?: () => void;
  placeholder?: string;
  isAuthenticated: boolean;
  onAuthPrompt: () => void;
}

export default function ChatInput({
  onSendMessage,
  replyingTo,
  onCancelReply,
  placeholder = 'Type a message...',
  isAuthenticated,
  onAuthPrompt
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifSearch, setShowGifSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Common emoji set for quick selection
  const commonEmojis = ['👍', '👎', '❤️', '😂', '😮', '🎉', '🤔', '👏'];
  
  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      onAuthPrompt();
      return;
    }
    
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
      // Re-focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Send message on Enter (without shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && isAuthenticated) {
        onSendMessage(message.trim(), 'text');
        setMessage('');
      } else if (!isAuthenticated) {
        onAuthPrompt();
      }
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };
  
  const handleGifSelect = (gifUrl: string) => {
    onSendMessage(gifUrl, 'gif');
    setShowGifSearch(false);
    // Re-focus the input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };
  
  // Close emoji and gif pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showEmojiPicker || showGifSearch) {
        // Check if the click is inside the form or pickers
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
          setShowEmojiPicker(false);
          setShowGifSearch(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker, showGifSearch]);
  
  return (
    <div className="pt-2 border-t border-background-secondary">
      {/* Reply indicator if replying to a message */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-tertiary mb-2 rounded-md">
          <div className="text-text-secondary text-sm">
            Replying to a message
          </div>
          <button 
            type="button"
            className="text-text-muted hover:text-danger"
            onClick={onCancelReply}
          >
            Cancel
          </button>
        </div>
      )}
      
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center px-3 py-2 relative">
        {/* Emoji button */}
        <button 
          type="button"
          className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-background-tertiary"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowGifSearch(false);
          }}
        >
          <FaceSmileIcon className="h-5 w-5" />
        </button>
        
        {/* GIF button */}
        <button 
          type="button"
          className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-background-tertiary"
          onClick={() => {
            setShowGifSearch(!showGifSearch);
            setShowEmojiPicker(false);
          }}
        >
          <PhotoIcon className="h-5 w-5" />
        </button>
        
        {/* Attachment button */}
        <button 
          type="button"
          className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-background-tertiary"
        >
          <PaperClipIcon className="h-5 w-5" />
        </button>
        
        {/* Message input */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field mx-2 flex-1"
          aria-label="Message content"
        />
        
        {/* Send button */}
        <button 
          type="submit"
          className={`py-2 px-4 rounded-md ${message.trim() ? 'button-primary' : 'button-primary opacity-50 cursor-not-allowed'}`}
          disabled={!message.trim()}
        >
          Send
        </button>
        
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 bg-background-tertiary rounded-lg p-2 shadow-lg z-10">
            <div className="grid grid-cols-8 gap-1">
              {commonEmojis.map(emoji => (
                <button 
                  key={emoji}
                  type="button"
                  className="p-2 hover:bg-background-secondary rounded-md"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* GIF search */}
        {showGifSearch && (
          <div className="absolute bottom-16 left-0 right-0 bg-background-tertiary rounded-lg p-2 shadow-lg z-10 max-h-60 overflow-y-auto">
            <GiphySearch onSelect={handleGifSelect} onClose={() => setShowGifSearch(false)} />
          </div>
        )}
      </form>
    </div>
  );
} 