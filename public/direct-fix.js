/**
 * Turf App Interaction Fix Script
 * This script fixes interaction and click event issues on the Turf app
 * It identifies and repairs events that aren't properly firing
 */

(function() {
  console.log('Turf App Fix Script loaded');
  
  // Configuration
  const config = {
    debug: true,
    fixClickEvents: true,
    fixFormSubmission: true,
    fixNavigation: true,
    fixModalInteractions: true,
    pollingInterval: 500, // ms
  };
  
  // Logger
  const logger = {
    log: function(message) {
      if (config.debug) {
        console.log('[TurfFix]', message);
      }
      // Dispatch a custom event for the debug page
      const event = new CustomEvent('turflog', { detail: { message, type: 'log' } });
      document.dispatchEvent(event);
    },
    error: function(message) {
      if (config.debug) {
        console.error('[TurfFix]', message);
      }
      // Dispatch a custom event for the debug page
      const event = new CustomEvent('turflog', { detail: { message, type: 'error' } });
      document.dispatchEvent(event);
    }
  };
  
  // Helper functions
  function isClickable(element) {
    // Check if the element has pointer cursor
    const computedStyle = window.getComputedStyle(element);
    const cursor = computedStyle.getPropertyValue('cursor');
    
    // Check various attributes that suggest clickability
    const hasAction = element.hasAttribute('href') || 
                      element.hasAttribute('onclick') ||
                      element.tagName === 'BUTTON' ||
                      element.tagName === 'A' ||
                      element.tagName === 'INPUT' && element.type === 'button' ||
                      element.tagName === 'INPUT' && element.type === 'submit' ||
                      element.role === 'button';
    
    // Look for common clickable class names
    const className = element.className || '';
    const hasClickableClass = className.includes('btn') || 
                             className.includes('button') ||
                             className.includes('clickable') ||
                             className.includes('channel');
    
    return cursor === 'pointer' || hasAction || hasClickableClass;
  }
  
  // Fix click events
  function fixClickEvents() {
    if (!config.fixClickEvents) return;
    
    logger.log('Fixing click events');
    
    // Find all potentially clickable elements
    const elements = document.querySelectorAll('*');
    let fixedCount = 0;
    
    elements.forEach(element => {
      if (isClickable(element) && !element._turfFixApplied) {
        // Check if the element already has click handlers
        const originalClick = element.onclick;
        
        // Apply new event handler
        element.addEventListener('click', function(e) {
          logger.log(`Click intercepted on element: ${element.tagName}`);
          
          // If it's a link without href, prevent default
          if (element.tagName === 'A' && !element.hasAttribute('href')) {
            e.preventDefault();
          }
          
          // If it has an original click handler, make sure it's called
          if (originalClick && typeof originalClick === 'function') {
            originalClick.call(this, e);
          }
          
          // Dispatch a custom event
          const clickEvent = new CustomEvent('turfclick', { 
            detail: {
              element: element,
              originalEvent: e
            },
            bubbles: true 
          });
          element.dispatchEvent(clickEvent);
        });
        
        // Mark as fixed
        element._turfFixApplied = true;
        fixedCount++;
      }
    });
    
    logger.log(`Fixed ${fixedCount} clickable elements`);
  }
  
  // Fix form submission
  function fixFormSubmission() {
    if (!config.fixFormSubmission) return;
    
    logger.log('Fixing form submission');
    
    const forms = document.querySelectorAll('form');
    let fixedCount = 0;
    
    forms.forEach(form => {
      if (!form._turfFixApplied) {
        // Check if form has a submit button
        const hasSubmitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        // Add a submit handler
        form.addEventListener('submit', function(e) {
          // Default prevention might be necessary in certain cases
          // e.preventDefault();
          
          logger.log(`Form submission intercepted: ${form.id || 'unnamed form'}`);
          
          // Get form data
          const formData = new FormData(form);
          const formDataObj = {};
          for (const [key, value] of formData.entries()) {
            formDataObj[key] = value;
          }
          
          // Dispatch a custom event with form data
          const submitEvent = new CustomEvent('turffixsubmit', { 
            detail: {
              form: form,
              formData: formDataObj,
              originalEvent: e
            },
            bubbles: true 
          });
          form.dispatchEvent(submitEvent);
        });
        
        // If no submit button, add one programmatically (keep invisible)
        if (!hasSubmitButton) {
          const submitButton = document.createElement('button');
          submitButton.type = 'submit';
          submitButton.style.position = 'absolute';
          submitButton.style.opacity = '0';
          submitButton.style.pointerEvents = 'none';
          form.appendChild(submitButton);
          
          // Add listener to any input element to submit on Enter
          const inputs = form.querySelectorAll('input[type="text"], input:not([type])');
          inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitButton.click();
              }
            });
          });
        }
        
        // Mark as fixed
        form._turfFixApplied = true;
        fixedCount++;
      }
    });
    
    logger.log(`Fixed ${fixedCount} forms`);
  }
  
  // Fix navigation
  function fixNavigation() {
    if (!config.fixNavigation) return;
    
    logger.log('Fixing navigation elements');
    
    // Find all navigation-like elements
    const navElements = document.querySelectorAll('.nav-item, .channel, .sidebar-item, nav a, [role="navigation"] a');
    let fixedCount = 0;
    
    navElements.forEach(navElement => {
      if (!navElement._turfFixApplied) {
        navElement.addEventListener('click', function(e) {
          logger.log(`Navigation click intercepted: ${navElement.textContent || 'unnamed nav'}`);
          
          // Determine target - if it's a link with href, respect that
          if (navElement.tagName === 'A' && navElement.hasAttribute('href')) {
            // Let the normal navigation occur
            return;
          }
          
          // For other nav elements, dispatch a custom event
          const navEvent = new CustomEvent('turfnavigation', { 
            detail: {
              element: navElement,
              originalEvent: e
            },
            bubbles: true 
          });
          navElement.dispatchEvent(navEvent);
        });
        
        // Make sure it's clickable
        if (window.getComputedStyle(navElement).cursor !== 'pointer') {
          navElement.style.cursor = 'pointer';
        }
        
        // Mark as fixed
        navElement._turfFixApplied = true;
        fixedCount++;
      }
    });
    
    logger.log(`Fixed ${fixedCount} navigation elements`);
  }
  
  // Fix modal interactions
  function fixModalInteractions() {
    if (!config.fixModalInteractions) return;
    
    logger.log('Fixing modal interactions');
    
    // Find all potential modals
    const modals = document.querySelectorAll('.modal, .modal-content, [role="dialog"]');
    const modalOverlays = document.querySelectorAll('.modal-overlay, .modal-backdrop, .overlay');
    let fixedCount = 0;
    
    // Fix modals
    modals.forEach(modal => {
      if (!modal._turfFixApplied) {
        // Find close buttons within the modal
        const closeButtons = modal.querySelectorAll('.close, .close-button, .modal-close, [aria-label="Close"]');
        
        closeButtons.forEach(closeButton => {
          closeButton.addEventListener('click', function(e) {
            logger.log('Modal close button clicked');
            
            // Dispatch a custom event
            const closeEvent = new CustomEvent('turfmodalclose', { 
              detail: {
                modal: modal,
                originalEvent: e
              },
              bubbles: true 
            });
            document.dispatchEvent(closeEvent);
            
            // Find parent overlay to hide
            let overlay = modal.closest('.modal-overlay, .modal-backdrop, .overlay');
            if (overlay) {
              overlay.style.display = 'none';
            }
          });
        });
        
        // Mark as fixed
        modal._turfFixApplied = true;
        fixedCount++;
      }
    });
    
    // Fix overlays (clicking on the overlay to close)
    modalOverlays.forEach(overlay => {
      if (!overlay._turfFixApplied) {
        overlay.addEventListener('click', function(e) {
          // Only close if clicking the overlay itself, not its children
          if (e.target === overlay) {
            logger.log('Modal overlay clicked');
            
            // Dispatch a custom event
            const closeEvent = new CustomEvent('turfmodalclose', { 
              detail: {
                overlay: overlay,
                originalEvent: e
              },
              bubbles: true 
            });
            document.dispatchEvent(closeEvent);
            
            overlay.style.display = 'none';
          }
        });
        
        // Mark as fixed
        overlay._turfFixApplied = true;
        fixedCount++;
      }
    });
    
    logger.log(`Fixed ${fixedCount} modal elements`);
  }
  
  // Main fix function to run all fixes
  function applyFixes() {
    logger.log('Applying Turf app interaction fixes');
    
    try {
      fixClickEvents();
      fixFormSubmission();
      fixNavigation();
      fixModalInteractions();
      
      logger.log('All fixes applied successfully');
      
      // Dispatch event for successful fix
      const fixEvent = new CustomEvent('turffixapplied', { 
        detail: {
          timestamp: new Date().toISOString(),
          fixes: ['clicks', 'forms', 'navigation', 'modals']
        }
      });
      document.dispatchEvent(fixEvent);
    } catch (error) {
      logger.error(`Error applying fixes: ${error.message}`);
    }
  }
  
  // Setup mutation observer to fix dynamically added content
  function setupObserver() {
    logger.log('Setting up mutation observer');
    
    const observer = new MutationObserver(function(mutations) {
      let shouldReapplyFixes = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReapplyFixes = true;
        }
      });
      
      if (shouldReapplyFixes) {
        logger.log('DOM changes detected, reapplying fixes');
        applyFixes();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    logger.log('Mutation observer setup complete');
  }
  
  // Initialize
  function init() {
    logger.log('Initializing Turf app fix script');
    
    // Initial fix application
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        applyFixes();
        setupObserver();
      });
    } else {
      applyFixes();
      setupObserver();
    }
    
    // Poll for new elements periodically as a fallback
    setInterval(applyFixes, config.pollingInterval);
    
    // Let the debug page know the script is fully initialized
    const initEvent = new CustomEvent('turfixinitialized', { 
      detail: {
        timestamp: new Date().toISOString(),
        config: config
      }
    });
    document.dispatchEvent(initEvent);
  }
  
  // Start initialization
  init();
})();