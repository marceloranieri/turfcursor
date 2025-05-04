// csp-config.js
const cspConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'", 
      "'unsafe-eval'", 
      "'unsafe-inline'", 
      "https://*.supabase.co",
      "https://*.supabase.in",
      "https://*.vercel.app",
      "https://app.turfyeah.com",
      "https://vercel.live",
      "https://accounts.google.com",
      "https://apis.google.com",
      "https://connect.facebook.net",
      "https://www.facebook.com",
      "https://www.google.com",
      "https://www.gstatic.com"
    ],
    'style-src': [
      "'self'", 
      "'unsafe-inline'", 
      "https://fonts.googleapis.com",
      "https://*.supabase.co"
    ],
    'img-src': [
      "'self'", 
      "data:", 
      "blob:", 
      "https://*.supabase.co",
      "https://*.supabase.in", 
      "https://avatars.githubusercontent.com", 
      "https://lh3.googleusercontent.com", 
      "https://media.giphy.com",
      "https://graph.facebook.com",
      "https://*.fbcdn.net",
      "https://platform-lookaside.fbsbx.com",
      "https://www.facebook.com",
      "https://www.google.com",
      "https://accounts.google.com"
    ],
    'font-src': [
      "'self'", 
      "https://fonts.gstatic.com",
      "data:"
    ],
    'connect-src': [
      "'self'", 
      "https://*.supabase.co", 
      "wss://*.supabase.co",
      "https://*.supabase.in",
      "https://api.giphy.com", 
      "https://app.turfyeah.com",
      "https://*.facebook.com",
      "https://*.facebook.net",
      "https://accounts.google.com",
      "https://www.googleapis.com"
    ],
    'frame-src': [
      "'self'", 
      "https://*.supabase.co",
      "https://*.supabase.in", 
      "https://accounts.google.com",
      "https://www.facebook.com",
      "https://www.google.com"
    ],
    'media-src': ["'self'", "https://media.giphy.com"],
    'base-uri': ["'self'"],
    'form-action': [
      "'self'",
      "https://*.supabase.co",
      "https://accounts.google.com",
      "https://www.facebook.com"
    ],
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  }
};

function cspToString(config) {
  return Object.entries(config.directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

const testCspConfig = {
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
    'object-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  }
};

module.exports = {
  cspConfig,
  cspToString,
  testCspConfig
}; 