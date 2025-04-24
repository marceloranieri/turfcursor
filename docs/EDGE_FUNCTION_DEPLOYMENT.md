# Deploying the Daily Topics Edge Function

This guide provides step-by-step instructions for deploying the `refreshTopics` Edge Function to Supabase, which handles the daily rotation of debate topics.

## Prerequisites

Before you begin, make sure you have:

1. A Supabase project set up
2. Supabase CLI installed locally
3. Access to your project's service role key
4. The database schema already applied

## Step 1: Set Up Supabase CLI

If you haven't already installed the Supabase CLI, do so with:

```bash
npm install -g supabase
```

Then login to your Supabase account:

```bash
supabase login
```

## Step 2: Link Your Project

Navigate to your project directory and link it to your Supabase project:

```bash
cd turf-app
supabase link --project-ref your-project-ref
```

You can find your project reference in the Supabase dashboard URL.

## Step 3: Prepare the Edge Function

1. Create a new directory for the function (if it doesn't exist already):

```bash
mkdir -p supabase/functions/refreshTopics
```

2. Copy the Edge Function code from `lib/supabase/edge-functions/refreshTopics.ts` to `supabase/functions/refreshTopics/index.ts`:

```bash
cp lib/supabase/edge-functions/refreshTopics.ts supabase/functions/refreshTopics/index.ts
```

## Step 4: Deploy the Edge Function

Deploy the function to Supabase:

```bash
supabase functions deploy refreshTopics --no-verify-jwt
```

The `--no-verify-jwt` flag allows the function to be called without a valid JWT, but we'll still require an API key via the `Authorization` header.

## Step 5: Test the Function

Test the function with:

```bash
curl -X POST https://<your-project-ref>.supabase.co/functions/v1/refreshTopics \
  -H "Authorization: Bearer <your-service-role-key>" \
  -H "Content-Type: application/json"
```

You should receive a successful response if everything is set up correctly.

## Step 6: Set Up Scheduled Execution

Since Supabase doesn't have a built-in scheduler, you'll need to set up an external service to trigger the function daily.

### Using GitHub Actions

1. Create a new file `.github/workflows/refresh-topics.yml` in your repository:

```yaml
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
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            https://<your-project-ref>.supabase.co/functions/v1/refreshTopics
```

2. Add your Supabase service role key as a repository secret named `SUPABASE_SERVICE_ROLE_KEY`.

### Using EasyCron

1. Create an account at [EasyCron](https://www.easycron.com/)
2. Set up a new cron job with:
   - URL: `https://<your-project-ref>.supabase.co/functions/v1/refreshTopics`
   - Method: POST
   - Headers: `Authorization: Bearer <your-service-role-key>`
   - Schedule: `0 0 * * *` (daily at midnight UTC)

## Step 7: Monitoring

To monitor the function's execution:

1. Go to the Supabase dashboard
2. Navigate to Edge Functions
3. Select the `refreshTopics` function
4. View the logs to ensure it's running correctly

You can also monitor the active topics in your database to verify the rotation is working as expected.

## Security Considerations

- Keep your service role key secure - never expose it in client-side code
- Consider using a dedicated API key for this function instead of the service role key
- Set up IP restrictions if possible to limit who can call the function

## Troubleshooting

If you encounter issues:

1. **Function returning errors**: Check the function logs in the Supabase dashboard
2. **Topics not rotating**: Verify the database schema is correct and you have enough topics in the pool
3. **Permissions errors**: Ensure your service role key has the necessary permissions
4. **CORS issues**: Verify your CORS configuration if calling from a browser

For persistent issues, check the Supabase documentation or reach out to their support team. 