'use client';

import Image, { ImageProps } from 'next/image';

export default function SmartImage(props: ImageProps) {
  return (
    <Image
      {...props}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/default-avatar.png';
      }}
      unoptimized // Vercel free plan friendly for small projects
    />
  );
} 