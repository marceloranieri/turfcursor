"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SignUpPage');

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const renderMessage = (message: any) => {
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
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        // Redirect to verification page or success page
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });

      if (signInError) {
        throw signInError;
      }
      // Redirect is handled by Supabase
    } catch (error: any) {
      console.error(`${provider} signup failed:`, error);
      setError(`Failed to sign up with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen">
      {/* Left side - Auth Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <img 
              src="/turf-logo.svg" 
              alt="Turf Logo" 
              className="h-8 mb-10" 
            />
            <h1 className="text-3xl font-bold mb-2">Welcome to Turf 👋</h1>
            <p className="text-gray-600">
              Chatrooms with daily-curated debates on your favorite topics.
              Fresh ideas, your kind of people.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com"
                className="w-full p-3 border bg-gray-100 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full p-3 border bg-gray-100 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition-colors focus:outline-none disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Social login divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSocialSignUp('google')} 
                disabled={isLoading}
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>
              
              <button 
                onClick={() => handleSocialSignUp('facebook')} 
                disabled={isLoading}
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                  />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-500 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </div>
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
