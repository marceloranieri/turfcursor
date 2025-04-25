'use client';

import { useEffect } from 'react';
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
export const InteractionHandler: React.FC<InteractionHandlerProps> = ({ debug = false }) => {
  const router = useRouter();
  
  // Topic mapping used for navigation
  const topicMap: TopicMap = {
    'Remote Work Debate': '1',
    'AI Ethics': '2',
    'Climate Solutions': '3',
    'Education Reform': '4',
    'Cryptocurrency Future': '5'
  };
  
  useEffect(() => {
    if (debug) {
      console.log('InteractionHandler: Initializing interaction handlers');
    }
    
    // Set up channel click handlers
    setupChannelHandlers();
    
    // Set up reaction buttons
    setupReactionHandlers();
    
    // Set up form handlers
    setupFormHandlers();
    
    // Set up other interactive elements
    setupMiscInteractions();
    
    // Cleanup function
    return () => {
      if (debug) {
        console.log('InteractionHandler: Cleaning up event handlers');
      }
      // No need to remove event handlers for React-managed elements
      // Events on dynamically added elements should be cleaned up here
    };
  }, [router, debug]);
  
  // Handle channel clicks for navigation
  const setupChannelHandlers = () => {
    const channels = document.querySelectorAll('.channel');
    
    if (debug) {
      console.log(`Found ${channels.length} channel elements`);
    }
    
    channels.forEach((channel) => {
      // Add visual affordance
      channel.classList.add('interactive');
      
      // Set cursor style
      (channel as HTMLElement).style.cursor = 'pointer';
      
      // Add click handler
      channel.addEventListener('click', (event) => {
        const nameElement = channel.querySelector('.truncate');
        if (nameElement && nameElement.textContent) {
          const topicName = nameElement.textContent.trim();
          const topicId = topicMap[topicName] || '1';
          
          if (debug) {
            console.log(`Channel clicked: ${topicName} → navigating to topic ${topicId}`);
          }
          
          // Add data attributes for analytics
          if (event.currentTarget) {
            event.currentTarget.setAttribute('data-interaction', 'channel-click');
            event.currentTarget.setAttribute('data-target', topicId);
          }
          
          // Use the Next.js router for client-side navigation
          router.push(`/chat/${topicId}`);
        }
      });
    });
  };
  
  // Handle reaction buttons and interactive elements
  const setupReactionHandlers = () => {
    const interactiveElements = document.querySelectorAll('.reaction, .input-action, .header-action');
    
    if (debug) {
      console.log(`Found ${interactiveElements.length} interactive elements`);
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
          console.log(`Interactive element clicked: ${element.className}`);
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
  
  // Handle form submissions
  const setupFormHandlers = () => {
    const forms = document.querySelectorAll('form');
    
    if (debug) {
      console.log(`Found ${forms.length} forms`);
    }
    
    forms.forEach((form, index) => {
      // Add ID and name to form if missing
      if (!form.id) {
        form.id = `message-form-${index}`;
      }
      
      // Add IDs and names to form elements if missing
      const formInputs = form.querySelectorAll('input, textarea');
      formInputs.forEach((input, inputIndex) => {
        if (!input.id) {
          input.id = `input-${index}-${inputIndex}`;
        }
        if (!input.getAttribute('name')) {
          input.setAttribute('name', `field-${inputIndex}`);
        }
      });
      
      // Add a submit button if missing
      if (!form.querySelector('button[type="submit"]')) {
        const inputField = form.querySelector('.input-field, input[type="text"], textarea');
        
        if (inputField) {
          if (debug) {
            console.log(`Adding submit button to form #${index}`);
          }
          
          const button = document.createElement('button');
          button.type = 'submit';
          button.id = `submit-button-${index}`;
          button.className = 'submit-button';
          button.textContent = 'Send';
          button.style.marginLeft = '10px';
          button.style.padding = '0 16px';
          button.style.height = '36px';
          button.style.backgroundColor = '#5865f2';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '4px';
          button.style.fontWeight = 'bold';
          button.style.cursor = 'pointer';
          
          inputField.insertAdjacentElement('afterend', button);
        }
      }
      
      // Add submit handler
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        if (debug) {
          console.log(`Form submitted: ${form.id}`);
        }
        
        // Get form data
        const formData = new FormData(form);
        const messageValue = formData.get('message') || '';
        
        if (debug) {
          console.log(`Message content: ${messageValue}`);
        }
        
        // Show authentication modal if needed
        showAuthModal();
      });
    });
  };
  
  // Setup other interactive elements
  const setupMiscInteractions = () => {
    // Member list items
    const memberItems = document.querySelectorAll('.member-item');
    
    if (debug && memberItems.length > 0) {
      console.log(`Found ${memberItems.length} member items`);
    }
    
    memberItems.forEach((member) => {
      // Set cursor style
      (member as HTMLElement).style.cursor = 'pointer';
      
      // Add click handler
      member.addEventListener('click', (event) => {
        event.preventDefault();
        
        if (debug) {
          console.log(`Member clicked: ${member.textContent}`);
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
      console.log('Showing authentication modal');
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
};

export default InteractionHandler; 