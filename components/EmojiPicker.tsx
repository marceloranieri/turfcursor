'use client';

import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose, className = '' }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleSelect = (emoji: { native: string }) => {
    setSelectedEmoji(emoji.native);
    onSelect(emoji.native);
    onClose?.();
  };

  return (
    <div className={`relative ${className}`}>
      <Picker
        data={data}
        onEmojiSelect={handleSelect}
        theme="light"
        previewPosition="none"
        skinTonePosition="none"
        searchPosition="none"
        navPosition="none"
        perLine={8}
        maxFrequentRows={0}
      />
    </div>
  );
};

export default EmojiPicker; 