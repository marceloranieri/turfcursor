# Turf Daily Topics System Deployment Guide

This guide provides step-by-step instructions for deploying and maintaining the Turf Daily Topics System.

## Prerequisites

- Supabase account and project
- GitHub repository for your Turf app
- Node.js and npm installed

## Step 1: Set Up Database Tables

First, apply the database schema by running the SQL migration:

```bash
# Connect to your Supabase project's SQL Editor
# Copy and paste the contents of this file:
lib/database/migrations/daily_topics_schema.sql
```

This will create:
- The `topics` table with 20 sample debate topics
- The `topic_history` table to track usage
- Necessary indexes and constraints

## Step 2: Deploy the Edge Function

### Option A: Using npm scripts

1. Set the required environment variables:

```bash
# Create a .env file with these variables (don't commit to git)
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
SUPABASE_PROJECT_REF=your_project_reference_id
```

2. Deploy the function:

```bash
npm run deploy:function
```

### Option B: Manual Deployment

1. Prepare the function directory:

```bash
mkdir -p supabase/functions/refreshTopics
cp lib/supabase/edge-functions/refreshTopics.ts supabase/functions/refreshTopics/index.ts
```

2. Deploy using Supabase CLI:

```bash
npx supabase functions deploy refreshTopics --project-ref your-project-ref --no-verify-jwt
```

## Step 3: Set Up GitHub Actions for Automation

1. Ensure your GitHub repository has the following secrets:
   - `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `SUPABASE_PROJECT_REF`: Your Supabase project reference ID
   - `SUPABASE_URL`: Your Supabase project URL

2. The GitHub Actions workflows are already set up in the `.github/workflows` directory:
   - `refresh-topics.yml`: Runs daily at midnight UTC to refresh topics
   - `deploy-functions.yml`: Automatically deploys when Edge Function code changes

## Step 4: Verify the Deployment

1. Check if the function was deployed successfully:

```bash
npx supabase functions list --project-ref your-project-ref
```

2. Manually trigger the function to test it:

```bash
curl -X POST https://your-project-ref.functions.supabase.co/refreshTopics \
  -H "Authorization: Bearer your-service-role-key" \
  -H "Content-Type: application/json"
```

3. Check your Supabase database to verify 5 topics are now marked as active.

## Step 5: Integrate with Frontend

The DailyTopics component is already set up to fetch and display active topics:

```jsx
// Example usage in a page
import DailyTopics from '../components/DailyTopics';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Turf</h1>
      <DailyTopics />
    </div>
  );
}
```

## Troubleshooting

### Edge Function Not Deploying

- Check that your Supabase CLI is installed correctly
- Verify your authentication token is valid
- Ensure the function file path is correct

### Topics Not Refreshing

- Check the GitHub Actions workflow logs in your repository
- Verify your service role key has the necessary permissions
- Make sure you have at least 5 topics in the database

### Function Returns Error

- Check the function logs in Supabase dashboard
- Verify the database tables exist with the correct schema
- Ensure environment variables are set correctly

## Maintenance

### Adding New Topics

Use the admin panel at `/admin/topics` to add new topics to the pool.

### Monitoring the System

1. Check the active topics in the Supabase database
2. Monitor the GitHub Actions workflow runs in your repository
3. Review the Edge Function logs in the Supabase dashboard

## Security Considerations

- Keep your service role key secure and never expose it client-side
- Restrict access to the admin panel to authorized users only
- Consider using IP restrictions for the Edge Function if possible

## Production Checklist

- [x] Database tables created and seeded with topics
- [ ] Edge Function deployed successfully
- [ ] GitHub Actions workflow configured and tested
- [ ] Admin panel access restricted to authorized users
- [ ] Monitoring and alerts set up for failures
- [ ] Documentation shared with team members 