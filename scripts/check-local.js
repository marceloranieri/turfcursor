const http = require('http');

const LOCAL_URL = 'http://localhost:3000';
const routes = [
  '/',
  '/auth/login',
  '/auth/signin',
  '/auth/signup',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

function checkUrl(url, route) {
  return new Promise((resolve) => {
    const fullUrl = `${url}${route}`;
    
    http.get(fullUrl, (res) => {
      console.log(`${fullUrl} - ${res.statusCode}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`Error checking ${fullUrl}:`, err.message);
      console.log('Make sure the development server is running with "npm run dev"');
      resolve(false);
    });
  });
}

async function checkLocal() {
  console.log('Checking local development server...');
  
  // Check local URLs
  console.log('\nChecking local URLs:');
  for (const route of routes) {
    await checkUrl(LOCAL_URL, route);
  }
  
  console.log('\nLocal check complete!');
  console.log('If you see errors, make sure the development server is running with "npm run dev"');
}

checkLocal(); 