#!/usr/bin/env node

/**
 * This script checks for required environment variables
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
];

// Optional but recommended environment variables
const recommendedEnvVars = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'NEXT_PUBLIC_GITHUB_APP_URL',
];

console.log('🔍 Checking environment variables...');

// Load .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded .env file');
} else {
  console.log('⚠️ No .env file found');
}

// Check required environment variables
const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingRequired.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}

// Check recommended environment variables
const missingRecommended = recommendedEnvVars.filter(varName => !process.env[varName]);
if (missingRecommended.length > 0) {
  console.log('⚠️ Missing recommended environment variables:');
  missingRecommended.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('   These are not required but may affect functionality');
} else {
  console.log('✅ All recommended environment variables are set');
}

console.log('\n✅ Environment check complete'); 