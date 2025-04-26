'use client';
import { InputHTMLAttributes } from 'react';

export default function DiscordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-3 transition-all"
    />
  );
} 