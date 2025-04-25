// Log when the script loads
console.log('CSP-compliant fix script loaded!');

// Function to initialize interactivity
function initInteractivity() {
  console.log('Initializing interactivity (CSP-compliant)');

  // Define topic mapping
  const topicMap = {
    'Remote Work Debate': '1',
    'AI Ethics': '2',
    'Climate Solutions': '3',
    'Education Reform': '4',
    'Cryptocurrency Future': '5'
  };

  // Make all buttons and clickable elements interactive
  function setupClickHandlers() {
    // Channel elements
    document.querySelectorAll('.channel').forEach(function(channel) {
      channel.style.cursor = 'pointer';
      channel.addEventListener('click', function() {
        const nameElement = this.querySelector('.truncate');
        if (nameElement) {
          const channelName = nameElement.textContent;
          if (channelName && topicMap[channelName]) {
            const topicId = topicMap[channelName];
            console.log('Channel clicked:', channelName, '-> navigating to:', topicId);
            window.location.href = '/chat/' + topicId;
          }
        }
      });
    });

    // Reaction elements
    document.querySelectorAll('.reaction').forEach(function(reaction) {
      reaction.style.cursor = 'pointer';
      reaction.addEventListener('click', function(e) {
        console.log('Reaction clicked');
        showAuthModal();
        e.preventDefault();
      });
    });

    // Input action elements
    document.querySelectorAll('.input-action').forEach(function(action) {
      action.style.cursor = 'pointer';
      action.addEventListener('click', function(e) {
        console.log('Input action clicked');
        showAuthModal();
        e.preventDefault();
      });
    });

    // Header action elements
    document.querySelectorAll('.header-action').forEach(function(action) {
      action.style.cursor = 'pointer';
      action.addEventListener('click', function(e) {
        console.log('Header action clicked');
        showAuthModal();
        e.preventDefault();
      });
    });

    // Member elements
    document.querySelectorAll('.member').forEach(function(member) {
      member.style.cursor = 'pointer';
      member.addEventListener('click', function(e) {
        console.log('Member clicked');
        showAuthModal();
        e.preventDefault();
      });
    });

    // User avatar
    document.querySelectorAll('.user-avatar').forEach(function(avatar) {
      avatar.style.cursor = 'pointer';
      avatar.addEventListener('click', function(e) {
        console.log('Avatar clicked');
        showAuthModal();
        e.preventDefault();
      });
    });
  }

  // Handle form submissions
  function setupFormHandlers() {
    document.querySelectorAll('form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        console.log('Form submitted');
        e.preventDefault();
        showAuthModal();
        return false;
      });
    });
  }

  // Add Send button if missing
  function addSendButton() {
    const messageForm = document.querySelector('.input-container');
    if (messageForm && !messageForm.querySelector('button[type="submit"]')) {
      console.log('Adding send button');
      const inputField = messageForm.querySelector('.input-field');
      if (inputField) {
        const sendButton = document.createElement('button');
        sendButton.type = 'submit';
        sendButton.className = 'ml-2 px-6 py-2 bg-accent-primary text-white font-semibold rounded-md hover:bg-gold transition-colors';
        sendButton.textContent = 'Send';
        sendButton.style.cursor = 'pointer';
        
        inputField.insertAdjacentElement('afterend', sendButton);
      }
    }
  }

  // Auth modal function
  function showAuthModal() {
    if (document.getElementById('auth-modal')) {
      console.log('Modal already exists');
      return;
    }
    
    console.log('Creating auth modal');
    
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#2f3136';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '100%';
    modalContent.style.maxWidth = '400px';
    
    const title = document.createElement('h2');
    title.textContent = 'Sign In Required';
    title.style.fontSize = '20px';
    title.style.fontWeight = '600';
    title.style.marginBottom = '16px';
    title.style.color = 'white';
    
    const message = document.createElement('p');
    message.textContent = 'You need to sign in to send messages and interact with the debate.';
    message.style.marginBottom = '24px';
    message.style.color = '#dcddde';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '16px';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.backgroundColor = '#36393f';
    cancelButton.style.color = '#dcddde';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.border = 'none';
    
    const signInButton = document.createElement('button');
    signInButton.className = 'signin-btn';
    signInButton.textContent = 'Sign In';
    signInButton.style.padding = '8px 16px';
    signInButton.style.backgroundColor = '#5865f2';
    signInButton.style.color = 'white';
    signInButton.style.borderRadius = '4px';
    signInButton.style.cursor = 'pointer';
    signInButton.style.border = 'none';
    
    // Build the modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(signInButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    cancelButton.addEventListener('click', function() {
      modal.remove();
    });
    
    signInButton.addEventListener('click', function() {
      alert('Sign-in functionality would open here');
      modal.remove();
    });
  }

  // Run all setup functions
  setupClickHandlers();
  setupFormHandlers();
  addSendButton();
}

// Run initialization immediately
initInteractivity();

// Also run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing interactivity');
  initInteractivity();
});

// For Next.js - also run when the window loads
window.addEventListener('load', function() {
  console.log('Window loaded, initializing interactivity');
  initInteractivity();
});

// Set a timeout to make sure it runs in case other events don't trigger
setTimeout(function() {
  console.log('Timeout reached, initializing interactivity');
  initInteractivity();
}, 2000); 