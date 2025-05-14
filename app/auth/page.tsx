"use client";

import { useEffect, useState } from 'react';
import DesktopAuthPage from '@/components/auth/DesktopAuthPage';
import MobileAuthPage from '@/components/auth/mobile/MobileAuthPage'; 

export default function AuthPage() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on the client-side
    if (typeof window !== 'undefined') {
      // Initial check
      setIsMobile(window.innerWidth < 1024);
      
      // Setup listener for resize events
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  // Show a loading state until we've determined which view to use
  if (typeof window === 'undefined') {
    return null;
  }
  
  return (
    <>
      {isMobile ? (
        <MobileAuthPage />
      ) : (
        <DesktopAuthPage mode="login" />
      )}
    </>
  );
} 