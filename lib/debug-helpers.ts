'use client';

import logger from '@/lib/logger';
import { useEffect } from 'react';

export function useDebugListeners() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    logger.info('Setting up debug listeners');
    
    // Click event debugging
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      logger.info('Element clicked:', target);
      logger.info('Element ID:', target.id || 'No ID');
      logger.info('Element classes:', target.className || 'No classes');
      logger.info('Element tag:', target.tagName);
      
      // Highlight clicked element
      const originalBg = target.style.backgroundColor;
      const originalOutline = target.style.outline;
      target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
      target.style.outline = '2px solid red';
      setTimeout(() => {
        target.style.backgroundColor = originalBg;
        target.style.outline = originalOutline;
      }, 500);
    };
    
    // Log all form submissions
    const handleSubmit = (e: SubmitEvent) => {
      const target = e.target as HTMLFormElement;
      logger.info('Form submitted:', target);
      logger.info('Form ID:', target.id || 'No ID');
      logger.info('Form fields:', getFormData(target));
    };
    
    // Monitor DOM mutations for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          logger.info('DOM nodes added:', mutation.addedNodes);
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Log client-side errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Client-side error occurred', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    // Log unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection occurred', {
        reason: event.reason,
        promise: event.promise,
      });
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      observer.disconnect();
    };
  }, []);
}

export function useComponentLifecycle(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    logger.info(`${componentName} mounted`);
    return () => logger.info(`${componentName} unmounted`);
  }, [componentName]);
}

export function logStateChange<T>(stateName: string, newValue: T) {
  if (process.env.NODE_ENV !== 'development') return;
  logger.info(`State '${stateName}' changed:`, newValue);
}

export function measurePerformance(label: string) {
  if (process.env.NODE_ENV !== 'development') return;

  const start = performance.now();
  return () => {
    const end = performance.now();
    logger.info(`${label} took ${end - start}ms`);
  };
}

function getFormData(form: HTMLFormElement): Record<string, any> {
  const formData = new FormData(form);
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

// Add this to your page component with:
// useEffect(() => { setupDebugListeners(); }, []); 