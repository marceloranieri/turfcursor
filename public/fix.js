// Log when the script loads
console.log('Fix script loaded!');

// Function to initialize interactivity
function initInteractivity() {
  console.log('Initializing interactivity');

  // Make all buttons and clickable elements interactive
  const clickableElements = document.querySelectorAll('button, .channel, .reaction, .input-action, .member, .header-action, .user-avatar');
  console.log('Found clickable elements:', clickableElements.length);
  
  clickableElements.forEach((element, index) => {
    // Add a data attribute for debugging
    element.setAttribute('data-clickable', 'true');
    element.setAttribute('data-element-index', index.toString());
    
    // Make the element more visibly clickable
    element.style.cursor = 'pointer';
    
    // Add click handler
    element.addEventListener('click', function(e) {
      console.log('Element clicked:', this, this.getAttribute('data-element-index'));
      e.stopPropagation(); // Prevent event bubbling
      
      // Handle channels
      if (this.classList.contains('channel')) {
        const channelName = this.querySelector('.truncate')?.textContent;
        console.log('Channel clicked:', channelName);
        if (channelName) {
          const topics = {
            'Remote Work Debate': '1',
            'AI Ethics': '2',
            'Climate Solutions': '3',
            'Education Reform': '4',
            'Cryptocurrency Future': '5'
          };
          const id = topics[channelName] || '1';
          console.log('Navigating to:', `/chat/${id}`);
          window.location.href = `/chat/${id}`;
        }
      }
      
      // Open guest modal for actions requiring auth
      if (this.classList.contains('reaction') || 
          this.classList.contains('input-action') ||
          this.classList.contains('header-action') ||
          this.classList.contains('user-avatar') ||
          this.closest('form')) {
        console.log('Action clicked, showing auth modal');
        showAuthModal();
        return false;
      }
    });
  });
  
  // Make form submit work
  const forms = document.querySelectorAll('form');
  console.log('Found forms:', forms.length);
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      console.log('Form submitted');
      e.preventDefault();
      showAuthModal();
      return false;
    });
  });
  
  // Add Send button if missing
  const messageForm = document.querySelector('.input-container');
  if (messageForm && !messageForm.querySelector('button[type="submit"]')) {
    console.log('Adding send button');
    const inputField = messageForm.querySelector('.input-field');
    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.className = 'ml-2 px-6 py-2 bg-accent-primary text-white font-semibold rounded-md hover:bg-gold transition-colors';
    sendButton.textContent = 'Send';
    sendButton.style.cursor = 'pointer';
    
    if (inputField) {
      inputField.insertAdjacentElement('afterend', sendButton);
    }
  }

  // Create an auth modal function
  function showAuthModal() {
    console.log('Creating auth modal');
    // Check if modal already exists
    if (document.getElementById('auth-modal')) {
      console.log('Modal already exists');
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.position = 'fixed';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    
    modal.innerHTML = `
      <div style="background-color: #2f3136; padding: 24px; border-radius: 8px; width: 100%; max-width: 400px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: white;">Sign In Required</h2>
        <p style="margin-bottom: 24px; color: #dcddde;">You need to sign in to send messages and interact with the debate.</p>
        <div style="display: flex; justify-content: flex-end; gap: 16px;">
          <button class="cancel-btn" style="padding: 8px 16px; background-color: #36393f; color: #dcddde; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
          <button class="signin-btn" style="padding: 8px 16px; background-color: #5865f2; color: white; border-radius: 4px; cursor: pointer;">
            Sign In
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.addEventListener('click', function(e) {
      console.log('Modal background clicked');
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    const cancelBtn = modal.querySelector('.cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        console.log('Cancel button clicked');
        modal.remove();
      });
    }
    
    const signinBtn = modal.querySelector('.signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', function() {
        console.log('Sign in button clicked');
        alert('Sign-in functionality would open here');
        modal.remove();
      });
    }
  }
}

// Make the function globally accessible
if (typeof window !== 'undefined') {
  window.initInteractivity = initInteractivity;
}

// Run initialization immediately
initInteractivity();

// Also run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing interactivity');
  initInteractivity();
});

// For Next.js - also run on route change events
if (typeof window !== 'undefined') {
  window.addEventListener('load', function() {
    console.log('Window loaded, initializing interactivity');
    initInteractivity();
  });
  
  // Set a timeout to make sure it runs in case other events don't trigger
  setTimeout(initInteractivity, 1000);
  setTimeout(initInteractivity, 2000);
  setTimeout(initInteractivity, 3000);
} 