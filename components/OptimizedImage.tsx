'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import logger from '@/lib/logger';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/images/placeholder.png',
  priority = false,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const handleError = (e: any) => {
    logger.warn(`Image failed to load: ${src}`);
    setError(true);
  };

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${error ? 'opacity-60' : ''}`}
      onError={handleError}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

// Also export a profile picture component that uses OptimizedImage
export function ProfilePicture({
  src,
  username,
  size = 40,
  className = '',
}: {
  src?: string | null;
  username: string;
  size?: number;
  className?: string;
}) {
  const fallbackSrc = '/images/default-avatar.png';
  
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <OptimizedImage
        src={src || fallbackSrc}
        alt={`${username}'s profile picture`}
        width={size}
        height={size}
        fallbackSrc={fallbackSrc}
        className="object-cover"
      />
    </div>
  );
} 