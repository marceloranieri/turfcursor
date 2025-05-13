// Interaction Timing Debug Script
(function() {
  console.log('Interaction Timing Debug script loaded');
  
  // Store original timing data
  const interactionTimings = [];
  
  // Create a global observer to capture all interactions
  function setupInteractionObserver() {
    const interactionEvents = ['click', 'input', 'change', 'submit', 'keydown', 'mousedown', 'touchstart'];
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        const timestamp = performance.now();
        const targetElement = e.target;
        const tagName = targetElement.tagName.toLowerCase();
        const className = targetElement.className;
        const id = targetElement.id;
        
        const interactionData = {
          type: eventType,
          timestamp: timestamp,
          element: {
            tag: tagName,
            class: className,
            id: id
          },
          path: getElementPath(targetElement)
        };
        
        interactionTimings.push(interactionData);
        console.log('Interaction detected:', interactionData);
        
        // Update the UI
        updateTimingDisplay();
      }, true); // Use capture phase to get events first
    });
    
    console.log('Interaction observer set up for events:', interactionEvents.join(', '));
  }
  
  // Get a simplified path to the element
  function getElementPath(element, maxDepth = 3) {
    const path = [];
    let current = element;
    let depth = 0;
    
    while (current && current !== document && depth < maxDepth) {
      let identifier = current.tagName.toLowerCase();
      if (current.id) {
        identifier += '#' + current.id;
      } else if (current.className) {
        const classes = String(current.className).split(' ');
        if (classes.length > 0 && classes[0]) {
          identifier += '.' + classes[0];
        }
      }
      
      path.unshift(identifier);
      current = current.parentElement;
      depth++;
    }
    
    return path.join(' > ');
  }
  
  // Create or update the timing display
  function updateTimingDisplay() {
    let timingPanel = document.getElementById('interaction-timing-debug-panel');
    
    if (!timingPanel) {
      // Create the panel if it doesn't exist
      timingPanel = document.createElement('div');
      timingPanel.id = 'interaction-timing-debug-panel';
      timingPanel.style.position = 'fixed';
      timingPanel.style.bottom = '20px';
      timingPanel.style.right = '20px';
      timingPanel.style.width = '300px';
      timingPanel.style.maxHeight = '400px';
      timingPanel.style.overflowY = 'auto';
      timingPanel.style.backgroundColor = '#2f3136';
      timingPanel.style.color = '#dcddde';
      timingPanel.style.padding = '10px';
      timingPanel.style.borderRadius = '8px';
      timingPanel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
      timingPanel.style.zIndex = '9999';
      timingPanel.style.fontSize = '12px';
      timingPanel.style.fontFamily = 'monospace';
      
      const header = document.createElement('div');
      header.textContent = 'Interaction Timing Debug';
      header.style.fontWeight = 'bold';
      header.style.marginBottom = '8px';
      header.style.borderBottom = '1px solid #45474e';
      header.style.paddingBottom = '4px';
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'X';
      closeButton.style.float = 'right';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = '#dcddde';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = function() {
        timingPanel.style.display = 'none';
      };
      
      const clearButton = document.createElement('button');
      clearButton.textContent = 'Clear';
      clearButton.style.float = 'right';
      clearButton.style.background = 'none';
      clearButton.style.border = 'none';
      clearButton.style.color = '#dcddde';
      clearButton.style.marginRight = '8px';
      clearButton.style.cursor = 'pointer';
      clearButton.onclick = function() {
        interactionTimings.length = 0;
        updateTimingDisplay();
      };
      
      header.appendChild(closeButton);
      header.appendChild(clearButton);
      timingPanel.appendChild(header);
      
      const content = document.createElement('div');
      content.id = 'interaction-timing-content';
      timingPanel.appendChild(content);
      
      document.body.appendChild(timingPanel);
    }
    
    // Update the content
    const contentDiv = document.getElementById('interaction-timing-content');
    contentDiv.innerHTML = '';
    
    if (interactionTimings.length === 0) {
      contentDiv.textContent = 'No interactions detected yet. Interact with the page to see timings.';
    } else {
      interactionTimings.slice(-10).forEach((timing, index) => {
        const entry = document.createElement('div');
        entry.style.marginBottom = '6px';
        entry.style.paddingBottom = '6px';
        entry.style.borderBottom = index < interactionTimings.length - 1 ? '1px solid #45474e' : 'none';
        
        const typeSpan = document.createElement('span');
        typeSpan.textContent = timing.type;
        typeSpan.style.color = '#5865f2';
        typeSpan.style.fontWeight = 'bold';
        
        const timeSpan = document.createElement('span');
        timeSpan.textContent = `${Math.round(timing.timestamp)}ms`;
        timeSpan.style.float = 'right';
        timeSpan.style.color = '#5de948';
        
        const elementInfo = document.createElement('div');
        elementInfo.textContent = timing.path;
        elementInfo.style.color = '#a3a6aa';
        elementInfo.style.fontSize = '10px';
        elementInfo.style.marginTop = '2px';
        
        entry.appendChild(typeSpan);
        entry.appendChild(timeSpan);
        entry.appendChild(elementInfo);
        
        contentDiv.appendChild(entry);
      });
    }
  }
  
  // Initialize
  function initialize() {
    console.log('Initializing interaction timing debug');
    setupInteractionObserver();
    updateTimingDisplay();
    
    // Check if vercel's interaction timing panel exists and add our own toggle button
    setTimeout(() => {
      const vercelPanel = document.querySelector('[data-testid="speed-insights-panel"]');
      if (vercelPanel) {
        console.log('Vercel speed insights panel found');
        
        // Add our own button to toggle our debug panel
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Custom Debug';
        toggleButton.style.background = '#5865f2';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.padding = '4px 8px';
        toggleButton.style.marginLeft = '8px';
        toggleButton.style.cursor = 'pointer';
        
        toggleButton.onclick = function() {
          const panel = document.getElementById('interaction-timing-debug-panel');
          if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }
        };
        
        vercelPanel.appendChild(toggleButton);
      }
    }, 1000);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded
    initialize();
  }
  
  // Also run after window load to be sure
  window.addEventListener('load', initialize);
  
  // Run again after delay to ensure everything is loaded
  setTimeout(initialize, 2000);
})(); 