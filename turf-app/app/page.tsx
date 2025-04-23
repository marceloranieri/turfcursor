'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the AuthModal to avoid SSR issues
const AuthModal = dynamic(() => import('../components/AuthModal'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };
  
  const handleGuestMode = () => {
    // In a real app, we would set a guest flag in context or local storage
    localStorage.setItem('guestMode', 'true');
    router.push('/chat');
  };
  
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background-secondary">
        <div className="max-w-md w-full bg-background-secondary rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-accent-primary mb-2">Turf</h1>
            <p className="text-text-secondary">Daily Debates. Real Connections.</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleOpenAuth('signin')}
              className="button-primary w-full flex items-center justify-center py-3"
            >
              Sign In
            </button>
            
            <button 
              onClick={() => handleOpenAuth('signup')}
              className="button-secondary w-full flex items-center justify-center py-3"
            >
              Create Account
            </button>
            
            <Link 
              href="/onboarding"
              className="button-gold w-full flex items-center justify-center py-3"
            >
              Learn More
            </Link>
            
            <button 
              onClick={handleGuestMode}
              className="w-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors py-2"
            >
              Continue as Guest
            </button>
          </div>
          
          <div className="mt-8 text-center text-text-muted text-sm">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </main>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </>
  );
}
