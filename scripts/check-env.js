const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('Checking environment variables...');

if (!envExists) {
  console.log('❌ .env.local file not found.');
  console.log('Please create a .env.local file with the following variables:');
  console.log(`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
  `);
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Check for required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
];

const missingVars = [];

for (const varName of requiredVars) {
  const varExists = envLines.some(line => line.startsWith(`${varName}=`));
  if (!varExists) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  for (const varName of missingVars) {
    console.log(`  - ${varName}`);
  }
  console.log('\nPlease add these variables to your .env.local file.');
  process.exit(1);
}

console.log('✅ All required environment variables are set.');
console.log('\nEnvironment check complete!'); 