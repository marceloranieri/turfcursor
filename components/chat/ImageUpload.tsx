'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onCancel: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onCancel,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      alert('Please select an image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 right-0 bg-background-secondary rounded-lg shadow-lg p-2"
          >
            <div className="relative">
              <Image
                src={preview}
                alt="Upload preview"
                width={200}
                height={200}
                className="rounded-lg max-w-[200px] max-h-[200px] object-contain"
              />
              <button
                onClick={onCancel}
                className="absolute top-1 right-1 p-1 rounded-full bg-background-primary/80 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Cancel upload"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="loading-spinner" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 