'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth/AuthContext';
import logger from '@/lib/logger';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onClose: () => void;
}

export function ImageUpload({ onUpload, onClose }: ImageUploadProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!user) {
      logger.error('No user found for image upload');
      return;
    }

    if (!file.type.startsWith('image/')) {
      logger.error('Invalid file type');
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      onUpload(publicUrl);
    } catch (error) {
      logger.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="absolute bottom-full mb-2 left-0 bg-background-secondary rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-text-primary">Upload Image</h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-accent-primary bg-accent-primary/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-t-transparent border-accent-primary rounded-full animate-spin" />
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Upload preview"
              width={200}
              height={200}
              className="rounded-lg max-h-[200px] w-auto object-contain mx-auto"
            />
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
            <p className="text-sm text-text-secondary mb-1">
              Drag and drop an image here
            </p>
            <p className="text-xs text-text-tertiary">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-3 py-1 text-sm bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors"
            >
              Browse Files
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
} 