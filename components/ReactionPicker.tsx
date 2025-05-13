'use client';

import React from 'react';

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

export default function ReactionPicker({ onSelectEmoji, onClose }: ReactionPickerProps) {
  // Common emoji reactions based on the Message component
  const commonEmojis = ['👍', '👎', '❤️', '😂', '😮', '🎉', '🔥', '👀'];
  
  const handleEmojiSelect = (emoji: string) => {
    onSelectEmoji(emoji);
    onClose();
  };
  
  return (
    <div className="p-2 bg-background-secondary rounded-lg shadow-lg border border-background-tertiary">
      <div className="flex flex-wrap gap-2">
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-background-tertiary rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
} 