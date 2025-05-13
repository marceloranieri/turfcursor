'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Animation preferences that users might want to control
interface AnimationPreferences {
  enabled: boolean;
  reducedMotion: boolean;
  duration: 'fast' | 'normal' | 'slow';
}

interface AnimationContextType {
  preferences: AnimationPreferences;
  setPreferences: (prefs: Partial<AnimationPreferences>) => void;
  shouldAnimate: (animationType?: string) => boolean;
  getDurationClass: () => string;
}

// Default values
const defaultPreferences: AnimationPreferences = {
  enabled: true,
  reducedMotion: false,
  duration: 'normal',
};

// Create context
const AnimationContext = createContext<AnimationContextType | null>(null);

/**
 * Animation Provider Component
 */
export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state, potentially from localStorage
  const [preferences, setPreferencesState] = useState<AnimationPreferences>(() => {
    // Try to get from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('animationPreferences');
      if (saved) {
        try {
          return { ...defaultPreferences, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse animation preferences', e);
        }
      }
    }
    return defaultPreferences;
  });

  // Check for prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches && preferences.reducedMotion !== true) {
        setPreferencesState(prev => ({ ...prev, reducedMotion: true }));
      }

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPreferencesState(prev => ({ ...prev, reducedMotion: e.matches }));
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('animationPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Update preferences
  const setPreferences = useCallback((newPrefs: Partial<AnimationPreferences>) => {
    setPreferencesState(prev => ({ ...prev, ...newPrefs }));
  }, []);

  // Determine if animations should run based on preferences
  const shouldAnimate = useCallback(
    (animationType?: string) => {
      // If animations are disabled globally, don't animate
      if (!preferences.enabled) return false;

      // If reduced motion is preferred, only allow certain animations
      if (preferences.reducedMotion) {
        // Allow only opacity/color animations if reduced motion is preferred
        return animationType === 'opacity' || animationType === 'color';
      }

      // Otherwise, animations are allowed
      return true;
    },
    [preferences]
  );

  // Get the appropriate duration class based on preferences
  const getDurationClass = useCallback(() => {
    switch (preferences.duration) {
      case 'fast':
        return 'duration-fast';
      case 'slow':
        return 'duration-slow';
      case 'normal':
      default:
        return 'duration-normal';
    }
  }, [preferences.duration]);

  // Context value
  const value = {
    preferences,
    setPreferences,
    shouldAnimate,
    getDurationClass,
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
};

/**
 * Hook to use animation context
 */
export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
}; 