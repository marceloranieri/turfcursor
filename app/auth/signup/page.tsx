"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        // Redirect to verification page or show success message
        router.push('/auth/verify-email');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : provider === 'facebook' ? {
            auth_type: 'reauthenticate'
          } : undefined,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // No need to handle redirect here as Supabase will handle it
    } catch (err: any) {
      setError(`${provider} sign up failed. Please try again.`);
      setIsLoading(false);
    }
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
              width={45}
              height={45}
              priority 
            />
          </div>
          
          <h1 className="text-[34px] leading-tight font-normal font-['SF_Compact_Rounded',_-apple-system,_Roboto,_Helvetica,_sans-serif] text-[#0C1421] mb-7">
            Welcome to Turf 👋
          </h1>
          
          <p className="text-[20px] leading-8 tracking-[0.2px] font-['SF_Pro_Display',_-apple-system,_Roboto,_Helvetica,_sans-serif] text-[#0C1421] mb-12">
            Chatrooms with daily-curated debates on your favorite topics.
            <br />Fresh ideas, your kind of people.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0C1421] mb-1.5">Email</label>
              <div className="mt-2 rounded-[12px] text-[#8897AD]">
                <div className="flex flex-col items-start justify-center p-[17px] rounded-[12px] border border-[#D4D7E3] bg-[#F7FBFF]">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Example@email.com"
                    className="w-full bg-transparent outline-none text-[#0C1421]"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0C1421] mb-1.5">Password</label>
              <div className="mt-2 rounded-[12px] text-[#8897AD]">
                <div className="flex flex-col items-start justify-center p-[17px] rounded-[12px] border border-[#D4D7E3] bg-[#F7FBFF]">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent outline-none text-[#0C1421]"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[12px] text-[20px] font-medium text-white bg-[#162D3A] hover:bg-[#162D3A]/90 focus:outline-none disabled:opacity-75 tracking-[0.2px]"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          
          <div className="mt-12 mb-6 flex items-center py-[10px] gap-4 text-[#294957] text-center">
            <div className="flex-grow h-[1px] bg-[#CFDFE2]"></div>
            <span>Or</span>
            <div className="flex-grow h-[1px] bg-[#CFDFE2]"></div>
          </div>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleSocialSignUp('google')}
              className="w-full flex items-center justify-center gap-4 py-3 px-[9px] rounded-[12px] bg-[#F3F9FA] text-[#313957]"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span className="w-[159px]">Sign up with Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialSignUp('facebook')}
              className="w-full flex items-center justify-center gap-4 py-3 px-[9px] rounded-[12px] bg-[#F3F9FA] text-[#313957]"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              <span className="w-[159px]">Sign up with Facebook</span>
            </button>
          </div>
          
          <p className="mt-12 text-center text-[18px] leading-[1.6] tracking-[0.18px] text-[#313957]">
            Already have an account? <a href="/auth/signin" className="text-[#1E4AE9]">Sign in</a>
          </p>
          
          <p className="mt-12 text-center text-[14px] leading-[1.6] tracking-[0.14px] text-[#AEAEB2]">
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
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

export default SignUpPage;
