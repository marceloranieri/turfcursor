# Turf Daily Topics System

This document provides instructions for setting up and maintaining the daily topic rotation system for Turf, which automatically selects 5 unique debate topics each day.

## Overview

The Turf Daily Topics System:
- Automatically rotates 5 unique debate topics ("Circles") every 24 hours
- Ensures no topic repeats until all topics in the pool have been used
- Provides an admin interface for managing topics
- Includes real-time updates when topics change

## Database Schema

The system uses two main tables:

1. `topics` - Stores all available topics
2. `topic_history` - Tracks which topics have been used and when

## Setup Instructions

### 1. Database Migration

First, apply the database schema by running the SQL migration:

```bash
# Connect to your Supabase database
cd turf-app
npx supabase db push
```

Alternatively, you can manually execute the SQL in `lib/database/migrations/daily_topics_schema.sql` through the Supabase SQL Editor.

### 2. Edge Function Deployment

Deploy the Edge Function for topic rotation:

```bash
# Navigate to your project
cd turf-app

# Deploy the function to Supabase
npx supabase functions deploy refreshTopics

# Verify the function is deployed
npx supabase functions list
```

### 3. Environment Variables

Ensure the following environment variables are set in your Supabase project:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

### 4. Configure Scheduled Execution

Set up a scheduled job to run the edge function daily. You can use Supabase's built-in scheduler or an external service like EasyCron or GitHub Actions.

#### Option 1: Using EasyCron

1. Create an account at [EasyCron](https://www.easycron.com/)
2. Set up a new cron job with:
   - URL: `https://<your-project>.supabase.co/functions/v1/refreshTopics`
   - Method: POST
   - Headers: `Authorization: Bearer <your-admin-key>`
   - Schedule: `0 0 * * *` (daily at midnight UTC)

#### Option 2: Using GitHub Actions

Create a workflow file in your repository:

```yaml
# .github/workflows/refresh-topics.yml
name: Daily Topic Refresh

on:
  schedule:
    - cron: '0 0 * * *'  # Run at midnight UTC daily

jobs:
  refresh_topics:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger topic refresh
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.ADMIN_API_KEY }}" \
            https://<your-project>.supabase.co/functions/v1/refreshTopics
```

Make sure to add your admin API key as a repository secret.

## Frontend Integration

The system includes several components for integrating with the frontend:

1. `components/DailyTopics.tsx` - Displays the active topics
2. `components/admin/TopicAdmin.tsx` - Admin interface for topic management
3. `lib/topics/topicHelpers.ts` - Utility functions for working with topics

### Adding to Your App

To display daily topics on a page:

```tsx
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

## Admin Panel

The admin panel allows authorized users to:

- View active topics
- See topic statistics
- Manually refresh topics
- Add new topics
- View topic history

Access the admin panel at `/admin/topics`. Only users with `is_debate_maestro` set to true can access it.

## Security Considerations

- The Edge Function requires an admin API key for authentication
- The admin panel is restricted to users with the debate maestro role
- Service role keys should never be exposed to the client

## Troubleshooting

If topics are not refreshing automatically:

1. Check the Edge Function logs in the Supabase dashboard
2. Verify your scheduler is running correctly
3. Ensure you have at least 5 unused topics in the pool
4. Confirm the service role key has the necessary permissions

## Maintaining the Topic Pool

To keep the system running smoothly:

1. Regularly add new topics through the admin panel
2. Aim to maintain at least 20 topics in the pool
3. Use diverse categories to ensure variety

## Data Model

### Topic Object

```typescript
type Topic = {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  active: boolean;
};
```

### Topic History Entry

```typescript
type TopicHistory = {
  topic_id: string;
  used_on: string;
};
``` 