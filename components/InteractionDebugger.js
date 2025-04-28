'use client';

import { useEffect, useState } from 'react';

export default function InteractionDebugger() {
  const [clickEvents, setClickEvents] = useState([]);
  const [formEvents, setFormEvents] = useState([]);
  const [debugMode, setDebugMode] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Debug mode toggle - Press Ctrl+Shift+D to toggle
    const toggleDebug = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', toggleDebug);

    // Fix all buttons and clickable elements
    const fixClickableElements = () => {
      const clickables = document.querySelectorAll('button, .button, a, [role="button"], .channel, input[type="submit"]');
      
      clickables.forEach(element => {
        if (!element.dataset.fixApplied) {
          // Add visual feedback
          element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.98)';
          });
          
          element.addEventListener('mouseup', () => {
            element.style.transform = '';
          });
          
          // Ensure click event propagation
          element.addEventListener('click', (e) => {
            // Log the click in debug mode
            if (debugMode) {
              setClickEvents(prev => [
                ...prev, 
                {
                  target: `${element.tagName} ${element.className}`,
                  text: element.textContent || element.value,
                  time: new Date().toLocaleTimeString()
                }
              ].slice(-10));
            }
            
            // Make sure the element is visually clickable
            if (getComputedStyle(element).cursor !== 'pointer') {
              element.style.cursor = 'pointer';
            }
            
            // For links without href that should be router links
            if (element.tagName === 'A' && !element.getAttribute('href')) {
              const route = element.dataset.route;
              if (route) {
                window.location.href = route;
              }
            }
          });
          
          element.dataset.fixApplied = 'true';
        }
      });
    };

    // Fix form submissions
    const fixFormSubmissions = () => {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        if (!form.dataset.fixApplied) {
          form.addEventListener('submit', (e) => {
            // Log form submission in debug mode
            if (debugMode) {
              setFormEvents(prev => [
                ...prev,
                {
                  formId: form.id || 'unnamed-form',
                  elements: Array.from(form.elements).length,
                  time: new Date().toLocaleTimeString()
                }
              ].slice(-10));
            }
            
            // If form doesn't have a submit button, add one
            if (!form.querySelector('button[type="submit"], input[type="submit"]')) {
              const submitButton = document.createElement('button');
              submitButton.type = 'submit';
              submitButton.style.display = 'none';
              form.appendChild(submitButton);
            }
            
            // Ensure form inputs can trigger submission on Enter
            const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
            textInputs.forEach(input => {
              input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                  if (submitBtn) submitBtn.click();
                }
              });
            });
          });
          
          form.dataset.fixApplied = 'true';
        }
      });
    };

    // Fix potential z-index issues
    const fixZIndexIssues = () => {
      // Set z-index for clickable elements
      document.querySelectorAll('button, .button, a, [role="button"], .channel, input[type="submit"]')
        .forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.position === 'static') {
            el.style.position = 'relative';
          }
          
          if (!el.style.zIndex) {
            el.style.zIndex = '1';
          }
        });
      
      // Ensure modals have high z-index
      document.querySelectorAll('.modal, .modal-overlay')
        .forEach(el => {
          el.style.zIndex = '100';
        });
    };

    // Detect event blocking issues
    const detectEventBlockingIssues = () => {
      const newIssues = [];
      
      // Check for overlapping elements that might block clicks
      document.querySelectorAll('button, .button, a, [role="button"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) { // Only visible elements
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Get element at this point that isn't the element or its descendant
          const elementAtPoint = document.elementFromPoint(centerX, centerY);
          
          if (elementAtPoint && !el.contains(elementAtPoint) && !elementAtPoint.contains(el)) {
            newIssues.push({
              type: 'blocked-element',
              element: `${el.tagName.toLowerCase()} ${el.className}`,
              blockedBy: `${elementAtPoint.tagName.toLowerCase()} ${elementAtPoint.className}`,
              time: new Date().toLocaleTimeString()
            });
          }
        }
      });
      
      if (newIssues.length > 0) {
        setIssues(prev => [...prev, ...newIssues].slice(-10));
      }
    };

    // Run fixes immediately and set up mutation observer to catch dynamically added elements
    const applyFixes = () => {
      fixClickableElements();
      fixFormSubmissions();
      fixZIndexIssues();
      
      if (debugMode) {
        detectEventBlockingIssues();
      }
    };
    
    applyFixes();
    
    // Watch for DOM changes to fix new elements
    const observer = new MutationObserver((mutations) => {
      let shouldApplyFixes = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldApplyFixes = true;
        }
      });
      
      if (shouldApplyFixes) {
        applyFixes();
      }
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    // Poll periodically as a fallback
    const interval = setInterval(applyFixes, 2000);
    
    // Clean up function
    return () => {
      window.removeEventListener('keydown', toggleDebug);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [debugMode]);

  // Render debug overlay if enabled
  if (debugMode) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '300px',
        maxHeight: '400px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        zIndex: 9999,
        overflow: 'auto',
        fontSize: '12px'
      }}>
        <h3>Interaction Debugger (Ctrl+Shift+D to toggle)</h3>
        
        {issues.length > 0 && (
          <div>
            <h4>Interaction Issues</h4>
            <ul>
              {issues.map((issue, i) => (
                <li key={i} style={{color: 'orange'}}>
                  {issue.time}: {issue.element} blocked by {issue.blockedBy}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <h4>Recent Clicks</h4>
          {clickEvents.length === 0 ? (
            <p>No click events recorded yet</p>
          ) : (
            <ul>
              {clickEvents.map((event, i) => (
                <li key={i}>
                  {event.time}: {event.target} - &quot;{event.text}&quot;
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h4>Form Submissions</h4>
          {formEvents.length === 0 ? (
            <p>No form submissions recorded yet</p>
          ) : (
            <ul>
              {formEvents.map((event, i) => (
                <li key={i}>
                  {event.time}: {event.formId} ({event.elements} elements)
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
  
  // When debug mode is off, return null (no visual component)
  return null;
} 