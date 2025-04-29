#!/bin/bash

# Exit on any error
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to log messages
log() {
  local level=$1
  local message=$2
  local color=$NC
  
  case $level in
    "info") color=$GREEN ;;
    "warn") color=$YELLOW ;;
    "error") color=$RED ;;
  esac
  
  echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message${NC}"
}

# Check for required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  log "error" "Missing required environment variables"
  log "info" "Please ensure the following environment variables are set:"
  log "info" "- NEXT_PUBLIC_SUPABASE_URL"
  log "info" "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

# Display deployment information
log "info" "===== Starting Deployment Process ====="
log "info" "Node version: $(node -v)"
log "info" "NPM version: $(npm -v)"

# Install dependencies
log "info" "===== Installing Dependencies ====="
npm install --legacy-peer-deps

# Run linting
log "info" "===== Running Linter ====="
if ! npm run lint; then
  log "error" "Linting failed. Please fix the issues and try again."
  exit 1
fi

# Type checking
log "info" "===== Type Checking ====="
if ! npm run type-check; then
  log "error" "Type checking failed. Please fix the issues and try again."
  exit 1
fi

# Build the application
log "info" "===== Building Application ====="
if ! npm run build; then
  log "error" "Build failed. Please fix the issues and try again."
  exit 1
fi

# Deploy to Vercel
log "info" "===== Deploying to Vercel ====="
if ! vercel --prod; then
  log "error" "Deployment failed. Please check the error messages above."
  exit 1
fi

log "info" "===== Deployment Complete ====="
log "info" "Your application has been successfully deployed to Vercel." 