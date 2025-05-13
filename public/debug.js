// Add this script to your HTML by adding the following to your <head>:
// <script src="/debug.js"></script>

(function() {
  console.log('Debug script loaded');
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, adding debug handlers');
    
    // Helper function to add click diagnostics
    function addClickDiagnostics(selector, name) {
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} ${name} elements`);
      
      elements.forEach((el, i) => {
        el.setAttribute('data-debug-id', `${name}-${i}`);
        
        // Add a visible highlight on hover to see boundaries
        el.addEventListener('mouseenter', function() {
          this.style.outline = '2px solid rgba(255, 0, 0, 0.5)';
          document.body.style.cursor = 'pointer';
        });
        
        el.addEventListener('mouseleave', function() {
          this.style.outline = '';
          document.body.style.cursor = '';
        });
        
        // Add click logging
        el.addEventListener('click', function(e) {
          console.log(`${name} clicked:`, this.getAttribute('data-debug-id'));
          // Don't add stopPropagation to allow normal behavior
        });
      });
    }
    
    // Wait a bit for React to render everything
    setTimeout(() => {
      // Debug chat buttons
      addClickDiagnostics('button', 'button');
      addClickDiagnostics('.channel', 'channel');
      addClickDiagnostics('.member-item', 'member');
      addClickDiagnostics('.reaction', 'reaction');
      addClickDiagnostics('.message-actions button', 'message-action');
      addClickDiagnostics('.input-action', 'input-action');
      
      // Debug forms
      const forms = document.querySelectorAll('form');
      forms.forEach((form, i) => {
        form.setAttribute('data-debug-id', `form-${i}`);
        form.addEventListener('submit', function(e) {
          console.log('Form submitted:', this.getAttribute('data-debug-id'));
          // Don't prevent default to allow normal form submission
        });
      });
      
      console.log('Debug handlers added');
      
      // Alert the user that debug mode is active
      const debugNotice = document.createElement('div');
      debugNotice.style.position = 'fixed';
      debugNotice.style.bottom = '10px';
      debugNotice.style.right = '10px';
      debugNotice.style.backgroundColor = 'rgba(0,0,0,0.7)';
      debugNotice.style.color = 'white';
      debugNotice.style.padding = '5px 10px';
      debugNotice.style.borderRadius = '5px';
      debugNotice.style.fontSize = '12px';
      debugNotice.style.zIndex = '9999';
      debugNotice.textContent = 'Debug Mode: Check browser console (F12)';
      document.body.appendChild(debugNotice);
    }, 1000);
  });
})(); 