"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Add type definitions
interface Message {
  id: number;
  username: string;
  content: string;
  position: 'left' | 'right';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  reaction: string | null;
  avatar?: string;
}

interface Slide {
  background: string;
  image: string;
  messages: Message[];
  bottomBar: {
    backgroundColor: string;
    text: string;
    textColor: string;
  };
}

interface BubblePosition {
  left: string | null;
  right: string | null;
  top: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UsedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenSection {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

// Add utility function for avatar paths
const getAvatarPath = (username: string): string => {
  const cleanUsername = username.replace(/\s+/g, '');
  return `/${cleanUsername}.png`;
};

// Add DebugAvatarImage component
const DebugAvatarImage = ({ src, alt }: { src: string; alt: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  useEffect(() => {
    console.log(`Attempting to load avatar: ${src}`);
    
    const img = new Image();
    img.onload = () => {
      console.log(`Successfully loaded avatar: ${src}`);
      setStatus('loaded');
    };
    img.onerror = () => {
      console.error(`Failed to load avatar: ${src}`);
      setStatus('error');
    };
    img.src = src;
  }, [src]);
  
  return (
    <div className="relative">
      <img 
        src={status === 'error' ? '/default-avatar.svg' : src}
        alt={alt}
        className={`w-8 h-8 rounded-full object-cover border-2 ${
          status === 'loaded' ? 'border-white' : 'border-gray-200'
        }`}
      />
      {status === 'error' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
};

// ChatBubble component to handle individual messages
const ChatBubble = ({ message, position }: { message: Message; position: 'left' | 'right' }) => {
  const { username, avatar, content, reaction } = message;
  
  return (
    <div className={`flex ${position === 'left' ? 'flex-row' : 'flex-row-reverse'} mb-4 animate-fadeIn`}>
      {/* User Avatar */}
      <div className={`flex-shrink-0 ${position === 'left' ? 'mr-2' : 'ml-2'}`}>
        <img 
          src={avatar} 
          alt={username} 
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
        />
      </div>
      
      {/* Message Content */}
      <div className={`flex flex-col ${position === 'left' ? 'items-start' : 'items-end'}`}>
        <div className="text-sm font-semibold text-white mb-1">{username}</div>
        <div className="rounded-xl px-3 py-2 bg-gray-100 text-gray-800 shadow-md relative">
          {content}
          
          {/* Reaction */}
          {reaction && (
            <div className="absolute -bottom-2 right-0 bg-white rounded-full px-1 py-1 shadow-md text-sm">
              {reaction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SplitPageSignup = () => {
  // Essential state
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMessageIndex, setMobileMessageIndex] = useState(0);
  
  // Track timers to prevent memory leaks
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const initialized = useRef(false);
  
  const supabase = createClientComponentClient();
  
  // Content data - simplified without full avatar paths
  const slides: Slide[] = [
    {
      background: "bg-gray-900",
      image: "/star_rings_turf.webp",
      messages: [
        { 
          id: 1, 
          username: 'JediMaster42',
          content: "Luke couldn't even resist a hologram of his sister lmao, Frodo carried that ring for MONTHS 💪", 
          position: 'left',
          top: '15%',
          left: '5%',
          reaction: null
        },
        { 
          id: 2, 
          username: 'Tolkien_Lore',
          content: "The Ring corrupts power. Luke's stronger = faster fall", 
          position: 'right',
          top: '25%',
          right: '5%',
          reaction: null
        },
        { 
          id: 3, 
          username: 'ForceIsWithMe',
          content: "Y'all forgetting Luke resisted Emperor's temptation…", 
          position: 'left',
          top: '35%',
          left: '10%',
          reaction: '👍'
        },
        { 
          id: 4, 
          username: 'HobbitFeet99',
          content: "Luke? No way. Read the book: The Ring isn't about willpower, it's about humility!", 
          position: 'right',
          top: '45%',
          right: '8%',
          reaction: null
        },
        { 
          id: 5, 
          username: 'DarthFrodo',
          content: "Plot twist: Luke puts on the Ring and becomes invisible to the Force. Checkmate, Palpatine 🧠", 
          position: 'left',
          top: '55%',
          left: '7%',
          reaction: '🤣'
        },
        { 
          id: 6, 
          username: 'EagleEyes',
          content: "Frodo literally failed at the end though?? Sam was the real MVP of that quest", 
          position: 'right',
          top: '65%',
          right: '10%',
          reaction: null
        },
        { 
          id: 7, 
          username: 'GondorCalling',
          content: "The Force is basically just midichlorian mind control. The Ring would use that connection.", 
          position: 'left',
          bottom: '25%',
          left: '6%',
          reaction: null
        },
        { 
          id: 8, 
          username: 'MiddleEarthScience',
          content: "Am I the only one wondering if lightsabers could cut the Ring?", 
          position: 'right',
          bottom: '15%',
          right: '5%',
          reaction: '🤔'
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
          username: 'BeatsMaker95',
          content: "Sampling's just digital collage. Good artists copy, great artists steal", 
          position: 'left',
          top: '15%',
          left: '5%',
          reaction: null
        },
        { 
          id: 2, 
          username: 'OldSchoolDJ',
          content: "Kids these days think pressing ctrl+c ctrl+v is 'producing' smh my head", 
          position: 'right',
          top: '25%',
          right: '8%',
          reaction: null
        },
        { 
          id: 3, 
          username: 'MusicTheory101',
          content: "The problem isn't sampling, it's LAZY sampling. Add something new or don't bother!", 
          position: 'left',
          top: '35%',
          left: '7%',
          reaction: '💯'
        },
        { 
          id: 4, 
          username: 'VinylOnly',
          content: "There hasn't been an original thought in music since 1978.", 
          position: 'right',
          top: '45%',
          right: '5%',
          reaction: null
        },
        { 
          id: 5, 
          username: 'StreamingKing',
          content: "Imagine if we told chefs they can't use ingredients others discovered.", 
          position: 'left',
          top: '55%',
          left: '10%',
          reaction: '👏'
        },
        { 
          id: 6, 
          username: 'AutotunedOut',
          content: "Sampling used to require skill and crate-digging tbh…", 
          position: 'right',
          top: '65%',
          right: '8%',
          reaction: null
        },
        { 
          id: 7, 
          username: 'DanceMixGirl',
          content: "Without sampling we wouldn't have had Daft Punk, Chemical Brothers…", 
          position: 'left',
          bottom: '22%',
          left: '5%',
          reaction: null
        },
        { 
          id: 8, 
          username: 'MusicalPurist',
          content: "There's a difference between being influenced by something and straight up theft💰", 
          position: 'right',
          bottom: '12%',
          right: '5%',
          reaction: null
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
          username: 'OldGamerDad',
          content: "My 8yo downloads 5 new games daily, plays each for 3 mins between ads. Kid's casino", 
          position: 'left',
          top: '15%',
          left: '5%',
          reaction: null
        },
        { 
          id: 2, 
          username: 'DevLife24',
          content: "As a small dev, those 'trash games' pay my bills. Not everyone has AAA studio resources 🤷‍♂️", 
          position: 'right',
          top: '25%',
          right: '8%',
          reaction: null
        },
        { 
          id: 3, 
          username: 'BrainRotGang',
          content: "Kids' 1st gaming experience is watching ads to get in-game currency, sad…", 
          position: 'left',
          top: '35%',
          left: '8%',
          reaction: '😢'
        },
        { 
          id: 4, 
          username: 'MobileCasual',
          content: "The cream rises. Good mobile games still exist, you just gotta be willing to actually pay for them.", 
          position: 'right',
          top: '45%',
          right: '5%',
          reaction: null
        },
        { 
          id: 5, 
          username: 'GameDesign101',
          content: "Hot take: bad games teach kids to recognize quality. I played plenty of trash NES games growing up too 🕹️", 
          position: 'left',
          top: '55%',
          left: '6%',
          reaction: '😂'
        },
        { 
          id: 6, 
          username: 'TouchScreenHater',
          content: "Remember when games were meant to be fun?", 
          position: 'right',
          top: '65%',
          right: '10%',
          reaction: null
        },
        { 
          id: 7, 
          username: 'AdBlockPlus',
          content: "Parents are using phones as babysitters. The games are just filling market demand,.", 
          position: 'left',
          bottom: '22%',
          left: '8%',
          reaction: null
        },
        { 
          id: 8, 
          username: 'RetroRevival',
          content: "Mobile gaming was a mistake. Return to gameboy. Reject modernity. Embrace cartridge. 🎮", 
          position: 'right',
          bottom: '12%',
          right: '6%',
          reaction: '👍'
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
          username: 'GrassIsGreener',
          content: "Loving Turf so far! Maybe add option to save custom map layouts?", 
          position: 'left',
          top: '30%',
          left: '10%',
          reaction: null
        },
        { 
          id: 2, 
          username: 'NewUser23',
          content: "Interface is clean but took me a while to figure out how friends lists work 👍", 
          position: 'right',
          top: '50%',
          right: '10%',
          reaction: null
        },
        { 
          id: 3, 
          username: 'RegularJoe',
          content: "The notification system needs work guys 📱", 
          position: 'left',
          bottom: '30%',
          left: '10%',
          reaction: '👍'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "From Beta to mainstream. Help us make Turf better.",
        textColor: "white"
      }
    },
  ];

  // Add bubble positions state
  const [bubblePositions, setBubblePositions] = useState<BubblePosition[]>([]);
  
  // Clean up timers on component unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Start initialization after component mounts
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startDesktopAnimation();
    }
  }, []);

  // Start desktop message animations
  const startDesktopAnimation = () => {
    if (isMobile) return;
    
    // Clear any existing timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    
    // Reset visible messages
    setVisibleMessages([]);
    
    // Critical debugging - log the active slide and messages
    console.log(`Starting animation for slide ${activeSlide} with ${slides[activeSlide].messages.length} messages`);
    
    // Show messages progressively with debugging
    slides[activeSlide].messages.forEach((message, index) => {
      const timer = setTimeout(() => {
        console.log(`Showing message ${message.id} at position ${message.position}, top: ${message.top}, left: ${message.left}, right: ${message.right}`);
        setVisibleMessages(prev => [...prev, message.id]);
      }, 1000 + (index * 800));
      
      timersRef.current.push(timer);
    });
    
    // Auto-advance carousel after delay
    const slideChangeTime = 1000 + (slides[activeSlide].messages.length * 800) + 4000;
    const advanceTimer = setTimeout(() => {
      setActiveSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        console.log(`Advancing to next slide: ${nextSlide}`);
        return nextSlide;
      });
    }, slideChangeTime);
    
    timersRef.current.push(advanceTimer);
  };

  // Handle slide changes
  useEffect(() => {
    if (isMobile) {
      // For mobile, reset message index and start mobile animation
      setMobileMessageIndex(0);
      startMobileAnimation();
    } else {
      // For desktop, start desktop animation
      startDesktopAnimation();
    }
  }, [activeSlide, isMobile]);

  // Mobile message cycling
  const startMobileAnimation = () => {
    if (!isMobile) return;
    
    // Clear existing timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    
    const currentSlide = slides[activeSlide];
    if (!currentSlide.messages.length) return;
    
    // Cycle to next message after delay
    const timer = setTimeout(() => {
      setMobileMessageIndex(prev => {
        const nextIndex = prev + 1;
        
        // If we've shown all messages, advance to next slide
        if (nextIndex >= currentSlide.messages.length) {
          const slideChangeTimer = setTimeout(() => {
            setActiveSlide(prevSlide => (prevSlide + 1) % slides.length);
          }, 1000);
          
          timersRef.current.push(slideChangeTimer);
          return 0;
        }
        
        return nextIndex;
      });
    }, 3000);
    
    timersRef.current.push(timer);
  };
  
  // Restart mobile animation when message index changes
  useEffect(() => {
    if (isMobile) {
      startMobileAnimation();
    }
  }, [mobileMessageIndex, isMobile]);

  // Authentication handlers
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

  // Manual slide navigation (hidden function but kept for functionality)
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setVisibleMessages([]);
    setMobileMessageIndex(0);
    
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  // Add positioning utility functions
  const createNonOverlappingPositions = (messageCount: number): BubblePosition[] => {
    const screenSections: ScreenSection[] = [
      { xStart: 5, xEnd: 30, yStart: 10, yEnd: 35 },    // Top left
      { xStart: 70, xEnd: 95, yStart: 10, yEnd: 35 },   // Top right
      { xStart: 5, xEnd: 30, yStart: 40, yEnd: 65 },    // Bottom left
      { xStart: 70, xEnd: 95, yStart: 40, yEnd: 65 }    // Bottom right
    ];
    
    const positions: BubblePosition[] = [];
    const usedAreas: UsedArea[] = [];
    const bubbleSize = { width: 300, height: 100 };
    const safetyMargin = 20;
    
    const wouldOverlap = (x: number, y: number): boolean => {
      for (const area of usedAreas) {
        if (
          x < area.x + area.width + safetyMargin &&
          x + bubbleSize.width + safetyMargin > area.x &&
          y < area.y + area.height + safetyMargin &&
          y + bubbleSize.height + safetyMargin > area.y
        ) {
          return true;
        }
      }
      return false;
    };
    
    const assignedSections = [...Array(messageCount)].map((_, i) => 
      i % screenSections.length
    ).sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < messageCount; i++) {
      const section = screenSections[assignedSections[i]];
      let attempts = 0;
      let position;
      
      do {
        const xPercent = Math.random() * (section.xEnd - section.xStart) + section.xStart;
        const yPercent = Math.random() * (section.yEnd - section.yStart) + section.yStart;
        
        position = {
          left: xPercent < 50 ? `${xPercent}%` : null,
          right: xPercent >= 50 ? `${100 - xPercent}%` : null,
          top: `${yPercent}%`,
          x: (xPercent / 100) * window.innerWidth,
          y: (yPercent / 100) * window.innerHeight,
          width: bubbleSize.width,
          height: bubbleSize.height
        };
        
        attempts++;
      } while (wouldOverlap(position.x, position.y) && attempts < 20);
      
      positions.push(position);
      usedAreas.push({
        x: position.x,
        y: position.y,
        width: bubbleSize.width,
        height: bubbleSize.height
      });
    }
    
    return positions;
  };

  // Update effect to use new positioning
  useEffect(() => {
    if (!isMobile && typeof window !== 'undefined') {
      const messages = slides[activeSlide]?.messages || [];
      setBubblePositions(createNonOverlappingPositions(messages.length));
    }
  }, [activeSlide, isMobile]);

  // Add message bubble rendering function
  const renderMessageBubbles = (slide: Slide, visibleMessages: number[]) => {
    // Group messages into distinct columns to prevent overlap
    const leftColumnMessages: Message[] = [];
    const rightColumnMessages: Message[] = [];
    
    // Split messages between left and right columns evenly
    slide.messages.forEach((message: Message, index: number) => {
      if (index % 2 === 0) {
        leftColumnMessages.push(message);
      } else {
        rightColumnMessages.push(message);
      }
    });
    
    // Render function for a single message
    const renderMessage = (message: Message, verticalPosition: number, isLeftColumn: boolean) => {
      if (!visibleMessages.includes(message.id)) return null;
      
      return (
        <div
          key={`message-${message.id}`}
          className={`absolute ${isLeftColumn ? 'left-4' : 'right-4'}`}
          style={{
            top: `${10 + verticalPosition * 15}%`,
            maxWidth: '280px',
            zIndex: 20 + verticalPosition
          }}
        >
          <div className="flex items-start gap-2">
            {/* Avatar - always on left */}
            <div className="flex-shrink-0 mt-1">
              <DebugAvatarImage 
                src={getAvatarPath(message.username)}
                alt={message.username}
              />
            </div>
            
            {/* Message content */}
            <div className="flex flex-col">
              {/* Username with background for readability */}
              <div className="text-sm font-semibold text-white mb-1 px-2 py-0.5 bg-black bg-opacity-60 rounded-md inline-block">
                {message.username}
              </div>
              
              {/* Message bubble */}
              <div className="rounded-xl px-3 py-2 bg-white bg-opacity-90 text-gray-800 shadow-md relative">
                {message.content}
                
                {/* Reaction */}
                {message.reaction && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-1.5 py-1.5 shadow-md text-sm border border-gray-200">
                    {message.reaction}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    return (
      <>
        {/* Left column messages */}
        {leftColumnMessages.map((message: Message, idx: number) => 
          renderMessage(message, idx, true)
        )}
        
        {/* Right column messages */}
        {rightColumnMessages.map((message: Message, idx: number) => 
          renderMessage(message, idx, false)
        )}
      </>
    );
  };

  // Add debugging effect for avatar paths
  useEffect(() => {
    console.log("Public path check for avatars:");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Trying to access:", "/user_avatars/JediMaster42.webp");
    
    if (typeof window !== 'undefined') {
      fetch('/user_avatars/JediMaster42.webp')
        .then(response => {
          console.log("Avatar fetch response:", response.status, response.ok);
        })
        .catch(error => {
          console.error("Avatar fetch error:", error);
        });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Sign up form */}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-6">
            <img 
              src="/turf-logo.svg" 
              alt="Turf Logo" 
              className="h-10 w-auto"
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
      
      {/* Right side - Turf Debate Carousel (visible only on desktop) */}
      <div className={`${isMobile ? 'hidden' : 'block'} w-1/2 relative overflow-hidden`}>
        {slides.map((slide, index) => (
          <div 
            key={`desktop-slide-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Background image */}
            <img 
              src={slide.image} 
              alt={`Slide ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            {/* Desktop message bubbles - Fixed positioning, z-index and visibility */}
            {slide.messages.map(message => {
              const isVisible = visibleMessages.includes(message.id);
              
              if (!isVisible) return null;
              
              // Set explicit z-index to ensure bubbles appear above footer
              const positionStyles: React.CSSProperties = {
                position: 'absolute',
                zIndex: 50, // Significantly higher z-index to be above ALL content including footer
                maxWidth: '300px'
              };
              
              // Apply exact positioning from message data
              if (message.top) positionStyles.top = message.top;
              if (message.bottom) positionStyles.bottom = message.bottom;
              
              if (message.position === 'left') {
                positionStyles.left = message.left || '5%';
              } else {
                positionStyles.right = message.right || '5%';
              }
              
              return (
                <div
                  key={`desktop-message-${message.id}`}
                  style={positionStyles}
                  className="animate-fadeIn"
                >
                  <div className={`flex ${message.position === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* User avatar with correct path */}
                    <div className={`flex-shrink-0 ${message.position === 'left' ? 'mr-2' : 'ml-2'}`}>
                      <DebugAvatarImage 
                        src={getAvatarPath(message.username)}
                        alt={message.username}
                      />
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col ${message.position === 'left' ? 'items-start' : 'items-end'}`}>
                      <div className="text-sm font-semibold text-white mb-1 drop-shadow-md">
                        {message.username}
                      </div>
                      <div className="rounded-xl px-3 py-2 bg-gray-100 text-gray-800 shadow-md relative">
                        {message.content}
                        
                        {/* Reaction */}
                        {message.reaction && (
                          <div className="absolute -bottom-2 right-0 bg-white rounded-full px-1 py-1 shadow-md text-sm">
                            {message.reaction}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Bottom bar with topic */}
            <div 
              className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center z-20"
              style={{ backgroundColor: slide.bottomBar.backgroundColor }}
            >
              <h3 className="text-white text-lg md:text-xl font-medium">
                {slide.bottomBar.text}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile carousel - separate component for mobile */}
      {isMobile && (
        <div className="w-full h-screen absolute top-0 left-0 z-10 md:hidden">
          {/* Form overlay to ensure it's visible */}
          <div className="absolute inset-0 z-20 bg-white px-4 pt-4 pb-6 flex flex-col">
            <div className="mb-6">
              <img 
                src="/turf-logo.svg" 
                alt="Turf Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Welcome to Turf 👋</h1>
            <p className="text-gray-600 mb-6">
              Chatrooms with daily-curated debates on your favorite topics.
              <br />Fresh ideas, your kind of people.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="flex-1">
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
            
            <div className="text-center mt-auto">
              <p className="text-gray-600 mb-6">
                Don't you have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline">Sign up</Link>
              </p>
              
              <p className="text-gray-400 text-sm">© 2023 ALL RIGHTS RESERVED</p>
            </div>

            {/* Carousel at the bottom of mobile view */}
            <div className="fixed bottom-0 left-0 right-0 h-56 bg-gray-900 mt-4">
              {slides.map((slide, index) => (
                <div 
                  key={`mobile-slide-${index}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  {/* Background image */}
                  <img 
                    src={slide.image} 
                    alt={`Slide ${index + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  {/* Single message for mobile */}
                  {slide.messages[mobileMessageIndex] && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center p-4 z-50"
                    >
                      <div className="w-full max-w-sm mx-auto flex flex-col animate-fadeIn">
                        {/* User Avatar for Mobile */}
                        <div className="flex items-center mb-3">
                          <div className="flex-shrink-0 mr-3">
                            <DebugAvatarImage 
                              src={getAvatarPath(slide.messages[mobileMessageIndex].username)}
                              alt={slide.messages[mobileMessageIndex].username}
                            />
                          </div>
                          <div className="text-lg font-semibold text-white drop-shadow-md">
                            {slide.messages[mobileMessageIndex].username}
                          </div>
                        </div>
                        
                        {/* Message content for Mobile */}
                        <div className="bg-white bg-opacity-95 rounded-2xl p-4 shadow-xl relative">
                          <p className="text-gray-800 text-lg leading-relaxed">
                            {slide.messages[mobileMessageIndex].content}
                          </p>
                          
                          {/* Reaction for Mobile */}
                          {slide.messages[mobileMessageIndex].reaction && (
                            <div className="absolute -bottom-3 -right-3 bg-white rounded-full px-3 py-2 shadow-lg text-lg border border-gray-200">
                              {slide.messages[mobileMessageIndex].reaction}
                            </div>
                          )}
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="flex justify-center mt-6 gap-2">
                          {slide.messages.map((_, idx) => (
                            <div 
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === mobileMessageIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom bar with topic */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 py-2 px-4 text-center z-30"
                    style={{ backgroundColor: slide.bottomBar.backgroundColor }}
                  >
                    <h3 className="text-white text-sm font-medium">
                      {slide.bottomBar.text}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitPageSignup; 