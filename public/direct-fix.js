// Ultra-direct fix that avoids any external dependencies
(function() {
  console.log('Direct fix loaded');
  
  // Simple topic mapping
  var topicMap = {
    'Remote Work Debate': '1',
    'AI Ethics': '2',
    'Climate Solutions': '3',
    'Education Reform': '4',
    'Cryptocurrency Future': '5'
  };
  
  // Make all channels clickable
  function makeChannelsClickable() {
    var channels = document.querySelectorAll('.channel');
    console.log('Found', channels.length, 'channels');
    
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      channel.style.cursor = 'pointer';
      
      // Use closure to preserve the channel reference
      (function(ch) {
        ch.addEventListener('click', function(event) {
          // Mark the start time for Vercel Speed Insights
          const startTime = performance.now();
          
          var nameElement = ch.querySelector('.truncate');
          if (nameElement && nameElement.textContent) {
            var name = nameElement.textContent;
            var id = topicMap[name] || '1';
            console.log('Channel clicked:', name, '→', id);
            
            // Report this interaction to Vercel Speed Insights if available
            if (window.va) {
              try {
                window.va.track('Channel Click', {
                  name: name,
                  id: id,
                  element: 'channel'
                });
              } catch (err) {
                console.error('Error reporting to Vercel Analytics:', err);
              }
            }
            
            // Add a custom attribute for Vercel Speed Insights to track this interaction
            if (event.target) {
              event.target.setAttribute('data-vercel-speed-insights-id', 'channel-' + id);
              event.target.setAttribute('data-vercel-speed-insights-name', 'Channel: ' + name);
            }
            
            // Short timeout to ensure the event attribute is captured before navigation
            setTimeout(function() {
              window.location.href = '/chat/' + id;
            }, 10);
            
            // Mark the end time and report performance
            const endTime = performance.now();
            console.log('Channel click processing time:', (endTime - startTime).toFixed(2) + 'ms');
          }
        });
      })(channel);
    }
  }
  
  // Make reaction elements show auth modal
  function enableReactions() {
    var reactions = document.querySelectorAll('.reaction, .input-action, .header-action');
    console.log('Found', reactions.length, 'interactive elements');
    
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      reaction.style.cursor = 'pointer';
      
      // Add data attributes for Vercel Speed Insights
      reaction.setAttribute('data-vercel-speed-insights-id', 'interaction-' + i);
      reaction.setAttribute('data-vercel-speed-insights-name', 'Interaction Element');
      
      // Use closure to preserve the reaction reference
      (function(el, index) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Mark the start time
          const startTime = performance.now();
          
          console.log('Interactive element clicked');
          
          // Report to Vercel Analytics if available
          if (window.va) {
            try {
              window.va.track('Interaction', {
                type: 'reaction',
                index: index,
                element: el.classList.toString()
              });
            } catch (err) {
              console.error('Error reporting to Vercel Analytics:', err);
            }
          }
          
          showAuthModal();
          
          // Mark the end time
          const endTime = performance.now();
          console.log('Reaction click processing time:', (endTime - startTime).toFixed(2) + 'ms');
          
          return false;
        });
      })(reaction, i);
    }
  }
  
  // Add a submit button and enable the form
  function enableForm() {
    var form = document.querySelector('form');
    if (!form) return;
    
    console.log('Found message form');
    
    // Add data attributes for Vercel Speed Insights
    form.setAttribute('data-vercel-speed-insights-id', 'message-form');
    form.setAttribute('data-vercel-speed-insights-name', 'Message Form');
    
    // Add submit handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Mark the start time
      const startTime = performance.now();
      
      console.log('Form submitted');
      
      // Report to Vercel Analytics if available
      if (window.va) {
        try {
          window.va.track('Form Submission', {
            type: 'message',
            hasValue: !!form.querySelector('input')?.value
          });
        } catch (err) {
          console.error('Error reporting to Vercel Analytics:', err);
        }
      }
      
      showAuthModal();
      
      // Mark the end time
      const endTime = performance.now();
      console.log('Form submission processing time:', (endTime - startTime).toFixed(2) + 'ms');
      
      return false;
    });
    
    // Add send button if missing
    if (!form.querySelector('button[type="submit"]')) {
      var input = form.querySelector('.input-field');
      if (input) {
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
        
        // Add data attribute for Vercel Speed Insights
        button.setAttribute('data-vercel-speed-insights-id', 'send-button');
        button.setAttribute('data-vercel-speed-insights-name', 'Send Message Button');
        
        input.insertAdjacentElement('afterend', button);
        console.log('Added send button');
      }
    }
  }
  
  // Show a simple auth modal
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
    
    // Add data attributes for Vercel Speed Insights
    modal.setAttribute('data-vercel-speed-insights-id', 'auth-modal');
    modal.setAttribute('data-vercel-speed-insights-name', 'Authentication Modal');
    
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
    
    // Add data attributes for Vercel Speed Insights
    cancelButton.setAttribute('data-vercel-speed-insights-id', 'cancel-button');
    cancelButton.setAttribute('data-vercel-speed-insights-name', 'Cancel Auth Button');
    
    // Create sign in button
    var signInButton = document.createElement('button');
    signInButton.textContent = 'Sign In';
    signInButton.style.padding = '8px 16px';
    signInButton.style.backgroundColor = '#5865f2';
    signInButton.style.color = 'white';
    signInButton.style.border = 'none';
    signInButton.style.borderRadius = '4px';
    signInButton.style.cursor = 'pointer';
    
    // Add data attributes for Vercel Speed Insights
    signInButton.setAttribute('data-vercel-speed-insights-id', 'signin-button');
    signInButton.setAttribute('data-vercel-speed-insights-name', 'Sign In Button');
    
    // Add event listeners
    cancelButton.addEventListener('click', function(e) {
      // Mark the start time
      const startTime = performance.now();
      
      modal.remove();
      
      // Report to Vercel Analytics if available
      if (window.va) {
        try {
          window.va.track('Modal Action', {
            action: 'cancel'
          });
        } catch (err) {
          console.error('Error reporting to Vercel Analytics:', err);
        }
      }
      
      // Mark the end time
      const endTime = performance.now();
      console.log('Cancel button processing time:', (endTime - startTime).toFixed(2) + 'ms');
    });
    
    signInButton.addEventListener('click', function(e) {
      // Mark the start time
      const startTime = performance.now();
      
      // Report to Vercel Analytics if available
      if (window.va) {
        try {
          window.va.track('Modal Action', {
            action: 'signin'
          });
        } catch (err) {
          console.error('Error reporting to Vercel Analytics:', err);
        }
      }
      
      // Allow a small delay for analytics to be sent
      setTimeout(function() {
        window.location.href = '/auth/signin';
      }, 10);
      
      // Mark the end time
      const endTime = performance.now();
      console.log('Sign in button processing time:', (endTime - startTime).toFixed(2) + 'ms');
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
  
  // Initialize when DOM is ready
  function initialize() {
    console.log('Initializing direct fix');
    
    // Check if we need to add support for Vercel's Web Vitals
    if (!window.va && typeof window !== 'undefined') {
      window.va = function() {
        (window.va.q = window.va.q || []).push(arguments);
      };
      console.log('Added Vercel Analytics shim');
    }
    
    makeChannelsClickable();
    enableReactions();
    enableForm();
    
    console.log('Direct fix initialized');
    
    // Add annotation for the Vercel Speed Insights to mark this as a successful load
    if (document.body) {
      document.body.setAttribute('data-vercel-speed-insights-page-status', 'loaded');
    }
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded
    initialize();
  }
  
  // Also run after window load
  window.addEventListener('load', initialize);
  
  // Run again after delay to ensure everything is loaded
  setTimeout(initialize, 1000);
  setTimeout(initialize, 3000);
})(); 