#!/bin/bash

# Deploy Supabase Edge Function for Daily Topic Rotation

echo "Deploying refreshTopics Edge Function..."

# Check if project reference is provided
if [ -z "$1" ]; then
  echo "Error: Supabase project reference is required."
  echo "Usage: ./deploy-function.sh <project-ref>"
  exit 1
fi

PROJECT_REF=$1

# Make sure the directory structure exists
mkdir -p supabase/functions/refreshTopics

# Copy the Edge Function code
cp lib/supabase/edge-functions/refreshTopics.ts supabase/functions/refreshTopics/index.ts

# Deploy using npx to use the locally installed supabase CLI
npx supabase functions deploy refreshTopics --project-ref $PROJECT_REF --no-verify-jwt

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "✅ Edge Function deployed successfully!"
  echo "You can now set up a scheduled job to call this function daily."
  echo ""
  echo "Example GitHub Actions workflow is available at:"
  echo ".github/workflows/refresh-topics.yml"
else
  echo "❌ Deployment failed. Please check the error messages above."
fi 