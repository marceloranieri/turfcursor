/**
 * Turf App CSP-Safe Interaction Fix Script
 * This script fixes interaction problems while being safe for Content Security Policy restrictions
 */

(function() {
  console.log('CSP-safe fix script loaded');
  
  // Function to apply fixes when DOM is ready
  function applyFixes() {
    // Find all clickable elements
    const clickables = document.querySelectorAll('button, .button, .channel, a, [role="button"], .nav-item, .sidebar-item');
    console.log(`Found ${clickables.length} clickable elements`);
    
    // Add click handlers
    clickables.forEach(element => {
      // Skip if already processed
      if (element._cspFixApplied) return;
      
      // Ensure element is visually clickable
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.cursor !== 'pointer') {
        element.style.cursor = 'pointer';
      }
      
      element.addEventListener('click', function(e) {
        console.log(`Click captured on: ${element.tagName}`, element);
        
        // Visual feedback for click
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
          element.style.transform = '';
        }, 100);
        
        // If it's a channel in the sidebar, handle navigation
        if (element.classList.contains('channel')) {
          const nameElement = element.querySelector('.truncate');
          if (nameElement) {
            const name = nameElement.textContent;
            console.log('Channel clicked:', name);
            
            if (name) {
              const topics = {
                'Remote Work Debate': '1',
                'AI Ethics': '2',
                'Climate Solutions': '3',
                'Education Reform': '4',
                'Cryptocurrency Future': '5'
              };
              
              const id = topics[name] || '1';
              window.location.href = `/chat/${id}`;
            }
          }
        }
      });
      
      element._cspFixApplied = true;
    });
    
    // Handle forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // Skip if already processed
      if (form._cspFixApplied) return;
      
      form.addEventListener('submit', function(e) {
        console.log('Form submission captured', form);
        
        // Add a submit button if missing
        if (!form.querySelector('button[type="submit"], input[type="submit"]')) {
          console.log('Adding hidden submit button to form');
          const submitButton = document.createElement('button');
          submitButton.type = 'submit';
          submitButton.style.position = 'absolute';
          submitButton.style.opacity = '0';
          submitButton.style.pointerEvents = 'none';
          form.appendChild(submitButton);
        }
      });
      
      // Add enter key handling for inputs
      const inputs = form.querySelectorAll('input[type="text"], input:not([type])');
      inputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            console.log('Enter key pressed in input, submitting form');
            e.preventDefault();
            
            // Try to find a submit button
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
              submitButton.click();
            } else {
              // If no submit button, submit the form directly
              form.submit();
            }
          }
        });
      });
      
      form._cspFixApplied = true;
    });
    
    // Fix modal interactions
    const modals = document.querySelectorAll('.modal, .modal-content, [role="dialog"]');
    const modalOverlays = document.querySelectorAll('.modal-overlay, .modal-backdrop, .overlay');
    
    modals.forEach(modal => {
      if (modal._cspFixApplied) return;
      
      // Find close buttons
      const closeButtons = modal.querySelectorAll('.close, .close-button, .modal-close, [aria-label="Close"]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          console.log('Modal close button clicked');
          
          // Find parent overlay to hide
          let overlay = modal.closest('.modal-overlay, .modal-backdrop, .overlay');
          if (overlay) {
            overlay.style.display = 'none';
          }
        });
      });
      
      modal._cspFixApplied = true;
    });
    
    // Fix overlays (clicking to close)
    modalOverlays.forEach(overlay => {
      if (overlay._cspFixApplied) return;
      
      overlay.addEventListener('click', function(e) {
        // Only close if clicking the overlay itself, not its children
        if (e.target === overlay) {
          console.log('Modal overlay clicked');
          overlay.style.display = 'none';
        }
      });
      
      overlay._cspFixApplied = true;
    });
    
    console.log('All CSP-safe event handlers attached');
  }
  
  // Setup monitoring for debugging
  function setupEventMonitoring() {
    const events = ['click', 'submit', 'input', 'change'];
    events.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        console.log(`${eventType} event captured on:`, e.target);
      }, true); // Use capturing phase to see all events
    });
    console.log('Event monitoring setup complete');
  }
  
  // Setup a MutationObserver to handle dynamically added content
  function setupObserver() {
    const observer = new MutationObserver(mutations => {
      let shouldReapplyFixes = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldReapplyFixes = true;
        }
      });
      
      if (shouldReapplyFixes) {
        console.log('DOM changes detected, reapplying CSP-safe fixes');
        applyFixes();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    console.log('CSP-safe mutation observer setup complete');
  }
  
  // Initialize
  function init() {
    console.log('Initializing CSP-safe fix script');
    
    // Initial fix application
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        applyFixes();
        setupObserver();
        if (location.hostname === 'localhost' || location.search.includes('debug=true')) {
          setupEventMonitoring();
        }
      });
    } else {
      applyFixes();
      setupObserver();
      if (location.hostname === 'localhost' || location.search.includes('debug=true')) {
        setupEventMonitoring();
      }
    }
    
    // Poll for new elements periodically as a fallback
    setInterval(applyFixes, 1000);
  }
  
  // Start initialization
  init();
})(); 