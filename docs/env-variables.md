# Environment Variables

This document lists the environment variables required for the Turf application.

## Required Environment Variables

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project

## Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to the "Settings" tab
3. Click on "Environment Variables"
4. Add each of the required environment variables
5. Click "Save" to apply the changes

## Local Development

For local development, create a `.env.local` file in the root of the project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-url` and `your-supabase-anon-key` with your actual Supabase credentials. 