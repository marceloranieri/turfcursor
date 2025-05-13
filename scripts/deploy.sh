#!/bin/bash

# Exit on error
set -e

echo "🧹 Cleaning up..."
rm -rf .next
rm -rf node_modules

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking environment variables..."
node scripts/check-env.js || { echo "❌ Environment check failed"; exit 1; }

echo "🔄 Checking for circular dependencies..."
node scripts/check-cycles.js || { echo "⚠️ Circular dependencies found, but continuing..." }

echo "🔍 Running type check..."
npx tsc --noEmit || { echo "❌ Type check failed"; exit 1; }

echo "🔍 Running lint..."
npm run lint || { echo "❌ Lint failed"; exit 1; }

echo "🏗️ Building with simplified config..."
cp next.config.simple.js next.config.js
npm run build || { echo "❌ Build failed"; exit 1; }

echo "✅ Build successful! Ready for deployment."
echo "🚀 Run 'vercel deploy --prod' to deploy to production." 