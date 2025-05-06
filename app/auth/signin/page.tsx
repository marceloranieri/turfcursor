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
      color: "from-blue-600/80 to-indigo-900/90"
    },
    {
      title: "Build Your Reputation",
      description: "Earn points for smart takes, community awe, and more.",
      image: "/images/carousel/reputation.jpg",
      color: "from-cyan-600/80 to-blue-900/90"
    },
    {
      title: "Meet Great Minds",
      description: "Find people through shared passions. Expand your circle with real conversations.",
      image: "/images/carousel/connect.jpg",
      color: "from-indigo-600/80 to-purple-900/90"
    },
    {
      title: "From Beta to Big Time",
      description: "Help shape Turf. Share your opinions, make it better, and grow with us.",
      image: "/images/carousel/expand.jpg",
      color: "from-violet-600/80 to-indigo-900/90"
    }
  ];

  // Auto rotate slides every 5 seconds
  useEffect(() => {
    // Fade in animations
    const introElement = document.querySelector('.intro-content');
    const carouselElement = document.querySelector('.carousel-content');
    
    if (introElement) {
      setTimeout(() => {
        introElement.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
    
    if (carouselElement) {
      setTimeout(() => {
        carouselElement.classList.add('opacity-100', 'translate-x-0');
      }, 300);
    }
    
    // Auto rotate slides
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Carousel navigation functions
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Form handling functions
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

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
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

      // No need to handle redirect here as Supabase will handle it
    } catch (err: any) {
      setError(`${provider} login failed. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      {/* Left Column - Login Form */}
      <div className="w-full md:w-2/5 p-8 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center">
              <Image
                src="/turf-logo.svg"
                alt="Turf Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold text-gray-900">TURF</span>
            </div>
          </div>

          {/* Introduction Text */}
          <div className="mb-8 intro-content opacity-0 translate-y-4 transition-all duration-500 ease-out">
            <h1 className="text-[34px] leading-tight font-bold text-[#0C1421] mb-2">Welcome Back</h1>
            <p className="text-[20px] leading-8 tracking-[0.2px] text-gray-600">
              Enter your email and password to access your account.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#0C1421] mb-1.5">Email</label>
              <div className="mt-2 rounded-[12px] text-[#8897AD]">
                <div className="flex flex-col items-start justify-center p-[17px] rounded-[12px] border border-[#D4D7E3] bg-[#F7FBFF]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Example@email.com"
                    className="w-full bg-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#0C1421] mb-1.5">Password</label>
              <div className="mt-2 rounded-[12px] text-[#8897AD]">
                <div className="relative flex flex-col items-start justify-center p-[17px] rounded-[12px] border border-[#D4D7E3] bg-[#F7FBFF]">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
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

            {/* Forgot Password Link */}
            <Link
              href="/auth/forgot-password"
              className="self-end block text-right text-[#1E4AE9] text-sm hover:underline"
            >
              Forgot Password?
            </Link>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 accent-[#1E4AE9] rounded border-gray-300"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#162D3A] text-white py-4 rounded-[12px] text-[20px] tracking-[0.2px] hover:bg-[#162D3A]/90 transition-colors focus:outline-none disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Or Separator */}
          <div className="flex items-center justify-center w-full py-[10px] mt-6 gap-4 text-[#294957] text-center">
            <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
            <span>Or</span>
            <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col items-stretch w-full mt-6 text-[#313957]">
            {/* Google Button */}
            <button 
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-4 py-3 px-[9px] rounded-[12px] bg-[#F3F9FA] hover:bg-[#F3F9FA]/80 transition-colors disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span className="text-sm">Sign in with Google</span>
            </button>

            {/* Apple Button */}
            <button 
              type="button"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-4 py-3 px-[9px] mt-4 rounded-[12px] bg-[#F3F9FA] hover:bg-[#F3F9FA]/80 transition-colors disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path
                  fill="currentColor"
                  d="M13.04,10.25c-0.04-3.35,2.74-4.98,2.87-5.06c-1.56-2.29-4-2.61-4.87-2.64c-2.07-0.21-4.04,1.21-5.09,1.21 c-1.05,0-2.68-1.19-4.41-1.16c-2.27,0.04-4.35,1.32-5.53,3.34c-2.36,4.1-0.6,10.17,1.69,13.49c1.12,1.63,2.46,3.46,4.21,3.39 c1.7-0.07,2.33-1.1,4.38-1.1c2.04,0,2.63,1.1,4.42,1.06c1.82-0.03,2.98-1.66,4.1-3.29c1.29-1.89,1.82-3.72,1.86-3.82 C16.54,12.34,13.08,10.4,13.04,10.25z M10.85,3.17c0.94-1.14,1.57-2.72,1.4-4.3c-1.35,0.05-2.99,0.9-3.96,2.04 C7.42,1.96,6.67,3.5,6.85,5.03C8.32,5.11,9.91,4.31,10.85,3.17z"
                />
              </svg>
              <span className="text-sm">Sign in with Apple</span>
            </button>
          </div>
        </div>

        {/* Don't have an account & Privacy Policy */}
        <div className="mt-12 text-center">
          <p className="text-[18px] leading-[1.6] tracking-[0.18px] text-[#313957]">
            Don't you have an account? <Link href="/auth/signup" className="text-[#1E4AE9] hover:underline">Sign up</Link>
          </p>
          <Link 
            href="/privacy-policy"
            className="mt-8 block text-center text-[14px] leading-[1.6] tracking-[0.14px] text-[#AEAEB2]"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Right Column - Image Carousel */}
      <div className="hidden md:block md:w-3/5 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-30 -top-20 -right-20"></div>
          <div className="absolute w-80 h-80 rounded-full bg-indigo-600 opacity-20 bottom-10 left-10"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
          {/* Carousel Content */}
          <div className="max-w-lg carousel-content opacity-0 translate-x-4 transition-all duration-500 ease-out">
            {/* Slides */}
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`${index === currentSlide ? 'block' : 'hidden'} transition-opacity duration-1000 ease-in-out`}
              >
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl opacity-90 mb-8">{slide.description}</p>
                
                {/* Image with Gradient Overlay */}
                <div className="relative h-72 mb-8 rounded-lg overflow-hidden">
                  {/* Background Image */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${slide.color}`}></div>
                  
                  {/* Actual Image */}
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={400}
                      height={300}
                      priority={index === 0}
                      className="object-contain max-h-full rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 flex justify-between items-center -translate-y-1/2 px-6">
              <button 
                onClick={goToPrevSlide}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button 
                onClick={goToNextSlide}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div className="absolute bottom-6 right-6 text-white/80 text-sm font-medium">
            Elevate your conversations
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
