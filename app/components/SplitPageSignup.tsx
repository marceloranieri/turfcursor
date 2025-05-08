"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SplitPageSignup = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [activeMobileMessage, setActiveMobileMessage] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const supabase = createClientComponentClient();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Detect if the device is mobile/tablet
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Custom slides with user-provided content
  const slides = [
    {
      background: "bg-gray-900",
      image: "/star_rings_turf.webp",
      messages: [
        { 
          id: 1, 
          type: 'text', 
          username: 'JediMaster42',
          content: "Luke couldn't even resist a hologram of his sister lmao, Frodo carried that ring for MONTHS 💪", 
          position: 'left',
          top: '15%',
          left: '5%'
        },
        { 
          id: 2, 
          type: 'text',
          username: 'Tolkien_Lore', 
          content: "The Ring corrupts power. Luke's stronger = faster fall", 
          position: 'right',
          top: '25%',
          right: '5%'
        },
        { 
          id: 3, 
          type: 'text',
          username: 'ForceIsWithMe', 
          content: "Y'all forgetting Luke resisted Emperor's temptation…", 
          position: 'left',
          top: '35%',
          left: '10%'
        },
        { 
          id: 4, 
          type: 'text',
          username: 'HobbitFeet99', 
          content: "Luke? No way. Read the book: The Ring isn't about willpower, it's about humility!", 
          position: 'right',
          top: '45%',
          right: '8%'
        },
        { 
          id: 5, 
          type: 'text',
          username: 'DarthFrodo', 
          content: "Plot twist: Luke puts on the Ring and becomes invisible to the Force. Checkmate, Palpatine 🧠", 
          position: 'left',
          top: '55%',
          left: '7%'
        },
        { 
          id: 6, 
          type: 'text',
          username: 'EagleEyes', 
          content: "Frodo literally failed at the end though?? Sam was the real MVP of that quest", 
          position: 'right',
          top: '65%',
          right: '10%'
        },
        { 
          id: 7, 
          type: 'text',
          username: 'GondorCalling', 
          content: "The Force is basically just midichlorian mind control. The Ring would use that connection.", 
          position: 'left',
          bottom: '25%',
          left: '6%'
        },
        { 
          id: 8, 
          type: 'text',
          username: 'MiddleEarthScience', 
          content: "Am I the only one wondering if lightsabers could cut the Ring?", 
          position: 'right',
          bottom: '15%',
          right: '5%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Could Luke have resisted the One Ring better than Frodo? Or the Force just speeds up corruption?",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-900",
      image: "/music_turf.webp",
      messages: [
        { 
          id: 1, 
          type: 'text',
          username: 'BeatsMaker95', 
          content: "Sampling's just digital collage. Good artists copy, great artists steal", 
          position: 'left',
          top: '15%',
          left: '5%'
        },
        { 
          id: 2, 
          type: 'text',
          username: 'OldSchoolDJ', 
          content: "Kids these days think pressing ctrl+c ctrl+v is 'producing' smh my head", 
          position: 'right',
          top: '25%',
          right: '8%'
        },
        { 
          id: 3, 
          type: 'text',
          username: 'MusicTheory101', 
          content: "The problem isn't sampling, it's LAZY sampling. Add something new or don't bother!", 
          position: 'left',
          top: '35%',
          left: '7%'
        },
        { 
          id: 4, 
          type: 'text',
          username: 'VinylOnly', 
          content: "There hasn't been an original thought in music since 1978.", 
          position: 'right',
          top: '45%',
          right: '5%'
        },
        { 
          id: 5, 
          type: 'text',
          username: 'StreamingKing', 
          content: "Imagine if we told chefs they can't use ingredients others discovered.", 
          position: 'left',
          top: '55%',
          left: '10%'
        },
        { 
          id: 6, 
          type: 'text',
          username: 'AutotunedOut', 
          content: "Sampling used to require skill and crate-digging tbh…", 
          position: 'right',
          top: '65%',
          right: '8%'
        },
        { 
          id: 7, 
          type: 'text',
          username: 'DanceMixGirl', 
          content: "Without sampling we wouldn't have had Daft Punk, Chemical Brothers…", 
          position: 'left',
          bottom: '22%',
          left: '5%'
        },
        { 
          id: 8, 
          type: 'text',
          username: 'MusicalPurist', 
          content: "There's a difference between being influenced by something and straight up theft💰", 
          position: 'right',
          bottom: '12%',
          right: '5%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Is sampling the death of creativity? The line between art and lazy theft's getting blurrier.",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-900",
      image: "/gamer_turf.webp",
      messages: [
        { 
          id: 1, 
          type: 'text',
          username: 'OldGamerDad', 
          content: "My 8yo downloads 5 new games daily, plays each for 3 mins between ads. Kid's casino", 
          position: 'left',
          top: '15%',
          left: '5%'
        },
        { 
          id: 2, 
          type: 'text',
          username: 'DevLife24', 
          content: "As a small dev, those 'trash games' pay my bills. Not everyone has AAA studio resources 🤷‍♂️", 
          position: 'right',
          top: '25%',
          right: '8%'
        },
        { 
          id: 3, 
          type: 'text',
          username: 'BrainRotGang', 
          content: "Kids' 1st gaming experience is watching ads to get in-game currency, sad…", 
          position: 'left',
          top: '35%',
          left: '8%'
        },
        { 
          id: 4, 
          type: 'text',
          username: 'MobileCasual', 
          content: "The cream rises. Good mobile games still exist, you just gotta be willing to actually pay for them.", 
          position: 'right',
          top: '45%',
          right: '5%'
        },
        { 
          id: 5, 
          type: 'text',
          username: 'GameDesign101', 
          content: "Hot take: bad games teach kids to recognize quality. I played plenty of trash NES games growing up too 🕹️", 
          position: 'left',
          top: '55%',
          left: '6%'
        },
        { 
          id: 6, 
          type: 'text',
          username: 'TouchScreenHater', 
          content: "Remember when games were meant to be fun?", 
          position: 'right',
          top: '65%',
          right: '10%'
        },
        { 
          id: 7, 
          type: 'text',
          username: 'AdBlockPlus', 
          content: "Parents are using phones as babysitters. The games are just filling market demand,.", 
          position: 'left',
          bottom: '22%',
          left: '8%'
        },
        { 
          id: 8, 
          type: 'text',
          username: 'RetroRevival', 
          content: "Mobile gaming was a mistake. Return to gameboy. Reject modernity. Embrace cartridge. 🎮", 
          position: 'right',
          bottom: '12%',
          right: '6%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Quick dev, cheap games: app stores flooded with ad-soaked trash. Is the next gen of gamers growing up braindead?",
        textColor: "white"
      }
    },
    {
      background: "bg-gray-900",
      image: "/Turf_App.webp",
      messages: [
        { 
          id: 1, 
          type: 'text',
          username: 'GrassIsGreener', 
          content: "Loving Turf so far! Maybe add option to save custom map layouts?", 
          position: 'left',
          top: '30%',
          left: '10%'
        },
        { 
          id: 2, 
          type: 'text',
          username: 'NewUser23', 
          content: "Interface is clean but took me a while to figure out how friends lists work 👍", 
          position: 'right',
          top: '50%',
          right: '10%'
        },
        { 
          id: 3, 
          type: 'text',
          username: 'RegularJoe', 
          content: "The notification system needs work guys 📱", 
          position: 'left',
          bottom: '30%',
          left: '10%'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "From Beta to mainstream. Help us make Turf better.",
        textColor: "white"
      }
    },
  ];

  // Function for desktop message animation - show messages progressively
  useEffect(() => {
    // Clear any existing timeouts to prevent memory leaks
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    // Reset visible messages when slide changes
    setVisibleMessages([]);
    
    // Skip progressively showing messages on mobile
    if (isMobile) return;
    
    const currentMessages = slides[activeSlide].messages;
    
    // Create new timeouts to show messages progressively
    currentMessages.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setVisibleMessages(prev => [...prev, message.id]);
      }, 1000 + (index * 800));
      
      timeoutsRef.current.push(timeout);
    });
    
    // Auto-advance the carousel after all messages have been shown + 5 seconds
    const slideDuration = 1000 + (currentMessages.length * 800) + 5000;
    const advanceTimeout = setTimeout(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, slideDuration);
    
    timeoutsRef.current.push(advanceTimeout);
    
    // Cleanup timeouts on unmount or slide change
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [activeSlide, isMobile, slides]);

  // Function for mobile message animation - show one message at a time
  useEffect(() => {
    if (!isMobile) return;
    
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    const currentMessages = slides[activeSlide].messages;
    if (currentMessages.length === 0) return;
    
    // Reset active message when switching slides
    if (activeMobileMessage >= currentMessages.length) {
      setActiveMobileMessage(0);
      return;
    }
    
    // Handle message transitions
    setIsTransitioning(false);
    
    // Show next message after 3 seconds
    const messageTimeout = setTimeout(() => {
      setIsTransitioning(true);
      
      // After fade out, change to next message
      const transitionTimeout = setTimeout(() => {
        setActiveMobileMessage(prev => {
          if (prev + 1 >= currentMessages.length) {
            // When we reach the last message, prepare to go to next slide
            const slideChangeTimeout = setTimeout(() => {
              setActiveSlide(prevSlide => (prevSlide + 1) % slides.length);
            }, 500);
            
            timeoutsRef.current.push(slideChangeTimeout);
            return 0;
          }
          return prev + 1;
        });
        
        setIsTransitioning(false);
      }, 500); // Short transition time
      
      timeoutsRef.current.push(transitionTimeout);
    }, 3000); // Show each message for 3 seconds
    
    timeoutsRef.current.push(messageTimeout);
    
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [activeMobileMessage, activeSlide, isMobile, slides]);

  // Handle sign in
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

  // Render a message bubble for desktop view
  const renderDesktopMessage = (message: any) => {
    const isVisible = visibleMessages.includes(message.id);
    
    if (!isVisible) return null;
    
    // Position styles based on the message's position data
    const positionStyles = {
      position: 'absolute',
      zIndex: 20,
      maxWidth: '280px',
      ...(message.top && { top: message.top }),
      ...(message.bottom && { bottom: message.bottom }),
      ...(message.left && { left: message.left }),
      ...(message.right && { right: message.right }),
    } as React.CSSProperties;
    
    return (
      <div 
        key={message.id} 
        className="animate-in fade-in slide-in-from-bottom-3 duration-500" 
        style={positionStyles}
      >
        <div className={`flex flex-col ${message.position === 'left' ? 'items-start' : 'items-end'}`}>
          <div className={`rounded-xl px-3 py-2 shadow-lg ${message.position === 'left' ? 'bg-gray-800 border-l-4 border-blue-500' : 'bg-gray-800 border-r-4 border-green-500'}`}>
            <div className="text-sm font-semibold text-blue-400 mb-1">{message.username}</div>
            <div className="text-white">{message.content}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render a single message for mobile view
  const renderMobileMessage = () => {
    const currentMessages = slides[activeSlide].messages;
    if (currentMessages.length === 0 || activeMobileMessage >= currentMessages.length) {
      return null;
    }

    const message = currentMessages[activeMobileMessage];
    
    return (
      <div 
        className={`w-4/5 mx-auto transform transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100'}`}
      >
        <div className={`flex flex-col ${message.position === 'left' ? 'items-start' : 'items-end'}`}>
          <div className={`rounded-xl px-3 py-2 shadow-lg ${message.position === 'left' ? 'bg-gray-800 border-l-4 border-blue-500' : 'bg-gray-800 border-r-4 border-green-500'}`}>
            <div className="text-sm font-semibold text-blue-400 mb-1">{message.username}</div>
            <div className="text-white">{message.content}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Sign up form */}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center bg-white">
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
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Turf 👋</h1>
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
            <span className="mx-4 text-gray-500">Or sign in with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 border border-gray-300 p-3 rounded font-medium flex items-center justify-center hover:bg-gray-50 disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            
            <button 
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="flex-1 border border-gray-300 p-3 rounded font-medium flex items-center justify-center hover:bg-gray-50 disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Don't you have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
            
            <p className="text-gray-400 text-sm">© 2023 ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Turf Debate Carousel */}
      <div className="w-full md:w-1/2 relative overflow-hidden">
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
              
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              {/* Message display - different for mobile and desktop */}
              {isMobile ? (
                // Mobile: Show single message at a time
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {renderMobileMessage()}
                </div>
              ) : (
                // Desktop: Show multiple messages with positioning
                <div className="absolute inset-0">
                  {slide.messages.map(message => renderDesktopMessage(message))}
                </div>
              )}
              
              {/* Bottom bar with debate topic - explicitly set white text */}
              {slide.bottomBar && (
                <div 
                  className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center"
                  style={{ 
                    backgroundColor: slide.bottomBar.backgroundColor
                  }}
                >
                  <h3 className="text-lg md:text-xl font-medium text-white">{slide.bottomBar.text}</h3>
                </div>
              )}
              
              {/* Dots navigation */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2 z-30">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSlide(i);
                      setActiveMobileMessage(0); // Reset message index when changing slides
                      setVisibleMessages([]); // Reset visible messages
                    }}
                    aria-label={`Go to slide ${i + 1}`}
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