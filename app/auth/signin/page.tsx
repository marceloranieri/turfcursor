"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const slides = [
    {
      title: "Welcome to Turf",
      subtitle: "A platform for focused debates and meaningful conversations.",
      description: "Log in to access your Turf dashboard and join the conversation.",
      image: "/onboarding-1.svg",
    },
    {
      title: "Earn Recognition",
      subtitle: "through quality debates.",
      description: "Collect Harmony Points through upvotes and intelligent linking.",
      image: "/onboarding-2.svg",
    },
    {
      title: "Join the Conversation",
      subtitle: "every day.",
      description: "Five new debate topics daily, with real-time chat features.",
      image: "/onboarding-3.svg",
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
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
        // Successful login
        router.refresh(); // Refresh the page to update auth state
        router.push('/chat'); // Redirect to chat
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
      setError('');
      
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Panel - Login Form */}
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

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Enter your email and password to access your account.</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember Me
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Your Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Or Login With</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center w-32 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center w-32 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M13.04,10.25c-0.04-3.35,2.74-4.98,2.87-5.06c-1.56-2.29-4-2.61-4.87-2.64c-2.07-0.21-4.04,1.21-5.09,1.21 c-1.05,0-2.68-1.19-4.41-1.16c-2.27,0.04-4.35,1.32-5.53,3.34c-2.36,4.1-0.6,10.17,1.69,13.49c1.12,1.63,2.46,3.46,4.21,3.39 c1.7-0.07,2.33-1.1,4.38-1.1c2.04,0,2.63,1.1,4.42,1.06c1.82-0.03,2.98-1.66,4.1-3.29c1.29-1.89,1.82-3.72,1.86-3.82 C16.54,12.34,13.08,10.4,13.04,10.25z M10.85,3.17c0.94-1.14,1.57-2.72,1.4-4.3c-1.35,0.05-2.99,0.9-3.96,2.04 C7.42,1.96,6.67,3.5,6.85,5.03C8.32,5.11,9.91,4.31,10.85,3.17z"
                  />
                </svg>
                <span className="text-sm">Apple</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't Have An Account? <Link href="/auth/signup" className="text-blue-600 hover:underline">Register Now</Link>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 Turf. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden md:block md:w-3/5 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Background elements */}
          <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-30 -top-20 -right-20"></div>
          <div className="absolute w-80 h-80 rounded-full bg-indigo-600 opacity-20 bottom-10 left-10"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
          {/* Feature Content */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <h2 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h2>
            <h3 className="text-2xl font-semibold mb-4">{slides[currentSlide].subtitle}</h3>
            <p className="text-lg mb-8">{slides[currentSlide].description}</p>
            <div className="relative h-64">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
