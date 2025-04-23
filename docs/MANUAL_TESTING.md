# Manual Testing Guide for Daily Topics System

This guide provides instructions for manually testing the Daily Topics System Edge Function after deployment.

## Prerequisites

- Deployed Edge Function
- Supabase service role key
- Supabase project URL
- Database tables created and seeded

## Testing the Edge Function Directly

### Using cURL

```bash
curl -X POST https://<your-project-ref>.functions.supabase.co/refreshTopics \
  -H "Authorization: Bearer <your-service-role-key>" \
  -H "Content-Type: application/json"
```

Replace `<your-project-ref>` with your Supabase project reference ID and `<your-service-role-key>` with your Supabase service role key.

### Using npm Script

If you've set up the npm script in package.json:

```bash
# Set environment variables first
export SUPABASE_URL=https://<your-project-ref>.functions.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Then run the script
npm run refresh:topics
```

## Verifying Results

After running the function, you should:

1. Check the response from the function call:
   ```json
   {
     "status": "success",
     "message": "Topics refreshed successfully",
     "topics": [...] // Array of 5 topics
   }
   ```

2. Verify in the Supabase dashboard:
   - Navigate to your Supabase project
   - Go to the Table Editor
   - Check the `topics` table
   - Filter by `active = true`
   - Should see exactly 5 active topics

3. Check the `topic_history` table:
   - New entries should be added for today's date
   - Should have 5 new records with today's date

## Testing in the Application

To test the integration with the frontend:

1. Start your local development server:
   ```bash
   npm run dev
   ```

2. Visit the homepage where the `DailyTopics` component is used
   - Should display the 5 active topics

3. If topics aren't showing, check:
   - Browser console for errors
   - Network requests to ensure topics are being fetched correctly
   - That your Supabase client configuration is correct

## Testing the GitHub Actions Workflow

To test the GitHub Actions workflow:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the "Daily Topic Refresh" workflow
4. Click "Run workflow" and select your branch
5. Monitor the workflow execution
6. Check the logs for any errors
7. Verify in Supabase that topics were refreshed

## Troubleshooting Common Issues

### Function Returns 401 Unauthorized

- Check that the Authorization header is correctly formatted: `Bearer <key>`
- Verify the service role key is correct and has not expired
- Ensure the key has the necessary permissions

### Function Returns 500 Error

- Check the function logs in Supabase dashboard
- Verify database tables exist and have the correct schema
- Ensure there are enough topics in the database

### No Topics are Marked as Active

- Check the function execution logs
- Verify the topics table has at least 5 records
- Check for database permission issues

### GitHub Actions Workflow Fails

- Check that all required secrets are set correctly
- Verify the Supabase project is online and accessible
- Check for any rate limiting issues

## Resetting the System

If you need to reset the system for testing:

```sql
-- Run in Supabase SQL Editor
-- Reset all topics to inactive
UPDATE topics SET active = false;

-- Clear the topic history
DELETE FROM topic_history;
```

This will allow you to start fresh with all topics available for selection. 