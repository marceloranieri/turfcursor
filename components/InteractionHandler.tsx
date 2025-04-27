import logger from '@/lib/logger';
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Types for props
interface InteractionHandlerProps {
  debug?: boolean;
}

// Type for topic mapping
interface TopicMap {
  [key: string]: string;
}

/**
 * This component handles all user interactions in a clean, React-friendly way.
 * It attaches event handlers to interactive elements like channels, reactions, etc.
 */
export default function InteractionHandler({ debug = false }: InteractionHandlerProps) {
  const router = useRouter();
  const isInitialized = useRef(false);
  
  // Topic mapping used for navigation
  const topicMap: TopicMap = {
    'Remote Work Debate': '1',
    'AI Ethics': '2',
    'Climate Solutions': '3',
    'Education Reform': '4',
    'Cryptocurrency Future': '5'
  };
  
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Load fix script programmatically
    const loadFixScript = () => {
      const script = document.createElement('script');
      script.src = '/direct-fix.js';
      script.async = true;
      script.onload = () => logger.info('Direct fix script loaded successfully');
      script.onerror = () => logger.error('Failed to load direct fix script', { context: 'Error occurred' });
      document.body.appendChild(script);
    };

    // Load CSP-safe fix script
    const loadCspFixScript = () => {
      const script = document.createElement('script');
      script.src = '/fix-csp.js';
      script.async = true;
      script.onload = () => logger.info('CSP-safe fix script loaded successfully');
      script.onerror = () => logger.error('Failed to load CSP-safe fix script', { context: 'Error occurred' });
      document.body.appendChild(script);
    };

    // Setup event monitoring for debugging
    const setupEventMonitoring = () => {
      if (!debug) return;
      
      const events = ['click', 'submit', 'input', 'change', 'pointerdown', 'pointerup'];
      events.forEach(eventType => {
        document.addEventListener(eventType, (e) => {
          logger.info(`[Debug] ${eventType} event captured on:`, e.target);
        }, true); // Use capturing phase
      });
      
      logger.info('[Debug] Event monitoring setup complete');

      // Monitor for React synthetic events
      window.addEventListener('reactevent', (e) => {
        logger.info('[Debug] React synthetic event captured:', (e as CustomEvent).detail);
      });
    };

    // Function to make channels clickable
    const makeChannelsClickable = () => {
      logger.info('Making channels clickable');
      const channels = document.querySelectorAll('.channel');
      
      channels.forEach(channel => {
        // Skip if already processed
        if ((channel as any)._clickHandlerApplied) return;
        
        // Add visual cue
        (channel as HTMLElement).style.cursor = 'pointer';
        
        channel.addEventListener('click', (e) => {
          const nameElement = channel.querySelector('.truncate');
          if (nameElement) {
            const name = nameElement.textContent;
            logger.info('Channel clicked:', name);
            
            if (name) {
              const topics = {
                'Remote Work Debate': '1',
                'AI Ethics': '2',
                'Climate Solutions': '3',
                'Education Reform': '4',
                'Cryptocurrency Future': '5'
              };
              
              const id = topics[name as keyof typeof topics] || '1';
              window.location.href = `/chat/${id}`;
            }
          }
        });

        (channel as any)._clickHandlerApplied = true;
      });
    };

    // Ensure forms work properly
    const fixForms = () => {
      logger.info('Fixing forms');
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        // Skip if already processed
        if ((form as any)._formHandlerApplied) return;
        
        // Add an ID to the form if it doesn't have one
        if (!form.id) {
          form.id = 'message-form-' + Math.random().toString(36).substring(2, 9);
        }
        
        // Add submit handler
        form.addEventListener('submit', (e) => {
          logger.info('Form submitted:', form.id);
          
          // Get form data for logging
          const formData = new FormData(form);
          const formValues: Record<string, any> = {};
          for (const [key, value] of formData.entries()) {
            formValues[key] = value;
          }
          
          logger.info('Form data:', formValues);
          
          // Dispatch a custom event
          const submitEvent = new CustomEvent('turfformsubmit', { 
            detail: { form, values: formValues },
            bubbles: true 
          });
          form.dispatchEvent(submitEvent);
        });
        
        // Add a submit button if missing
        if (!form.querySelector('button[type="submit"]')) {
          const inputField = form.querySelector('.input-field, input');
          if (inputField) {
            logger.info('Adding submit button to form');
            const button = document.createElement('button');
            button.type = 'submit';
            button.textContent = 'Send';
            button.id = 'send-message-btn';
            button.className = 'send-button';
            button.style.marginLeft = '10px';
            button.style.padding = '0 16px';
            button.style.height = '36px';
            button.style.backgroundColor = '#5865f2';
            button.style.color = 'white';
            button.style.borderRadius = '4px';
            button.style.border = 'none';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            
            inputField.insertAdjacentElement('afterend', button);
            
            // Add enter key handler
            inputField.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                button.click();
              }
            });
          }
        }
        
        (form as any)._formHandlerApplied = true;
      });
    };

    // Initialize and apply fixes
    const init = () => {
      // Load fix scripts
      loadFixScript();
      loadCspFixScript();
      
      // Set up debugging
      setupEventMonitoring();
      
      // Apply direct fixes after a short delay
      setTimeout(() => {
        makeChannelsClickable();
        fixForms();
      }, 500);
      
      // Apply again after longer delay for lazy-loaded content
      setTimeout(() => {
        makeChannelsClickable();
        fixForms();
      }, 2000);
      
      // Set up a MutationObserver to handle dynamic content
      const observer = new MutationObserver(() => {
        makeChannelsClickable();
        fixForms();
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Apply fixes periodically as a fallback
      setInterval(() => {
        makeChannelsClickable();
        fixForms();
      }, 5000);
    };

    init();

    // Clean up
    return () => {
      // Nothing to clean up here as event listeners will be garbage collected
      // with their elements when the page unloads
    };
  }, [debug]);
  
  // Handle reaction buttons and interactive elements
  const setupReactionHandlers = () => {
    const interactiveElements = document.querySelectorAll('.reaction, .input-action, .header-action');
    
    if (debug) {
      logger.info(`Found ${interactiveElements.length} interactive elements`);
    }
    
    interactiveElements.forEach((element, index) => {
      // Add visual affordance
      element.classList.add('interactive');
      
      // Set cursor style
      (element as HTMLElement).style.cursor = 'pointer';
      
      // Add data attributes for tracking
      element.setAttribute('data-interaction-id', `interaction-${index}`);
      
      // Add click handler
      element.addEventListener('click', (event) => {
        event.preventDefault();
        
        if (debug) {
          logger.info(`Interactive element clicked: ${element.className}`);
        }
        
        // Track interaction for analytics
        if (event.currentTarget) {
          event.currentTarget.setAttribute('data-interacted', 'true');
          event.currentTarget.setAttribute('data-time', Date.now().toString());
        }
        
        // Show authentication modal if needed
        showAuthModal();
      });
    });
  };
  
  // Show authentication modal
  const showAuthModal = () => {
    // Check if modal already exists
    const existingModal = document.getElementById('auth-modal');
    if (existingModal) {
      return;
    }
    
    if (debug) {
      logger.info('Showing authentication modal');
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'auth-modal-title');
    
    // Apply styles
    const modalStyles = {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999'
    };
    
    Object.assign(modal.style, modalStyles);
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'auth-modal-content';
    
    // Apply styles
    const contentStyles = {
      backgroundColor: '#36393f',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '400px',
      width: '100%'
    };
    
    Object.assign(modalContent.style, contentStyles);
    
    // Create title
    const title = document.createElement('h2');
    title.id = 'auth-modal-title';
    title.textContent = 'Sign In Required';
    title.style.color = 'white';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '16px';
    
    // Create message
    const message = document.createElement('p');
    message.textContent = 'You need to sign in to interact with the chat.';
    message.style.color = '#dcddde';
    message.style.marginBottom = '24px';
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '12px';
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel-button';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.backgroundColor = '#4f545c';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    
    // Create sign in button
    const signInButton = document.createElement('button');
    signInButton.textContent = 'Sign In';
    signInButton.className = 'signin-button';
    signInButton.style.padding = '8px 16px';
    signInButton.style.backgroundColor = '#5865f2';
    signInButton.style.color = 'white';
    signInButton.style.border = 'none';
    signInButton.style.borderRadius = '4px';
    signInButton.style.cursor = 'pointer';
    
    // Add event listeners
    cancelButton.addEventListener('click', () => {
      modal.remove();
    });
    
    signInButton.addEventListener('click', () => {
      // Navigate to sign in page
      router.push('/auth/signin');
    });
    
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
    
    // Add keyboard navigation for accessibility
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        modal.remove();
      }
    });
    
    // Build the modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(signInButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Focus the sign in button for accessibility
    signInButton.focus();
  };
  
  // This component doesn't render anything visible
  return null;
} 