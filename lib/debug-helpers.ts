'use client'

export function setupDebugListeners() {
  console.log('Setting up debug listeners');
  
  // Click event debugging
  document.addEventListener('click', (e) => {
    console.log('Element clicked:', e.target);
    console.log('Element ID:', e.target.id || 'No ID');
    console.log('Element classes:', e.target.className || 'No classes');
    console.log('Element tag:', e.target.tagName);
    
    // Highlight clicked element
    const originalBg = e.target.style.backgroundColor;
    const originalOutline = e.target.style.outline;
    e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    e.target.style.outline = '2px solid red';
    setTimeout(() => {
      e.target.style.backgroundColor = originalBg;
      e.target.style.outline = originalOutline;
    }, 500);
  });
  
  // Log all form submissions
  document.addEventListener('submit', (e) => {
    console.log('Form submitted:', e.target);
    console.log('Form ID:', e.target.id || 'No ID');
    console.log('Form fields:', getFormData(e.target));
  });
  
  // Monitor DOM mutations for dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('DOM nodes added:', mutation.addedNodes);
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Add helper method to global window object
  if (typeof window !== 'undefined') {
    window.debugElement = (selector) => {
      const el = document.querySelector(selector);
      if (el) {
        console.log('Debug element:', el);
        console.log('Classes:', el.className);
        console.log('Attributes:', Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`));
        console.log('Styles:', el.style);
        console.log('Computed styles:', window.getComputedStyle(el));
        
        // Highlight the element
        const originalOutline = el.style.outline;
        el.style.outline = '2px solid blue';
        setTimeout(() => {
          el.style.outline = originalOutline;
        }, 3000);
        
        return el;
      } else {
        console.warn('No element found matching selector:', selector);
        return null;
      }
    };
    
    window.listClickableElements = () => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const anchors = Array.from(document.querySelectorAll('a'));
      const clickables = Array.from(document.querySelectorAll('[role="button"], .channel, .reaction, .input-action, .header-action'));
      
      console.log('Buttons:', buttons);
      console.log('Links:', anchors);
      console.log('Other clickables:', clickables);
      
      return { buttons, anchors, clickables };
    };
    
    console.log('Debug helpers added to window. Try window.debugElement(".channel") or window.listClickableElements()');
  }
  
  console.log('Debug listeners setup complete');
}

// Helper to extract form data
function getFormData(form: HTMLFormElement) {
  const formData = new FormData(form);
  const data: Record<string, string> = {};
  
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });
  
  return data;
}

// Add this to your page component with:
// useEffect(() => { setupDebugListeners(); }, []); 