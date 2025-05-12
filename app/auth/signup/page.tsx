// TEST CHANGE: $(date) - Verifying deployment pipeline
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { createLogger } from '@/lib/logger';
import { supabase } from '@/lib/supabase/client';  // Use a consistent import

const logger = createLogger('SignUpPage');

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Four different slides with their messages and positions
  const slides = [
    {
      background: "bg-gray-100",
      image: "/images/carousel/debate-topics.jpg",
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Bom dia, mãe 🤗 🧡', 
          time: '11:54', 
          position: 'right',
          top: '50%',
          right: '10%'
        },
        { 
          id: 2, 
          type: 'heart', 
          content: '❤️', 
          position: 'right',
          top: '55%',
          right: '15%'
        },
        { 
          id: 3, 
          type: 'voice', 
          duration: '0:03', 
          time: '11:57', 
          position: 'right',
          top: '70%',
          left: '20%'
        },
        { 
          id: 4, 
          type: 'image', 
          content: '/images/carousel/message-image-1.jpg',
          time: '11:57', 
          position: 'right',
          bottom: '25%',
          right: '5%'
        },
        { 
          id: 5, 
          type: 'text', 
          content: 'Quero logo outra viagem de família!', 
          time: '11:59', 
          position: 'right',
          bottom: '15%',
          left: '2%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Should violent movies be restricted to adult audiences only?",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-100",
      image: "/images/carousel/reputation.jpg",
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'What do you think about this topic?', 
          time: '10:42', 
          position: 'right',
          top: '30%',
          right: '5%'
        },
        { 
          id: 2, 
          type: 'text', 
          content: 'I have some strong opinions on this!', 
          time: '10:43', 
          position: 'left',
          top: '40%',
          left: '5%'
        },
        { 
          id: 3, 
          type: 'image', 
          content: '/images/carousel/message-image-2.jpg',
          time: '10:45', 
          position: 'right',
          bottom: '30%',
          right: '10%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Is social media making us more or less connected?",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-100",
      image: "/images/carousel/connect.jpg",
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Have you seen the latest debate?', 
          time: '14:22', 
          position: 'left',
          top: '35%',
          left: '10%'
        },
        { 
          id: 2, 
          type: 'voice', 
          duration: '0:15', 
          time: '14:24', 
          position: 'right',
          top: '50%',
          right: '15%'
        },
        { 
          id: 3, 
          type: 'text', 
          content: 'Really interesting points!', 
          time: '14:26', 
          position: 'left',
          bottom: '25%',
          left: '15%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Should healthcare be free for everyone?",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-100",
      image: "/images/carousel/expand.jpg",
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Join us for tonight\'s discussion!', 
          time: '18:05', 
          position: 'right',
          top: '30%',
          right: '10%'
        },
        { 
          id: 2, 
          type: 'text', 
          content: 'What time does it start?', 
          time: '18:06', 
          position: 'left',
          top: '45%',
          left: '5%'
        },
        { 
          id: 3, 
          type: 'text', 
          content: '8PM sharp! Don\'t miss it 😉', 
          time: '18:07', 
          position: 'right',
          bottom: '30%',
          right: '5%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Is technology improving or harming education?",
        textColor: "white"
      }
    },
  ];

  // Function to animate message appearance
  useEffect(() => {
    setVisibleMessages([]);
    
    const currentMessages = slides[activeSlide].messages;
    
    currentMessages.forEach((message, index) => {
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, message.id]);
      }, 1000 + (index * 800)); // Show each message with a delay
    });
    
    // Auto-advance the carousel
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Change slide every 8 seconds
    
    return () => clearTimeout(timer);
  }, [activeSlide]);

  // Render a message bubble with precise positioning
  const renderMessage = (message) => {
    const isVisible = visibleMessages.includes(message.id);
    
    if (!isVisible) return null;
    
    // Position styles based on the message's position data
    const positionStyles = {
      position: 'absolute',
      zIndex: 20,
      ...(message.top && { top: message.top }),
      ...(message.bottom && { bottom: message.bottom }),
      ...(message.left && { left: message.left }),
      ...(message.right && { right: message.right }),
    };
    
    return (
      <div key={message.id} className="animate-in fade-in duration-300 slide-in-from-bottom-3" style={positionStyles}>
        <div className={`flex flex-col ${message.position === 'left' ? 'items-start' : 'items-end'}`}>
          {message.type === 'text' && (
            <div className={`rounded-2xl px-3 py-2 shadow-sm ${message.position === 'left' ? 'bg-white' : 'bg-green-100'} max-w-xs`}>
              {message.content}
              <div className="text-xs text-gray-400 text-right mt-1">{message.time}</div>
            </div>
          )}
          
          {message.type === 'heart' && (
            <div className="text-2xl">
              {message.content}
            </div>
          )}
          
          {message.type === 'image' && (
            <div className={`rounded-lg overflow-hidden border ${message.position === 'left' ? 'border-gray-200' : 'border-green-200'} max-w-xs`}>
              <img src={message.content} alt="Shared image" className="w-48 h-36 object-cover" />
              <div className="text-xs text-gray-400 text-right p-1">{message.time}</div>
            </div>
          )}
          
          {message.type === 'voice' && (
            <div className={`flex items-center gap-2 rounded-full px-3 py-2 ${message.position === 'left' ? 'bg-white' : 'bg-white'} shadow-sm`}>
              <div className="text-gray-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#25D366" />
                  <path d="M9 8L16 12L9 16V8Z" fill="white" />
                </svg>
              </div>
              <div className="flex-1 h-6 w-32">
                <div className="bg-gray-200 h-full rounded-full relative">
                  <div className="absolute inset-0 flex items-center justify-between px-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-0.5 bg-gray-400" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{message.duration}</div>
              <div className="text-xs text-gray-400 ml-1">{message.time}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      // Check if a verification email is required
      const needsEmailVerification = !data.session && data.user;
      
      if (needsEmailVerification) {
        // Set a flag for verification page
        localStorage.setItem('pendingVerification', 'true');
        router.push('/auth/verify-email');
      } else if (data.session) {
        // User was auto-signed in, go to dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      logger.error('Sign up error:', error);
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      // The redirect will happen automatically by Supabase
    } catch (error: any) {
      logger.error(`${provider} sign up error:`, error);
      setError(error.message || `An error occurred during ${provider} sign up`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen">
      {/* Left side - Auth Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome to Turf 👋</h1>
          <p className="mb-8 text-gray-600">
            Chatrooms with daily-curated debates on your favorite topics. 
            Fresh ideas, your kind of people.
          </p>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialSignUp('google')}
                disabled={isLoading}
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialSignUp('facebook')}
                disabled={isLoading}
              >
                <Icons.facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Right side - Chat preview */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {slides[activeSlide].messages.map((message) => renderMessage(message))}
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
          style={{ backgroundColor: slides[activeSlide].bottomBar.backgroundColor }}
        >
          {slides[activeSlide].bottomBar.text}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
