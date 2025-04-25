/**
 * Optimized Interaction Fix Script
 * This script addresses common interaction issues with improved performance
 */

(function() {
  'use strict';
  
  // Configuration with performance optimizations
  const config = {
    debug: false,
    fixClickEvents: true,
    fixFormSubmission: true,
    fixZIndex: true,
    pollingInterval: 2000, // Less frequent polling
    batchSize: 20, // Process elements in batches
    throttleInterval: 100, // Throttle observer callbacks
  };
  
  // Cache selectors for better performance
  const SELECTORS = {
    clickables: 'button, .button, a, [role="button"], .channel, input[type="submit"]',
    overlays: '.overlay, .backdrop, .background',
    modals: '.modal, .modal-overlay, [role="dialog"]',
    forms: 'form',
    inputs: 'input[type="text"], input[type="email"], input[type="password"]'
  };
  
  // Cache DOM elements to avoid frequent queries
  const cache = {
    processedElements: new WeakSet(),
    lastUpdate: 0,
    pendingUpdate: false
  };
  
  // Throttle function to limit execution frequency
  function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  }
  
  // Process elements in batches for better performance
  function processBatch(elements, processor, batchSize = config.batchSize) {
    const total = elements.length;
    let processed = 0;
    
    function processNextBatch() {
      const limit = Math.min(processed + batchSize, total);
      for (let i = processed; i < limit; i++) {
        if (!cache.processedElements.has(elements[i])) {
          processor(elements[i]);
          cache.processedElements.add(elements[i]);
        }
      }
      processed = limit;
      
      if (processed < total) {
        // Schedule next batch using requestAnimationFrame for better performance
        window.requestAnimationFrame(processNextBatch);
      }
    }
    
    processNextBatch();
  }
  
  // Fix z-index issues
  function fixZIndex() {
    if (!config.fixZIndex) return;
    
    const clickables = document.querySelectorAll(SELECTORS.clickables);
    processBatch(clickables, el => {
      const computed = window.getComputedStyle(el);
      if (computed.position === 'static') {
        el.style.position = 'relative';
      }
      
      if (!el.style.zIndex) {
        el.style.zIndex = '1';
      }
    });
    
    const modals = document.querySelectorAll(SELECTORS.modals);
    processBatch(modals, el => {
      el.style.zIndex = '100';
    });
  }
  
  // Fix event propagation issues
  function fixEventPropagation() {
    const overlays = document.querySelectorAll(SELECTORS.overlays);
    processBatch(overlays, el => {
      el.addEventListener('click', (e) => {
        // If clicking directly on the overlay (not a child), let it through
        if (e.target === el) {
          e.stopPropagation();
        }
      }, { passive: true }); // Use passive listeners for better performance
    });
  }
  
  // Fix form submissions
  function fixFormSubmissions() {
    if (!config.fixFormSubmission) return;
    
    const forms = document.querySelectorAll(SELECTORS.forms);
    processBatch(forms, form => {
      // Ensure forms have submit buttons
      if (!form.querySelector('button[type="submit"], input[type="submit"]')) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.style.display = 'none';
        form.appendChild(submitButton);
      }
      
      // Fix Enter key submission for inputs
      const inputs = form.querySelectorAll(SELECTORS.inputs);
      processBatch(inputs, input => {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) submitBtn.click();
          }
        }, { passive: false });
      });
    });
  }
  
  // Fix click events
  function fixClickEvents() {
    if (!config.fixClickEvents) return;
    
    const clickables = document.querySelectorAll(SELECTORS.clickables);
    processBatch(clickables, el => {
      // Make sure cursor is pointer
      if (window.getComputedStyle(el).cursor !== 'pointer') {
        el.style.cursor = 'pointer';
      }
      
      // Add visual feedback with hardware acceleration
      el.addEventListener('mousedown', () => {
        el.style.transform = 'scale(0.98)';
        el.style.willChange = 'transform';
      }, { passive: true });
      
      el.addEventListener('mouseup', () => {
        el.style.transform = '';
        // Remove will-change after animation completes
        setTimeout(() => {
          el.style.willChange = 'auto';
        }, 200);
      }, { passive: true });
      
      // For links without href that should be router links
      if (el.tagName === 'A' && !el.getAttribute('href') && el.dataset.href) {
        el.addEventListener('click', () => {
          window.location.href = el.dataset.href;
        }, { passive: true });
      }
    });
  }
  
  // Main function to apply fixes
  const applyFixes = throttle(() => {
    if (cache.pendingUpdate) return;
    
    cache.pendingUpdate = true;
    
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleTask = window.requestIdleCallback || window.setTimeout;
    scheduleTask(() => {
      if (config.debug) console.log('[Optimized] Applying interaction fixes');
      
      fixZIndex();
      fixEventPropagation();
      fixFormSubmissions();
      fixClickEvents();
      
      cache.lastUpdate = Date.now();
      cache.pendingUpdate = false;
    }, { timeout: 300 });
  }, config.throttleInterval);
  
  // Setup mutation observer to fix new elements
  function setupObserver() {
    if (config.debug) console.log('[Optimized] Setting up mutation observer');
    
    // Create observer with throttled callback for better performance
    const observer = new MutationObserver(
      throttle((mutations) => {
        let shouldReapplyFixes = false;
        
        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].type === 'childList' && mutations[i].addedNodes.length > 0) {
            shouldReapplyFixes = true;
            break;
          }
        }
        
        if (shouldReapplyFixes && !cache.pendingUpdate) {
          if (config.debug) console.log('[Optimized] DOM changes detected, reapplying fixes');
          applyFixes();
        }
      }, config.throttleInterval)
    );
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
    
    return observer;
  }
  
  // Initialize and apply fixes
  function init() {
    if (config.debug) console.log('[Optimized] Initializing interaction fix script');
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyFixes);
    } else {
      applyFixes();
    }
    
    // Apply fixes when all resources are loaded
    window.addEventListener('load', applyFixes, { passive: true });
    
    // Set up observer for dynamic changes
    const observer = setupObserver();
    
    // Interval as a fallback (less frequent)
    const interval = setInterval(applyFixes, config.pollingInterval);
    
    // Clean up function
    return function cleanup() {
      observer.disconnect();
      clearInterval(interval);
    };
  }
  
  // Start initialization
  const cleanup = init();
  
  // Expose cleanup method if needed
  window.__interactionFixCleanup = cleanup;
})(); 