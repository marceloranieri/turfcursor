// CSP-compliant fix script - no eval() or unsafe functions
(function() {
  console.log('CSP-compliant fix script loaded');
  
  // Simple topic mapping using a regular object (CSP-safe)
  var topicMap = {
    'Remote Work Debate': '1',
    'AI Ethics': '2',
    'Climate Solutions': '3',
    'Education Reform': '4',
    'Cryptocurrency Future': '5'
  };
  
  function setupClickHandlers() {
    // Make channels clickable
    var channels = document.querySelectorAll('.channel');
    console.log('Found', channels.length, 'channels');
    
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      channel.style.cursor = 'pointer';
      
      // Use closure to preserve the channel reference
      (function(ch) {
        ch.addEventListener('click', function(event) {
          var nameElement = ch.querySelector('.truncate');
          if (nameElement && nameElement.textContent) {
            var name = nameElement.textContent;
            var id = topicMap[name] || '1';
            console.log('Channel clicked:', name, '→', id);
            
            // Add data attributes for tracking
            if (event.target) {
              event.target.setAttribute('data-channel-id', 'channel-' + id);
              event.target.setAttribute('data-channel-name', 'Channel: ' + name);
            }
            
            // Navigate with a slight delay to ensure attributes are processed
            setTimeout(function() {
              window.location.href = '/chat/' + id;
            }, 10);
          }
        });
      })(channel);
    }
    
    // Make reaction elements clickable
    var interactiveElements = document.querySelectorAll('.reaction, .input-action, .header-action');
    console.log('Found', interactiveElements.length, 'interactive elements');
    
    for (var i = 0; i < interactiveElements.length; i++) {
      var element = interactiveElements[i];
      element.style.cursor = 'pointer';
      
      // Add data attributes for tracking
      element.setAttribute('data-interaction-id', 'interaction-' + i);
      
      // Use closure to preserve element reference
      (function(el) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Interactive element clicked');
          showAuthModal();
          return false;
        });
      })(element);
    }
  }
  
  function setupFormHandlers() {
    // Handle form submissions
    var forms = document.querySelectorAll('form');
    console.log('Found', forms.length, 'forms');
    
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      
      // Add unique ID to the form
      form.setAttribute('data-form-id', 'form-' + i);
      
      // Use closure to preserve form reference
      (function(f) {
        f.addEventListener('submit', function(e) {
          e.preventDefault();
          console.log('Form submitted:', f.getAttribute('data-form-id'));
          showAuthModal();
          return false;
        });
      })(form);
    }
  }
  
  function addSendButton() {
    // Add a send button to message forms that don't have one
    var messageForms = document.querySelectorAll('form');
    
    for (var i = 0; i < messageForms.length; i++) {
      var form = messageForms[i];
      
      if (!form.querySelector('button[type="submit"]')) {
        var inputField = form.querySelector('.input-field, input[type="text"]');
        
        if (inputField) {
          console.log('Adding send button to form');
          var button = document.createElement('button');
          button.type = 'submit';
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
          
          // Add unique ID to the button
          button.setAttribute('data-button-id', 'send-button-' + i);
          
          inputField.insertAdjacentElement('afterend', button);
        }
      }
    }
  }
  
  // Auth modal function
  function showAuthModal() {
    // Remove existing modal if any
    var existingModal = document.getElementById('auth-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    console.log('Showing auth modal');
    
    // Create modal container
    var modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    
    // Create modal content
    var modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#36393f';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.maxWidth = '400px';
    modalContent.style.width = '100%';
    
    // Create title
    var title = document.createElement('h2');
    title.textContent = 'Sign In Required';
    title.style.color = 'white';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '16px';
    
    // Create message
    var message = document.createElement('p');
    message.textContent = 'You need to sign in to interact with the chat.';
    message.style.color = '#dcddde';
    message.style.marginBottom = '24px';
    
    // Create button container
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '12px';
    
    // Create cancel button
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.backgroundColor = '#4f545c';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    
    // Create sign in button
    var signInButton = document.createElement('button');
    signInButton.textContent = 'Sign In';
    signInButton.style.padding = '8px 16px';
    signInButton.style.backgroundColor = '#5865f2';
    signInButton.style.color = 'white';
    signInButton.style.border = 'none';
    signInButton.style.borderRadius = '4px';
    signInButton.style.cursor = 'pointer';
    
    // Add event listeners
    cancelButton.addEventListener('click', function() {
      modal.remove();
    });
    
    signInButton.addEventListener('click', function() {
      window.location.href = '/auth/signin';
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Build and append the modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(signInButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  
  // Initialize function to run everything
  function initialize() {
    setupClickHandlers();
    setupFormHandlers();
    addSendButton();
    console.log('CSP-compliant fix initialized');
  }
  
  // Run initialize when DOM content is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded
    initialize();
  }
  
  // Add a listener for the window load event (for Next.js)
  window.addEventListener('load', initialize);
  
  // Also run after a small delay to ensure everything is loaded
  setTimeout(initialize, 1000);
})(); 