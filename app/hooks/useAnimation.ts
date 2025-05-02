'use client';

import { useState, useEffect, useCallback } from 'react';

type AnimationState = 'initial' | 'animating-in' | 'visible' | 'animating-out' | 'hidden';

interface UseAnimationProps {
  initialVisible?: boolean;
  animateOnMount?: boolean;
  enterDuration?: number;
  exitDuration?: number;
}

/**
 * Custom hook for managing CSS animations with React
 */
export const useAnimation = ({
  initialVisible = false,
  animateOnMount = true,
  enterDuration = 300,
  exitDuration = 300,
}: UseAnimationProps = {}) => {
  const [state, setState] = useState<AnimationState>(
    initialVisible ? 'visible' : 'initial'
  );

  // Animate in on mount if specified
  useEffect(() => {
    if (animateOnMount && state === 'initial') {
      setState('animating-in');
      const timer = setTimeout(() => {
        setState('visible');
      }, enterDuration);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount, enterDuration, state]);

  // Function to trigger enter animation
  const enter = useCallback(() => {
    if (state !== 'visible' && state !== 'animating-in') {
      setState('animating-in');
      const timer = setTimeout(() => {
        setState('visible');
      }, enterDuration);
      return () => clearTimeout(timer);
    }
  }, [enterDuration, state]);

  // Function to trigger exit animation
  const exit = useCallback(
    (callback?: () => void) => {
      if (state !== 'hidden' && state !== 'animating-out') {
        setState('animating-out');
        const timer = setTimeout(() => {
          setState('hidden');
          if (callback) callback();
        }, exitDuration);
        return () => clearTimeout(timer);
      }
    },
    [exitDuration, state]
  );

  // Function to immediately show without animation
  const show = useCallback(() => {
    setState('visible');
  }, []);

  // Function to immediately hide without animation
  const hide = useCallback(() => {
    setState('hidden');
  }, []);

  // Determine CSS classes based on current state
  const getAnimationClasses = useCallback(
    (baseClass: string = '') => {
      let classes = baseClass ? `${baseClass} ` : '';
      
      switch (state) {
        case 'animating-in':
          classes += 'fade-in';
          break;
        case 'animating-out':
          classes += 'fade-out';
          break;
        case 'hidden':
          classes += 'opacity-0';
          break;
        default:
          break;
      }
      
      return classes.trim();
    },
    [state]
  );

  return {
    visible: state === 'visible' || state === 'animating-in',
    animating: state === 'animating-in' || state === 'animating-out',
    entering: state === 'animating-in',
    exiting: state === 'animating-out',
    enter,
    exit,
    show,
    hide,
    getAnimationClasses,
  };
}; 