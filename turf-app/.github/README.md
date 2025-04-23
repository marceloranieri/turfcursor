# GitHub Workflows for Turf App

This directory contains GitHub Actions workflows for automating tasks in the Turf application.

## Available Workflows

### 1. Deploy Supabase Edge Functions
**File:** `deploy-functions.yml`

This workflow automatically deploys Supabase Edge Functions whenever changes are pushed to the main branch and the function code is modified.

**Triggers:**
- Push to `main` branch with changes to `lib/supabase/edge-functions/**`
- Manual trigger via GitHub Actions UI

**Required Secrets:**
- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
- `SUPABASE_PROJECT_REF`: Your Supabase project reference ID

### 2. Daily Topic Refresh
**File:** `refresh-topics.yml`

This workflow runs daily at midnight UTC to refresh the active debate topics for the next 24 hours.

**Triggers:**
- Scheduled run at 00:00 UTC every day
- Manual trigger via GitHub Actions UI

**Required Secrets:**
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SUPABASE_URL`: Your Supabase project URL

## Setting Up Secrets

To set up the required secrets for these workflows:

1. Go to your GitHub repository
2. Click on "Settings"
3. Select "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each of the required secrets:
   - `SUPABASE_ACCESS_TOKEN`: Get this from your Supabase account settings
   - `SUPABASE_SERVICE_ROLE_KEY`: Find this in your Supabase project settings
   - `SUPABASE_PROJECT_REF`: The reference ID from your Supabase project URL
   - `SUPABASE_URL`: Your full Supabase project URL

Each workflow uses the `env` section to properly reference these secrets, which helps avoid context access issues in GitHub Actions.

## Manual Execution

To manually trigger a workflow:

1. Go to the "Actions" tab in your GitHub repository
2. Select the workflow you want to run
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Monitoring

You can monitor the execution of these workflows in the "Actions" tab of your GitHub repository.

## Troubleshooting

If you encounter issues with the workflows:

1. Check that all required secrets are properly set up
2. Verify the workflows have the correct permissions
3. Check the logs in the "Actions" tab to see detailed error messages
4. Make sure your Supabase project and tokens are valid 