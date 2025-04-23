'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to Turf",
      description: "Daily Debates. Real Connections.",
      image: "/onboarding-1.svg"
    },
    {
      title: "Engage in Daily Debates",
      description: "Join our community to discuss a new thought-provoking topic every day.",
      image: "/onboarding-2.svg"
    },
    {
      title: "Earn Harmony Points",
      description: "Get recognized for your contributions and build your reputation.",
      image: "/onboarding-3.svg"
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-text-primary">Turf</h1>
        <div className="flex space-x-4">
          <Link 
            href="/auth/signin" 
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="px-4 py-2 bg-accent-primary text-background font-medium rounded-md hover:bg-opacity-90 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="relative overflow-hidden rounded-lg shadow-lg bg-background-secondary">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div key={index} className="min-w-full onboarding-slide">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="onboarding-image"
                  />
                  <h2 className="onboarding-title text-text-primary">{slide.title}</h2>
                  <p className="onboarding-description">{slide.description}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-background-tertiary text-text-primary hover:bg-opacity-80"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-background-tertiary text-text-primary hover:bg-opacity-80"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-accent-primary' : 'bg-background-tertiary'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              href="/auth/signup" 
              className="w-full md:w-auto px-8 py-3 bg-accent-primary text-background-primary font-medium rounded-md hover:bg-opacity-90 transition-colors text-center"
            >
              Create Account
            </Link>
            
            <Link 
              href="/onboarding/guest" 
              className="w-full md:w-auto px-8 py-3 bg-background-secondary text-text-primary font-medium rounded-md hover:bg-background-tertiary transition-colors text-center"
            >
              Continue as Guest
            </Link>
            
            <Link 
              href="/learn-more" 
              className="w-full md:w-auto px-8 py-3 border border-accent-secondary text-accent-secondary font-medium rounded-md hover:bg-accent-secondary hover:bg-opacity-10 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-text-muted text-sm">
        <p>By continuing, you agree to our <a href="#" className="text-accent-secondary hover:underline">Terms of Service</a> and <a href="#" className="text-accent-secondary hover:underline">Privacy Policy</a>.</p>
        <p className="mt-2">© 2025 Turf. All rights reserved.</p>
      </footer>
    </div>
  );
}
