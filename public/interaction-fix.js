/**
 * Consolidated Interaction Fix Script
 * This script addresses common interaction issues and provides visual feedback
 */

(function() {
  console.log('Consolidated interaction fix script loaded');
  
  // Configuration
  const config = {
    debug: false, // Set to true to see console logs
    fixClickEvents: true,
    fixFormSubmission: true,
    fixZIndex: true,
    pollingInterval: 1000, // ms
  };
  
  // Fix z-index issues
  function fixZIndex() {
    if (!config.fixZIndex) return;
    
    // Make sure interactive elements have proper z-index and positioning
    document.querySelectorAll('button, .button, a, [role="button"], .channel, input[type="submit"]')
      .forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'static') {
          el.style.position = 'relative';
        }
        
        if (!el.style.zIndex) {
          el.style.zIndex = '1';
        }
      });
    
    // Ensure modals have higher z-index
    document.querySelectorAll('.modal, .modal-overlay, [role="dialog"]')
      .forEach(el => {
        el.style.zIndex = '100';
      });
  }
  
  // Fix event propagation issues
  function fixEventPropagation() {
    // Fix event bubbling for elements that might be blocking clicks
    document.querySelectorAll('.overlay, .backdrop, .background')
      .forEach(el => {
        if (!el._propagationFixed) {
          el.addEventListener('click', (e) => {
            // If clicking directly on the overlay (not a child), let it through
            if (e.target === el) {
              e.stopPropagation();
            }
          });
          el._propagationFixed = true;
        }
      });
  }
  
  // Fix form submissions
  function fixFormSubmissions() {
    if (!config.fixFormSubmission) return;
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (!form._formFixed) {
        // Ensure forms have submit buttons
        if (!form.querySelector('button[type="submit"], input[type="submit"]')) {
          const submitButton = document.createElement('button');
          submitButton.type = 'submit';
          submitButton.style.display = 'none';
          form.appendChild(submitButton);
        }
        
        // Fix Enter key submission for inputs
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        inputs.forEach(input => {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (config.debug) console.log('Enter pressed in input, submitting form');
              e.preventDefault();
              const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
              if (submitBtn) submitBtn.click();
            }
          });
        });
        
        form._formFixed = true;
      }
    });
  }
  
  // Fix click events
  function fixClickEvents() {
    if (!config.fixClickEvents) return;
    
    // Find all potentially clickable elements
    const clickables = document.querySelectorAll('button, .button, a, [role="button"], .channel, input[type="submit"]');
    
    clickables.forEach(el => {
      if (!el._clickFixed) {
        // Make sure cursor is pointer
        if (window.getComputedStyle(el).cursor !== 'pointer') {
          el.style.cursor = 'pointer';
        }
        
        // Add visual feedback
        el.addEventListener('mousedown', () => {
          el.style.transform = 'scale(0.98)';
        });
        
        el.addEventListener('mouseup', () => {
          el.style.transform = '';
        });
        
        // For links without href that should be router links
        if (el.tagName === 'A' && !el.getAttribute('href')) {
          if (el.dataset.href) {
            el.addEventListener('click', () => {
              window.location.href = el.dataset.href;
            });
          }
        }
        
        el._clickFixed = true;
      }
    });
  }
  
  // Main function to apply fixes
  function applyFixes() {
    if (config.debug) console.log('Applying interaction fixes');
    
    fixZIndex();
    fixEventPropagation();
    fixFormSubmissions();
    fixClickEvents();
  }
  
  // Setup mutation observer to fix new elements
  function setupObserver() {
    if (config.debug) console.log('Setting up mutation observer');
    
    const observer = new MutationObserver((mutations) => {
      let shouldReapplyFixes = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReapplyFixes = true;
        }
      });
      
      if (shouldReapplyFixes) {
        if (config.debug) console.log('DOM changes detected, reapplying fixes');
        applyFixes();
      }
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });
  }
  
  // Initialize
  function init() {
    if (config.debug) console.log('Initializing interaction fix script');
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyFixes();
        setupObserver();
      });
    } else {
      applyFixes();
      setupObserver();
    }
    
    // Also apply after window load
    window.addEventListener('load', applyFixes);
    
    // Poll for new elements periodically as a fallback
    setInterval(applyFixes, config.pollingInterval);
  }
  
  // Start initialization
  init();
})(); 