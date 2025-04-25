'use client'

import { useState, useEffect } from 'react';

interface HydrationSafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationSafeComponent({ 
  children, 
  fallback = <div className="loading-placeholder">Loading...</div> 
}: HydrationSafeComponentProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return fallback;
  }
  
  return <>{children}</>;
} 