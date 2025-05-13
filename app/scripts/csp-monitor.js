'use client';

export function initCSPMonitoring() {
  if (typeof window !== 'undefined') {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error('CSP Violation:', {
        'Blocked URI': e.blockedURI,
        'Violated Directive': e.violatedDirective,
        'Original Policy': e.originalPolicy,
        'Disposition': e.disposition,
        'Document URI': e.documentURI,
        'Effective Directive': e.effectiveDirective,
        'Status Code': e.statusCode,
      });

      // You can send this to your analytics or logging service
      const violationDetails = {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        disposition: e.disposition,
        documentURI: e.documentURI,
        effectiveDirective: e.effectiveDirective,
        statusCode: e.statusCode,
        timestamp: new Date().toISOString(),
      };

      // Log to console in a readable format
      console.table(violationDetails);
    });

    // Check current CSP
    fetch(window.location.href)
      .then(response => {
        const csp = response.headers.get('content-security-policy');
        console.log('Current CSP:', csp);
      })
      .catch(error => console.error('Error checking CSP:', error));
  }
} 