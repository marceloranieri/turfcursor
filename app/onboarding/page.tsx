'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to Turf",
      description: "The social platform for daily debates, inspired by Discord and Ivy League debate clubs.",
      image: "/onboarding-1.svg",
      alt: "People debating",
    },
    {
      title: "Engage in Meaningful Debates",
      description: "Participate in daily topics, earn Harmony Points, and win recognition for quality contributions.",
      image: "/onboarding-2.svg",
      alt: "Debate features",
    },
    {
      title: "Join Circles",
      description: "Each Circle is a focused discussion on a specific topic. Share your perspectives and learn from others.",
      image: "/onboarding-3.svg",
      alt: "Circles feature",
    },
  ];
  
  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Go to home/auth
      router.push('/');
    }
  };
  
  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const handleSkip = () => {
    router.push('/');
  };
  
  const handleGuestMode = () => {
    // In a real app, we would set a guest flag in context or local storage
    localStorage.setItem('guestMode', 'true');
    router.push('/chat');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top navigation */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={handleSkip}
          className="text-gray-600 dark:text-gray-300 hover:underline focus:outline-none"
        >
          Skip
        </button>
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-10 rounded-full ${
                index === currentSlide
                  ? 'bg-accent-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Slides */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-10 flex items-center justify-center">
          {/* Placeholder for image - replace with your image paths */}
          <div className="relative w-64 h-64">
            <Image 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].alt}
              fill
              style={{ objectFit: 'contain' }} 
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          {slides[currentSlide].description}
        </p>
        
        {/* Navigation buttons */}
        <div className="flex space-x-4">
          {currentSlide > 0 && (
            <button
              onClick={goToPrevSlide}
              className="button-secondary py-3 px-8"
            >
              Previous
            </button>
          )}
          
          <button
            onClick={goToNextSlide}
            className="button-primary py-3 px-8"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
        
        {/* Guest mode option */}
        {currentSlide === slides.length - 1 && (
          <button
            onClick={handleGuestMode}
            className="mt-6 text-accent-primary hover:underline"
          >
            Continue as guest
          </button>
        )}
      </div>
    </div>
  );
} 