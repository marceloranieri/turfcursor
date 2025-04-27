# Turf App Deployment Guide

This guide will help you deploy the Turf app to Vercel.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Vercel CLI (optional, but recommended)
- Supabase account with OAuth providers configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: GitHub OAuth
# NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
# NEXT_PUBLIC_GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Supabase OAuth Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable and configure the following providers:
   - Google
   - GitHub (optional)
   - Facebook (disabled for now)
4. Set the redirect URLs:
   - https://turf-ruddy.vercel.app/auth/callback
   - http://localhost:3000/auth/callback

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Using the Deployment Script

1. Make sure you have the Vercel CLI installed and are logged in:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. Run the deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

### Option 2: Manual Deployment

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod --force
   ```

## Verifying Deployment

1. Check if all routes are accessible:
   ```bash
   node scripts/check-deployment.js
   ```

2. Test the authentication flow:
   - Sign up with email/password
   - Sign in with Google
   - Reset password
   - Verify email

## Troubleshooting

### 404 Errors

If you encounter 404 errors, check the following:

1. Make sure all routes are included in the `publicRoutes` array in `middleware.ts`
2. Verify that the pages exist in the `app` directory
3. Check if the build process is completing successfully

### OAuth Issues

If OAuth is not working, check the following:

1. Verify that the OAuth providers are correctly configured in Supabase
2. Check that the redirect URLs are correctly set in both Supabase and Vercel
3. Ensure that the environment variables are correctly set in Vercel

### Deployment Issues

If deployment fails, check the following:

1. Verify that all environment variables are set in Vercel
2. Check the build logs for errors
3. Make sure the app builds successfully locally before deploying

## Support

If you encounter any issues, please open an issue in the GitHub repository or contact the development team. 