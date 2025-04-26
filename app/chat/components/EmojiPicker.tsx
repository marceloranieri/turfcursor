'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaceSmileIcon, XMarkIcon } from '@heroicons/react/24/outline';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleEmojiSelect = (emoji: any) => {
    onSelect(emoji.native);
    onClose();
  };
  
  return (
    <div 
      ref={pickerRef}
      className="emoji-picker-container absolute bottom-full left-0 mb-2 bg-background-tertiary rounded-md shadow-lg border border-background-primary"
    >
      <div className="emoji-picker-header flex justify-between items-center p-2 border-b border-background-primary">
        <div className="flex items-center">
          <FaceSmileIcon className="h-5 w-5 text-text-muted mr-2" />
          <span className="text-text-primary text-sm font-medium">Emoji Picker</span>
        </div>
        <button 
          onClick={onClose}
          className="text-text-muted hover:text-text-primary p-1"
          aria-label="Close emoji picker"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="emoji-picker-content p-2">
        {showPicker && (
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            skinTonePosition="none"
            previewPosition="none"
            searchPosition="none"
            navPosition="none"
            perLine={8}
            maxFrequentRows={1}
            emojiSize={20}
            emojiButtonSize={28}
          />
        )}
      </div>
    </div>
  );
} 