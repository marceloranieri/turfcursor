'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const OnboardingPage = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Turf!",
      description: "Your social debate platform for engaging in daily discussions on captivating topics.",
      image: "/onboarding-1.svg",
    },
    {
      title: "Earn Recognition",
      description: "Collect Harmony Points through upvotes and intelligent linking. Earn Genius Awards and be crowned Debate Maestro!",
      image: "/onboarding-2.svg",
    },
    {
      title: "Join the Conversation",
      description: "Five new debate topics every day, with real-time chat features including message reactions, replies, and GIFs.",
      image: "/onboarding-3.svg",
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Redirect to home page after last slide
      router.push('/');
    }
  };

  const skipOnboarding = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
      <div className="bg-background-secondary rounded-xl max-w-md w-full py-8 px-6">
        <div className="onboarding-content text-center">
          <div className="onboarding-image mb-6">
            {slides[currentSlide]?.image && (
              <Image 
                src={slides[currentSlide]!.image} 
                alt={slides[currentSlide]!.title}
                width={250}
                height={200}
                className="mx-auto"
              />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            {slides[currentSlide]?.title}
          </h1>
          
          <p className="text-text-secondary mb-6">
            {slides[currentSlide]?.description}
          </p>
          
          <div className="dots flex justify-center mb-8">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentSlide ? 'bg-accent-primary' : 'bg-text-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="buttons flex flex-col sm:flex-row justify-center sm:justify-between gap-3">
            <button 
              onClick={skipOnboarding}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Skip
            </button>
            
            <button 
              onClick={nextSlide}
              className="bg-accent-primary text-background-primary font-semibold px-6 py-2 rounded-md hover:bg-gold transition-colors"
            >
              {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage; 