'use client';

import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, className = '' }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleSelect = (emoji: { native: string }) => {
    setSelectedEmoji(emoji.native);
    onSelect(emoji.native);
  };

  return (
    <div className={`relative ${className}`}>
      <Picker
        data={data}
        onEmojiSelect={handleSelect}
        theme="auto"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
};

export default EmojiPicker; 