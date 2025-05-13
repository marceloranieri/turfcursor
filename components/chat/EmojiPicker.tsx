'use client';

import React, { useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme/ThemeContext';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  onClose,
  position = 'top',
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={pickerRef}
        className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-50`}
        initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="bg-background-secondary rounded-lg shadow-lg overflow-hidden">
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
            theme={isDarkMode ? 'dark' : 'light'}
            previewPosition="none"
            skinTonePosition="none"
            searchPosition="none"
            navPosition="none"
            perLine={8}
            maxFrequentRows={2}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 