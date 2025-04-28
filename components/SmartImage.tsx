'use client';

import Image, { ImageProps } from 'next/image';

interface SmartImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Make alt prop required
}

export default function SmartImage({ alt, ...props }: SmartImageProps) {
  return (
    <Image
      alt={alt}
      {...props}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/default-avatar.png';
      }}
      unoptimized // Vercel free plan friendly for small projects
    />
  );
} 