"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SplitPageSignup = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();
  
  // Four different slides with their messages and positions
  const slides = [
    {
      background: "bg-gray-100",
      image: "/images/carousel-1.jpg", // Replace with your image path
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Bom dia, mãe 🤗 🧡', 
          time: '11:54', 
          position: 'right' as const,
          top: '50%',
          right: '10%'
        },
        { 
          id: 2, 
          type: 'heart', 
          content: '❤️', 
          position: 'right' as const,
          top: '55%',
          right: '15%'
        },
        { 
          id: 3, 
          type: 'voice', 
          duration: '0:03', 
          time: '11:57', 
          position: 'right' as const,
          top: '70%',
          left: '20%'
        },
        { 
          id: 4, 
          type: 'image', 
          content: '/images/message-image-1.jpg', // Replace with your image path
          time: '11:57', 
          position: 'right' as const,
          bottom: '25%',
          right: '5%'
        },
        { 
          id: 5, 
          type: 'text', 
          content: 'Quero logo outra viagem de família!', 
          time: '11:59', 
          position: 'right' as const,
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
      image: "/images/carousel-2.jpg", // Replace with your image path
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'What do you think about this topic?', 
          time: '10:42', 
          position: 'right' as const,
          top: '30%',
          right: '5%'
        },
        { 
          id: 2, 
          type: 'text', 
          content: 'I have some strong opinions on this!', 
          time: '10:43', 
          position: 'left' as const,
          top: '40%',
          left: '5%'
        },
        { 
          id: 3, 
          type: 'image', 
          content: '/images/message-image-2.jpg', // Replace with your image path
          time: '10:45', 
          position: 'right' as const,
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
      image: "/images/carousel-3.jpg", // Replace with your image path
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Have you seen the latest debate?', 
          time: '14:22', 
          position: 'left' as const,
          top: '35%',
          left: '10%'
        },
        { 
          id: 2, 
          type: 'voice', 
          duration: '0:15', 
          time: '14:24', 
          position: 'right' as const,
          top: '50%',
          right: '15%'
        },
        { 
          id: 3, 
          type: 'text', 
          content: 'Really interesting points!', 
          time: '14:26', 
          position: 'left' as const,
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
      image: "/images/carousel-4.jpg", // Replace with your image path
      messages: [
        { 
          id: 1, 
          type: 'text', 
          content: 'Join us for tonight\'s discussion!', 
          time: '18:05', 
          position: 'right' as const,
          top: '30%',
          right: '10%'
        },
        { 
          id: 2, 
          type: 'text', 
          content: 'What time does it start?', 
          time: '18:06', 
          position: 'left' as const,
          top: '45%',
          left: '5%'
        },
        { 
          id: 3, 
          type: 'text', 
          content: '8PM sharp! Don\'t miss it 😉', 
          time: '18:07', 
          position: 'right' as const,
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

  // Handle sign in with email
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // Successful login will be handled by the middleware redirecting to /dashboard or /chat
    } catch (error: any) {
      setError(error.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign in with Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Error signing in with Google');
      setLoading(false);
    }
  };

  // Handle sign in with Facebook
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Error signing in with Facebook');
      setLoading(false);
    }
  };

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
    } as React.CSSProperties;
    
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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Sign up form */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-6">
            <Image 
              src="/turf-logo.svg" 
              alt="Turf Logo" 
              width={120} 
              height={40} 
              priority 
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Welcome to Turf 👋</h1>
          <p className="text-gray-600 mb-6">
            Chatrooms with daily-curated debates on your favorite topics.
            <br />Fresh ideas, your kind of people.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@email.com" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6 text-right">
              <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white p-3 rounded font-medium mb-6 hover:bg-gray-700 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded font-medium flex items-center justify-center mb-4 hover:bg-gray-50 relative disabled:opacity-70"
          >
            <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <button 
            onClick={handleFacebookSignIn}
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded font-medium flex items-center justify-center mb-6 hover:bg-gray-50 relative disabled:opacity-70"
          >
            <svg className="w-5 h-5 absolute left-4" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Facebook'}
          </button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Don't you have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
            
            <Link href="/legal/privacy" className="text-gray-500 text-sm hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      {/* Right side - WhatsApp-style Carousel */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${slide.background} ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Background image */}
            <div className="relative w-full h-full">
              <img 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Message overlay - each message positioned absolutely on the image */}
              {slide.messages.map(message => renderMessage(message))}
              
              {/* Bottom bar with debate topic */}
              {slide.bottomBar && (
                <div 
                  className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center"
                  style={{ 
                    backgroundColor: slide.bottomBar.backgroundColor,
                    color: slide.bottomBar.textColor
                  }}
                >
                  <h3 className="text-xl font-medium">{slide.bottomBar.text}</h3>
                </div>
              )}
              
              {/* Dots navigation */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2 z-30">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitPageSignup; 