'use client';

import React from 'react';

interface SendButtonProps {
  disabled: boolean;
}

export default function SendButton({ disabled }: SendButtonProps) {
  return (
    <button 
      type="submit" 
      disabled={disabled} 
      className={`py-2 px-4 rounded-md ${
        disabled 
          ? 'bg-indigo-500/50 text-white/70 cursor-not-allowed' 
          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
      } transition-colors`}
      aria-label="Send message"
    >
      Send
    </button>
  );
} 