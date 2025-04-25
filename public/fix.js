document.addEventListener('DOMContentLoaded', function() {
  console.log('Fix script loaded - adding interactivity');
  
  // Make all buttons clickable
  document.querySelectorAll('button, .channel, .reaction, .input-action, .member').forEach(element => {
    element.addEventListener('click', function(e) {
      console.log('Element clicked:', this);
      
      // Handle channels
      if (this.classList.contains('channel')) {
        const channelName = this.querySelector('.truncate')?.textContent;
        if (channelName) {
          // Find topic ID
          const topics = {
            'Remote Work Debate': '1',
            'AI Ethics': '2',
            'Climate Solutions': '3',
            'Education Reform': '4',
            'Cryptocurrency Future': '5'
          };
          const id = topics[channelName] || '1';
          window.location.href = `/chat/${id}`;
        }
      }
      
      // Open guest modal for actions requiring auth
      if (this.classList.contains('reaction') || 
          this.classList.contains('input-action') ||
          this.closest('form')) {
        // Show custom auth modal
        showAuthModal();
      }
    });
  });
  
  // Make form submit work
  document.querySelector('form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showAuthModal();
  });
  
  // Create an auth modal function
  function showAuthModal() {
    // Check if modal already exists
    if (document.getElementById('auth-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-background-secondary rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Sign In Required</h2>
        <p class="mb-6">You need to sign in to send messages and interact with the debate.</p>
        <div class="flex justify-end space-x-4">
          <button class="cancel-btn px-4 py-2 bg-background-tertiary text-text-primary rounded">
            Cancel
          </button>
          <button class="signin-btn px-4 py-2 bg-accent-primary text-white rounded">
            Sign In
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
      modal.remove();
    });
    
    modal.querySelector('.signin-btn').addEventListener('click', function() {
      // Redirect to sign in page or show sign in form
      alert('Sign-in functionality would open here');
      modal.remove();
    });
  }
  
  // Add Send button if missing
  const messageForm = document.querySelector('.input-container');
  if (messageForm && !messageForm.querySelector('button[type="submit"]')) {
    const inputField = messageForm.querySelector('.input-field');
    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.className = 'ml-2 px-6 py-2 bg-accent-primary text-white font-semibold rounded-md hover:bg-gold transition-colors';
    sendButton.textContent = 'Send';
    
    if (inputField) {
      inputField.insertAdjacentElement('afterend', sendButton);
    }
  }
}); 