const https = require('https');

const PRODUCTION_URL = 'https://turf-ruddy.vercel.app';
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
    
    https.get(fullUrl, (res) => {
      console.log(`${fullUrl} - ${res.statusCode}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`Error checking ${fullUrl}:`, err.message);
      resolve(false);
    });
  });
}

async function checkProduction() {
  console.log('Checking production deployment...');
  
  // Check production URLs
  console.log('\nChecking production URLs:');
  for (const route of routes) {
    await checkUrl(PRODUCTION_URL, route);
  }
  
  console.log('\nProduction check complete!');
  console.log('If you see errors, make sure the app is deployed to Vercel.');
}

checkProduction(); 