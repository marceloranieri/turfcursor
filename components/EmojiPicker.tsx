'use client';

import { useState, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from 'next-themes';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  isOpen: boolean;
}

export default function EmojiPicker({ onEmojiSelect, isOpen }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render the picker after mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-16 right-0 z-50">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <Picker
          data={data}
          onEmojiSelect={onEmojiSelect}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          previewPosition="none"
          skinTonePosition="none"
        />
      </div>
    </div>
  );
} 