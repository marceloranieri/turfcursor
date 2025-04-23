# Daily Topic Rotation Edge Function

This Edge Function is responsible for refreshing the daily debate topics in the Turf application.

## Function Operation

Every time this function is called, it:

1. Retrieves topics that haven't been used yet (by checking the topic_history table)
2. Randomly selects 5 new topics to be active for the day
3. Updates the database to mark these topics as active
4. Records the usage in the topic history

If all topics have been used, it will clear the history and start a new rotation cycle.

## Configuration

This function requires the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## Authentication

The function requires an authorization bearer token that matches the Supabase service role key.

## Calling the Function

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/refreshTopics \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json"
```

## Scheduling

This function is designed to be called once per day, typically at midnight UTC, to refresh the topics for the next 24 hours.

It's recommended to set up an external scheduler such as GitHub Actions, EasyCron, or another cron service to trigger this function automatically. 