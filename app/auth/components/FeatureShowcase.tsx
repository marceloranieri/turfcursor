'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    title: "Effortlessly manage your debates",
    subtitle: "and conversations.",
    description: "Log in to access your Turf dashboard and manage your debates.",
    image: "/images/features/dashboard-preview.png",
  },
  {
    title: "Earn Recognition",
    subtitle: "through quality debates.",
    description: "Collect Harmony Points through upvotes and intelligent linking.",
    image: "/images/features/recognition.png",
  },
  {
    title: "Join the Conversation",
    subtitle: "every day.",
    description: "Five new debate topics daily, with real-time chat features.",
    image: "/images/features/conversation.png",
  }
];

export default function FeatureShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Render this into the right panel div
  useEffect(() => {
    const rightPanel = document.getElementById('auth-right-panel');
    if (rightPanel && typeof document !== 'undefined') {
      rightPanel.innerHTML = '';
      rightPanel.appendChild(document.createRange().createContextualFragment(`
        <div class="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div class="mb-8 ml-8">
            <h2 class="text-3xl font-bold">${slides[currentSlide].title}</h2>
            <h3 class="text-3xl font-bold mb-3">${slides[currentSlide].subtitle}</h3>
            <p class="opacity-80 text-lg">${slides[currentSlide].description}</p>
          </div>
          
          <div class="flex justify-center mb-12">
            <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-5 rounded-lg shadow-xl w-full max-w-2xl relative h-72">
              <img 
                src="${slides[currentSlide].image}" 
                alt="Feature preview" 
                class="rounded-md object-contain absolute inset-0 w-full h-full"
              />
            </div>
          </div>
          
          <div class="flex justify-center space-x-2">
            ${slides.map((_, index) => `
              <button
                onclick="document.dispatchEvent(new CustomEvent('change-slide', {detail: {index: ${index}}}))"
                class="w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-4' : 'bg-white bg-opacity-30'
                }"
                aria-label="Go to slide ${index + 1}"
              ></button>
            `).join('')}
          </div>
          
          <div class="absolute bottom-6 right-6 text-white text-opacity-60 text-xs">
            Copyright © ${new Date().getFullYear()} Turf. All rights reserved.
          </div>
        </div>
      `));
    }
  }, [currentSlide]);
  
  // Listen for change-slide events
  useEffect(() => {
    const handleChangeSlide = (e: CustomEvent) => {
      setCurrentSlide(e.detail.index);
    };
    document.addEventListener('change-slide', handleChangeSlide as EventListener);
    return () => {
      document.removeEventListener('change-slide', handleChangeSlide as EventListener);
    };
  }, []);
  
  return null; // Rendering happens via DOM manipulation
} 