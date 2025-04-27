const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const PRODUCTION_URL = 'https://turf-ruddy.vercel.app';
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
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    client.get(fullUrl, (res) => {
      console.log(`${fullUrl} - ${res.statusCode}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`Error checking ${fullUrl}:`, err.message);
      resolve(false);
    });
  });
}

async function checkDeployment() {
  console.log('Checking deployment...');
  
  // Check production URLs
  console.log('\nChecking production URLs:');
  for (const route of routes) {
    await checkUrl(PRODUCTION_URL, route);
  }
  
  // Check local URLs
  console.log('\nChecking local URLs:');
  for (const route of routes) {
    await checkUrl(LOCAL_URL, route);
  }
  
  // Check environment variables
  console.log('\nChecking environment variables:');
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
  ];
  
  for (const envVar of envVars) {
    const value = process.env[envVar];
    console.log(`${envVar}: ${value ? '✅ Set' : '❌ Not set'}`);
  }
  
  // Check Supabase configuration
  console.log('\nChecking Supabase configuration:');
  try {
    const { stdout } = execSync('npx supabase status');
    console.log(stdout);
  } catch (error) {
    console.error('Error checking Supabase configuration:', error.message);
    console.log('Skipping Supabase check. Make sure Supabase is properly configured.');
  }
  
  console.log('\nDeployment check complete!');
}

checkDeployment(); 