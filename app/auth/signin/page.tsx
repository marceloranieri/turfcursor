"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides data
  const slides = [
    {
      title: "Something New Every Day",
      description: "Gaming, music, sports, series—you name it. Fresh daily topics to test your wit.",
      image: "/images/carousel/debate-topics.jpg",
    },
    {
      title: "Build Your Reputation",
      description: "Earn points for smart takes, community awe, and more.",
      image: "/images/carousel/reputation.jpg",
    },
    {
      title: "Meet Great Minds",
      description: "Find people through shared passions. Expand your circle with real conversations.",
      image: "/images/carousel/connect.jpg",
    },
    {
      title: "From Beta to Big Time",
      description: "Help shape Turf. Share your opinions, make it better, and grow with us.",
      image: "/images/carousel/expand.jpg",
    }
  ];

  // Auto rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Carousel navigation
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Form handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set session expiry based on "Remember Me" checkbox
          expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days : 1 day
        }
      });

      if (signInError) {
        throw signInError;
      }

      if (data?.session) {
        // Get the returnUrl from query parameters, default to '/chat'
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl') || '/chat';
        
        // Successful login
        router.refresh(); // Refresh the page to update auth state
        router.push(returnUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
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
          } : provider === 'facebook' ? {
            auth_type: 'reauthenticate'
          } : undefined,
        },
      });

      if (signInError) {
        throw signInError;
      }

      // No need to handle redirect here as Supabase will handle it
    } catch (err: any) {
      setError(`${provider} login failed. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Column - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-12">
        <div className="flex-grow flex flex-col max-w-md mx-auto w-full justify-center">
          {/* Logo - Only SVG, 25% bigger */}
          <div className="mb-10">
            <Image
              src="/turf-logo.svg" 
              alt="Turf Logo"
              width={45}  // Increased by 25% from original 36
              height={45} // Increased by 25% from original 36
              priority
            />
          </div>
          
          {/* Exact heading from Figma */}
          <h1 className="text-[34px] leading-tight font-normal font-['SF_Compact_Rounded',_-apple-system,_Roboto,_Helvetica,_sans-serif] text-[#0C1421] mb-7">
            Welcome to Turf 👋
          </h1>
          
          {/* Exact description from Figma */}
          <p className="text-[20px] leading-8 tracking-[0.2px] font-['SF_Pro_Display',_-apple-system,_Roboto,_Helvetica,_sans-serif] text-[#0C1421] mb-12">
            Chatrooms with daily-curated debates on your favorite topics. Fresh ideas, your kind of people.
          </p>
          
          {/* Login Form - Styled to match Figma */}
          <form onSubmit={handleLogin} className="w-full space-y-6">
            {/* Email Field */}
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
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0C1421] mb-1.5">Password</label>
              <div className="mt-2 rounded-[12px] text-[#8897AD]">
                <div className="relative flex flex-col items-start justify-center p-[17px] rounded-[12px] border border-[#D4D7E3] bg-[#F7FBFF]">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent outline-none text-[#0C1421]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8897AD]"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Forgot Password - Positioned exactly as in Figma */}
            <div className="flex justify-end">
              <Link 
                href="/auth/forgot-password" 
                className="text-[#1E4AE9] text-right"
              >
                Forgot Password?
              </Link>
            </div>
            
            {/* Remember Me - Styled to match Figma */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 accent-[#1E4AE9] rounded border-gray-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#0C1421]">
                Remember Me
              </label>
            </div>
            
            {/* Sign In Button - Styled exactly as in Figma */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[12px] text-[20px] font-medium text-white bg-[#162D3A] hover:bg-[#162D3A]/90 focus:outline-none disabled:opacity-75 tracking-[0.2px]"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          {/* Or separator - Styled to match Figma */}
          <div className="mt-12 mb-6 flex items-center py-[10px] gap-4 text-[#294957] text-center">
            <div className="flex-grow h-[1px] bg-[#CFDFE2]"></div>
            <span>Or</span>
            <div className="flex-grow h-[1px] bg-[#CFDFE2]"></div>
          </div>
          
          {/* Social Login Buttons - Styled to match Figma */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-4 py-3 px-[9px] rounded-[12px] bg-[#F3F9FA] text-[#313957]"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span className="w-[159px]">Sign in with Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center gap-4 py-3 px-[9px] rounded-[12px] bg-[#F3F9FA] text-[#313957]"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              <span className="w-[159px]">Sign in with Facebook</span>
            </button>
          </div>
          
          {/* Sign up link - Styled to match Figma */}
          <p className="mt-12 text-center text-[18px] leading-[1.6] tracking-[0.18px] text-[#313957]">
            Don't you have an account? <Link href="/auth/signup" className="text-[#1E4AE9]">Sign up</Link>
          </p>
          
          {/* Privacy Policy - Styled to match Figma */}
          <p className="mt-12 text-center text-[14px] leading-[1.6] tracking-[0.14px] text-[#AEAEB2]">
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Column - Carousel */}
      <div className="hidden md:block md:w-1/2 bg-blue-600">
        <div className="relative h-full w-full overflow-hidden">
          {/* Carousel slides */}
          <div className="absolute inset-0 flex items-center justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center items-center p-12 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="max-w-md text-white">
                  <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg text-white/90 mb-6">{slide.description}</p>
                  
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 focus:outline-none transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 focus:outline-none transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          
          {/* Navigation dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-6 bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
