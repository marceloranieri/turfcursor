"use client";

import { useEffect, useState } from 'react';
import MobileAuthPage from './MobileAuthPage';
import DesktopAuthPage from './DesktopAuthPage';

export default function AuthLayout() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on the client-side before accessing window
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkMobile();
      
      // Add resize listener
      window.addEventListener('resize', checkMobile);
      
      // Clean up event listener on component unmount
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Server-side rendering fallback (desktop first)
  if (typeof window === 'undefined') {
    return <DesktopAuthPage />;
  }
  
  // Client-side rendering with responsive layout
  return isMobile ? <MobileAuthPage /> : <DesktopAuthPage />;
} 