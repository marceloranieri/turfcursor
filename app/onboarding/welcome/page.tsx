'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Onboarding features to highlight
const features = [
  {
    title: 'Focused Debates',
    description: 'Dive into a single daily topic for concentrated, quality debates.',
    icon: '🎯',
  },
  {
    title: 'Harmony Points',
    description: 'Earn rewards for positive contributions and linked comments.',
    icon: '✨',
  },
  {
    title: 'Wizard of Mods',
    description: 'Our AI assistant keeps conversations flowing with new perspectives.',
    icon: '🧙',
  },
  {
    title: 'Pincredible',
    description: 'The most engaging messages get highlighted for everyone to see.',
    icon: '📌',
  },
  {
    title: 'Genius Awards',
    description: 'Recognize exceptional contributions with limited daily awards.',
    icon: '🏆',
  },
];

export default function OnboardingWelcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  
  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Go to chat when onboarding is complete
      router.push('/chat');
    }
  };
  
  const currentFeature = features[currentStep];
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background-secondary">
      <div className="max-w-md w-full bg-background-tertiary rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-primary mb-2">Welcome to Turf</h1>
          <p className="text-text-secondary">Let&apos;s get you introduced to the platform</p>
        </div>
        
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{currentFeature.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{currentFeature.title}</h2>
          <p className="text-text-secondary">{currentFeature.description}</p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 my-6">
          {features.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-accent-primary' : 'bg-background-secondary'}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <button 
            className="button-secondary px-4 py-2"
            onClick={() => router.push('/chat')}
          >
            Skip
          </button>
          
          <button 
            className="button-primary px-6 py-2 flex items-center"
            onClick={handleNext}
          >
            {currentStep < features.length - 1 ? 'Next' : 'Start Debating'}
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </main>
  );
} 