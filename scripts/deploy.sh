#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying Turf App to Vercel..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found. Creating a template file..."
  cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=https://csfdshydwdzexxosevml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmRzaHlkd2R6ZXh4b3Nldm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNjY1MTUsImV4cCI6MjA2MDk0MjUxNX0.psZNkXCiyhIgHetnjF1NxwY40jYSZb3qlor78T-FPcg
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
EOL
  echo "✅ Created .env.local template. Please update with your actual values."
  exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
  echo "❌ Not logged in to Vercel. Please run 'vercel login' first."
  exit 1
fi

# Build the app
echo "📦 Building the app..."
if ! npm run build; then
  echo "❌ Build failed. Please fix the errors and try again."
  exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if ! vercel --prod --force; then
  echo "❌ Deployment failed. Please check the error messages above."
  exit 1
fi

echo "✅ Deployment complete!"
echo "🌐 Your app is live at https://turf-ruddy.vercel.app" 