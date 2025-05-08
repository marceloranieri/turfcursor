"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Add type definitions
interface Message {
  id: string;
  username: string;
  avatar: string;
  content: string;
  reaction: string | null;
  position: 'left' | 'right';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface Slide {
  id: string;
  image: string;
  messages: Message[];
  bottomBar: {
    text: string;
    backgroundColor: string;
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
  return `/user_avatars/${cleanUsername}.webp`;
};

// Add DebugAvatarImage component
const DebugAvatarImage = ({ src, alt }: { src: string; alt: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempts, setAttempts] = useState(0);
  
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
      
      if (attempts < 1) {
        setAttempts(prev => prev + 1);
        const newSrc = src.endsWith('.webp') 
          ? src.replace('.webp', '.png') 
          : src.replace('.png', '.webp');
        console.log(`Retrying with alternative format: ${newSrc}`);
      }
    };
    img.src = src;
  }, [src, attempts]);
  
  return (
    <div className="relative">
      <img 
        src={status === 'error' ? '/default-avatar.svg' : src}
        alt={alt}
        className={`w-8 h-8 rounded-full object-cover border-2 ${
          status === 'loaded' ? 'border-green-500' : 'border-gray-200'
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
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
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
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
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
  
  // Content data - updated with user avatars
  const slides: Slide[] = [
    {
      id: "1",
      image: "/star_rings_turf.webp",
      messages: [
        { 
          id: "1", 
          username: 'JediMaster42',
          avatar: '/users-avatars/JediMaster42.webp',
          content: "The Force is strong with this one... but the Ring's power is stronger. Luke would've been corrupted faster than Frodo.",
          reaction: "🤔",
          position: 'left'
        },
        { 
          id: "2", 
          username: 'Tolkien_Lore', 
          avatar: '/users-avatars/Tolkien_Lore.webp',
          content: "The Ring corrupts power. Luke's stronger = faster fall", 
          position: 'right',
          reaction: null
        },
        { 
          id: "3", 
          username: 'ForceIsWithMe', 
          avatar: '/users-avatars/ForceIsWithMe.webp',
          content: "Y'all forgetting Luke resisted Emperor's temptation…", 
          position: 'left',
          reaction: '👍'
        },
        { 
          id: "4", 
          username: 'HobbitFeet99', 
          avatar: '/users-avatars/HobbitFeet99.webp',
          content: "Luke? No way. Read the book: The Ring isn't about willpower, it's about humility!", 
          position: 'right',
          reaction: null
        },
        { 
          id: "5", 
          username: 'DarthFrodo', 
          avatar: '/users-avatars/DarthFrodo.webp',
          content: "Plot twist: Luke puts on the Ring and becomes invisible to the Force. Checkmate, Palpatine 🧠", 
          position: 'left',
          reaction: '🤣'
        },
        { 
          id: "6", 
          username: 'EagleEyes', 
          avatar: '/users-avatars/EagleEyes.webp',
          content: "Frodo literally failed at the end though?? Sam was the real MVP of that quest", 
          position: 'right',
          reaction: null
        },
        { 
          id: "7", 
          username: 'GondorCalling', 
          avatar: '/users-avatars/GondorCalling.webp',
          content: "The Force is basically just midichlorian mind control. The Ring would use that connection.", 
          position: 'left',
          reaction: null
        },
        { 
          id: "8", 
          username: 'MiddleEarthScience', 
          avatar: '/users-avatars/MiddleEarthScience.webp',
          content: "Am I the only one wondering if lightsabers could cut the Ring?", 
          position: 'right',
          reaction: '🤔'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Could Luke have resisted the One Ring better than Frodo? Or the Force just speeds up corruption?",
      }
    },
    {
      id: "2",
      image: "/music_turf.webp",
      messages: [
        { 
          id: "1", 
          username: 'BeatsMaker95', 
          avatar: '/users-avatars/BeatsMaker95.webp',
          content: "Sampling's just digital collage. Good artists copy, great artists steal", 
          position: 'left',
          reaction: null
        },
        { 
          id: "2", 
          username: 'OldSchoolDJ', 
          avatar: '/users-avatars/OldSchoolDJ.webp',
          content: "Kids these days think pressing ctrl+c ctrl+v is 'producing' smh my head", 
          position: 'right',
          reaction: null
        },
        { 
          id: "3", 
          username: 'MusicTheory101', 
          avatar: '/users-avatars/MusicTheory101.webp',
          content: "The problem isn't sampling, it's LAZY sampling. Add something new or don't bother!", 
          position: 'left',
          reaction: '💯'
        },
        { 
          id: "4", 
          username: 'VinylOnly', 
          avatar: '/users-avatars/VinylOnly.webp',
          content: "There hasn't been an original thought in music since 1978.", 
          position: 'right',
          reaction: null
        },
        { 
          id: "5", 
          username: 'StreamingKing', 
          avatar: '/users-avatars/StreamingKing.webp',
          content: "Imagine if we told chefs they can't use ingredients others discovered.", 
          position: 'left',
          reaction: '👏'
        },
        { 
          id: "6", 
          username: 'AutotunedOut', 
          avatar: '/users-avatars/AutotunedOut.webp',
          content: "Sampling used to require skill and crate-digging tbh…", 
          position: 'right',
          reaction: null
        },
        { 
          id: "7", 
          username: 'DanceMixGirl', 
          avatar: '/users-avatars/DanceMixGirl.webp',
          content: "Without sampling we wouldn't have had Daft Punk, Chemical Brothers…", 
          position: 'left',
          reaction: null
        },
        { 
          id: "8", 
          username: 'MusicalPurist', 
          avatar: '/users-avatars/MusicalPurist.webp',
          content: "There's a difference between being influenced by something and straight up theft💰", 
          position: 'right',
          reaction: null
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Is sampling the death of creativity? The line between art and lazy theft's getting blurrier.",
      }
    },
    {
      id: "3",
      image: "/gamer_turf.webp",
      messages: [
        { 
          id: "1", 
          username: 'OldGamerDad', 
          avatar: '/users-avatars/OldGamerDad.webp',
          content: "My 8yo downloads 5 new games daily, plays each for 3 mins between ads. Kid's casino", 
          position: 'left',
          reaction: null
        },
        { 
          id: "2", 
          username: 'DevLife24', 
          avatar: '/users-avatars/DevLife24.webp',
          content: "As a small dev, those 'trash games' pay my bills. Not everyone has AAA studio resources 🤷‍♂️", 
          position: 'right',
          reaction: null
        },
        { 
          id: "3", 
          username: 'BrainRotGang', 
          avatar: '/users-avatars/BrainRotGang.webp',
          content: "Kids' 1st gaming experience is watching ads to get in-game currency, sad…", 
          position: 'left',
          reaction: '😢'
        },
        { 
          id: "4", 
          username: 'MobileCasual', 
          avatar: '/users-avatars/MobileCasual.webp',
          content: "The cream rises. Good mobile games still exist, you just gotta be willing to actually pay for them.", 
          position: 'right',
          reaction: null
        },
        { 
          id: "5", 
          username: 'GameDesign101', 
          avatar: '/users-avatars/GameDesign101.webp',
          content: "Hot take: bad games teach kids to recognize quality. I played plenty of trash NES games growing up too 🕹️", 
          position: 'left',
          reaction: '😂'
        },
        { 
          id: "6", 
          username: 'TouchScreenHater', 
          avatar: '/users-avatars/TouchScreenHater.webp',
          content: "Remember when games were meant to be fun?", 
          position: 'right',
          reaction: null
        },
        { 
          id: "7", 
          username: 'AdBlockPlus', 
          avatar: '/users-avatars/AdBlockPlus.webp',
          content: "Parents are using phones as babysitters. The games are just filling market demand,.", 
          position: 'left',
          reaction: null
        },
        { 
          id: "8", 
          username: 'RetroRevival', 
          avatar: '/users-avatars/RetroRevival.webp',
          content: "Mobile gaming was a mistake. Return to gameboy. Reject modernity. Embrace cartridge. 🎮", 
          position: 'right',
          reaction: '👍'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "Quick dev, cheap games: app stores flooded with ad-soaked trash. Is the next gen of gamers growing up braindead?",
      }
    },
    {
      id: "4",
      image: "/Turf_App.webp",
      messages: [
        { 
          id: "1", 
          username: 'GrassIsGreener', 
          avatar: '/users-avatars/GrassIsGreener.webp',
          content: "Loving Turf so far! Maybe add option to save custom map layouts?", 
          position: 'left',
          reaction: null
        },
        { 
          id: "2", 
          username: 'NewUser23', 
          avatar: '/users-avatars/NewUser23.webp',
          content: "Interface is clean but took me a while to figure out how friends lists work 👍", 
          position: 'right',
          reaction: null
        },
        { 
          id: "3", 
          username: 'RegularJoe', 
          avatar: '/users-avatars/RegularJoe.webp',
          content: "The notification system needs work guys 📱", 
          position: 'left',
          reaction: '👍'
        },
      ],
      bottomBar: {
        backgroundColor: "#0095f6",
        text: "From Beta to mainstream. Help us make Turf better.",
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
    
    // Show messages progressively with improved timing
    slides[activeSlide].messages.forEach((message, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, message.id]);
      }, 1000 + (index * 800)); // Slightly longer delay for smoother appearance
      
      timersRef.current.push(timer);
    });
    
    // Auto-advance carousel after all messages have appeared
    const slideChangeTime = 1000 + (slides[activeSlide].messages.length * 800) + 4000;
    const advanceTimer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
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
  const renderMessageBubbles = (slide: Slide, visibleMessages: string[]) => {
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
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
        {slides.map((slide: Slide, index: number) => (
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
            
            {/* Desktop message bubbles - Enhanced with proper positioning */}
            {slide.messages.map(message => {
              const isVisible = visibleMessages.includes(message.id);
              
              if (!isVisible) return null;
              
              return (
                <div
                  key={`desktop-message-${message.id}`}
                  className="absolute z-20"
                  style={{
                    maxWidth: '300px',
                    top: message.top || 'auto',
                    bottom: message.bottom || 'auto',
                    left: message.left || 'auto',
                    right: message.right || 'auto',
                    animation: 'fadeIn 0.5s ease-out forwards'
                  }}
                >
                  <div className={`flex ${message.position === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* User Avatar */}
                    <div className={`flex-shrink-0 ${message.position === 'left' ? 'mr-2' : 'ml-2'}`}>
                      <img 
                        src={message.avatar} 
                        alt={message.username} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col ${message.position === 'left' ? 'items-start' : 'items-end'}`}>
                      <div className="text-sm font-semibold text-white mb-1">{message.username}</div>
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
              className="absolute bottom-0 left-0 right-0 py-4 px-6 text-center z-30"
              style={{ backgroundColor: slide.bottomBar.backgroundColor }}
            >
              <h3 className="text-white text-lg md:text-xl font-medium">
                {slide.bottomBar.text}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile carousel */}
      <div className={`${isMobile ? 'block' : 'hidden'} fixed bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-3xl shadow-lg z-50`}>
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

          {/* Single message for mobile */}
          {slides[activeSlide].messages[mobileMessageIndex] && (
            <div 
              className="absolute inset-0 flex items-center justify-center p-4 z-20"
              style={{ animation: 'fadeIn 0.5s ease-out' }}
            >
              <div className="w-4/5 mx-auto flex" style={{ maxWidth: '300px' }}>
                {/* User Avatar for Mobile */}
                <div className="flex-shrink-0 mr-2">
                  <img 
                    src={slides[activeSlide].messages[mobileMessageIndex].avatar} 
                    alt={slides[activeSlide].messages[mobileMessageIndex].username} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                
                {/* Message content for Mobile */}
                <div className="flex flex-col flex-grow">
                  <div className="text-sm font-semibold text-white mb-1">
                    {slides[activeSlide].messages[mobileMessageIndex].username}
                  </div>
                  <div className="rounded-xl px-3 py-2 bg-gray-100 text-gray-800 shadow-md relative">
                    {slides[activeSlide].messages[mobileMessageIndex].content}
                    
                    {/* Reaction for Mobile */}
                    {slides[activeSlide].messages[mobileMessageIndex].reaction && (
                      <div className="absolute -bottom-2 right-0 bg-white rounded-full px-1 py-1 shadow-md text-sm">
                        {slides[activeSlide].messages[mobileMessageIndex].reaction}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitPageSignup; 