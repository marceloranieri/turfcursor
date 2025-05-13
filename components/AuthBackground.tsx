"use client";

import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export default function AuthBackground({ 
  children, 
  overlayOpacity = 0.3 
}: AuthBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('/turf_bg_social_signup.webp')" }}
      />
      
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
} 