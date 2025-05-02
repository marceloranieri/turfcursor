// csp-config.js
export const cspConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'", 
      "'unsafe-eval'", 
      "'unsafe-inline'", 
      "https://*.supabase.co", 
      "https://*.vercel.app",
      "https://app.turfyeah.com",
      "https://accounts.google.com",
      "https://apis.google.com",
      "https://connect.facebook.net"
    ],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': [
      "'self'", 
      "data:", 
      "blob:", 
      "https://*.supabase.co", 
      "https://avatars.githubusercontent.com", 
      "https://lh3.googleusercontent.com", 
      "https://media.giphy.com",
      "https://graph.facebook.com",
      "https://*.fbcdn.net"
    ],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'connect-src': [
      "'self'", 
      "https://*.supabase.co", 
      "wss://*.supabase.co", 
      "https://api.giphy.com", 
      "https://app.turfyeah.com",
      "https://*.facebook.com",
      "https://*.facebook.net",
      "https://accounts.google.com"
    ],
    'frame-src': [
      "'self'", 
      "https://*.supabase.co", 
      "https://accounts.google.com",
      "https://www.facebook.com"
    ],
    'media-src': ["'self'", "https://media.giphy.com"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"]
  }
};

// Helper to convert config to CSP string
export function cspToString(config) {
  return Object.entries(config.directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

// Temporary test configuration for debugging
export const testCspConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "*"],
    'style-src': ["'self'", "'unsafe-inline'", "*"],
    'img-src': ["'self'", "data:", "blob:", "*"],
    'font-src': ["'self'", "*"],
    'connect-src': ["'self'", "*"],
    'frame-src': ["'self'", "*"],
    'media-src': ["'self'", "*"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"]
  }
}; 