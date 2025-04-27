'use client';

import logger from '@/lib/logger';
import { useEffect } from 'react';

export function setupDebugListeners() {
  if (process.env.NODE_ENV !== 'development') return;

  logger.info('Setting up debug listeners');
  
  // Click event debugging
  document.addEventListener('click', (e) => {
    logger.info('Element clicked:', e.target);
    logger.info('Element ID:', e.target.id || 'No ID');
    logger.info('Element classes:', e.target.className || 'No classes');
    logger.info('Element tag:', e.target.tagName);
    
    // Highlight clicked element
    const originalBg = e.target.style.backgroundColor;
    const originalOutline = e.target.style.outline;
    e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    e.target.style.outline = '2px solid red';
    setTimeout(() => {
      e.target.style.backgroundColor = originalBg;
      e.target.style.outline = originalOutline;
    }, 500);
  });
  
  // Log all form submissions
  document.addEventListener('submit', (e) => {
    logger.info('Form submitted:', e.target);
    logger.info('Form ID:', e.target.id || 'No ID');
    logger.info('Form fields:', getFormData(e.target));
  });
  
  // Monitor DOM mutations for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        logger.info('DOM nodes added:', mutation.addedNodes);
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Add helper method to global window object
  if (typeof window !== 'undefined') {
    window.debugElement = (selector) => {
      const el = document.querySelector(selector);
      if (el) {
        logger.info('Debug element:', el);
        logger.info('Classes:', el.className);
        logger.info('Attributes:', Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`));
        logger.info('Styles:', el.style);
        logger.info('Computed styles:', window.getComputedStyle(el));
        
        // Highlight the element
        const originalOutline = el.style.outline;
        el.style.outline = '2px solid blue';
        setTimeout(() => {
          el.style.outline = originalOutline;
        }, 3000);
        
        return el;
      } else {
        logger.warn('No element found matching selector:', selector);
        return null;
      }
    };
    
    window.listClickableElements = () => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const anchors = Array.from(document.querySelectorAll('a'));
      const clickables = Array.from(document.querySelectorAll('[role="button"], .channel, .reaction, .input-action, .header-action'));
      
      logger.info('Buttons:', buttons);
      logger.info('Links:', anchors);
      logger.info('Other clickables:', clickables);
      
      return { buttons, anchors, clickables };
    };
    
    logger.info('Debug helpers added to window. Try window.debugElement(".channel") or window.listClickableElements()');
  }
  
  // Log navigation events
  useEffect(() => {
    const handleRouteChange = () => {
      logger.info('Route changed:', window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Log hydration status
  useEffect(() => {
    logger.info('Component hydrated:', new Date().toISOString());
  }, []);

  // Log client-side errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error('Client-side error occurred', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Log unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection occurred', {
        reason: event.reason,
        promise: event.promise,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);
  
  logger.info('Debug listeners setup complete');
}

// Helper to extract form data
function getFormData(form: HTMLFormElement) {
  const formData = new FormData(form);
  const data: Record<string, string> = {};
  
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });
  
  return data;
}

export function logComponentLifecycle(componentName: string) {
  if (process.env.NODE_ENV !== 'development') return;

  useEffect(() => {
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

// Add this to your page component with:
// useEffect(() => { setupDebugListeners(); }, []); 