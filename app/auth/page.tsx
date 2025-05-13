"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DesktopAuthPage from '@/components/auth/DesktopAuthPage'; 

// Dynamically import the MobileAuthPage component to avoid SSR issues
const MobileAuthPage = dynamic(() => import('@/components/auth/mobile/MobileAuthPage'), {
  ssr: false,
});

export default function AuthPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Initial check
    checkDevice();
    
    // Listen for resize events
    window.addEventListener('resize', checkDevice);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Show mobile UI for mobile devices or tablets in portrait mode
  const showMobileUI = isMobile || (window.innerWidth < 1024 && isPortrait);
  
  // Use DesktopAuthPage as a fallback for SSR
  if (typeof window === 'undefined') {
    return <DesktopAuthPage />;
  }
  
  return showMobileUI ? <MobileAuthPage /> : <DesktopAuthPage />;
} 