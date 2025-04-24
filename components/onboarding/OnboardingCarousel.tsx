import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiscordButton } from '@/components/ui/DiscordButton';

const slides = [
  {
    title: 'Welcome to Turf',
    description: 'Join daily debates on engaging topics. One topic, one space, endless perspectives.',
    icon: '🎯',
  },
  {
    title: 'Harmony Points',
    description: 'Earn points through upvotes and meaningful connections. Link comments to boost both users.',
    icon: '🎵',
  },
  {
    title: 'Genius Awards',
    description: 'Award exceptional contributions with Genius status. You have 3 to give each day.',
    icon: '🌟',
  },
  {
    title: 'Pincredible',
    description: 'Top messages get pinned every 5 minutes. Stay engaged to see your message shine!',
    icon: '📌',
  },
  {
    title: 'Wizard of Mods',
    description: 'Our AI moderator keeps discussions lively with thought-provoking perspectives.',
    icon: '🧙‍♂️',
  },
];

export const OnboardingCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    router.push('/topics');
  };

  const handleSkip = () => {
    router.push('/topics');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--dark-background)] p-4">
      <div className="w-full max-w-lg bg-[var(--channel-bg)] rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{slides[currentSlide].icon}</div>
          <h2 className="text-2xl font-bold text-[var(--header-primary)] mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-[var(--text-normal)] text-lg">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-[var(--primary-blue)]'
                  : 'bg-[var(--divider)]'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            {currentSlide > 0 && (
              <DiscordButton
                variant="secondary"
                onClick={prevSlide}
              >
                Previous
              </DiscordButton>
            )}
          </div>

          <div className="flex gap-4">
            <DiscordButton
              variant="secondary"
              onClick={handleSkip}
            >
              Skip
            </DiscordButton>
            {currentSlide < slides.length - 1 ? (
              <DiscordButton onClick={nextSlide}>
                Next
              </DiscordButton>
            ) : (
              <DiscordButton onClick={handleFinish}>
                Get Started
              </DiscordButton>
            )}
          </div>
        </div>

        {/* Guest mode option */}
        <div className="mt-8 text-center">
          <p className="text-[var(--text-muted)]">
            Want to look around first?
          </p>
          <button
            onClick={() => router.push('/topics?guest=true')}
            className="text-[var(--primary-blue)] hover:underline mt-2"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}; 