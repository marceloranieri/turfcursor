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

  // Common background elements
  const backgroundElements = (
    <>
      <div className="fixed inset-0 bg-cover bg-center z-0" 
           style={{ backgroundImage: "url('/turf_bg_social_signup.webp')" }}></div>
      <div className="fixed inset-0 bg-black opacity-30 z-10"></div>
    </>
  );

  // Server-side rendering fallback
  if (typeof window === 'undefined') {
    return (
      <>
        {backgroundElements}
        <div className="relative z-20">
          <DesktopAuthPage />
        </div>
      </>
    );
  }
  
  // Client-side rendering with responsive layout
  return (
    <>
      {backgroundElements}
      <div className="relative z-20">
        {isMobile ? <MobileAuthPage /> : <DesktopAuthPage />}
      </div>
    </>
  );
} 