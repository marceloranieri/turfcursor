# Supabase Setup Guide for Turf App

## Apply Database Schema

You can apply the database schema from the `supabase_schema.sql` file in several ways:

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project: `csfdshydwdzexxosevml`
3. Go to the SQL Editor in the left sidebar
4. Create a "New Query"
5. Copy and paste the entire contents of `supabase_schema.sql` into the query editor
6. Click "Run" to execute the SQL statements

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase login
supabase db push -f supabase_schema.sql --db-url postgresql://postgres:your-password@db.csfdshydwdzexxosevml.supabase.co:5432/postgres
```

## Environment Variables

Make sure to set up your environment variables in a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://csfdshydwdzexxosevml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmRzaHlkd2R6ZXh4b3Nldm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNjY1MTUsImV4cCI6MjA2MDk0MjUxNX0.psZNkXCiyhIgHetnjF1NxwY40jYSZb3qlor78T-FPcg
```

## Database Schema Description

The schema creates the following tables:

1. **users**: Stores user information including harmony points and genius awards
2. **circles**: Represents discussion topics or groups
3. **messages**: Contains all user messages within circles
4. **reactions**: Stores user reactions to messages (emoji, GIFs, etc.)
5. **notifications**: User notifications for various events

The schema also includes:
- Row Level Security (RLS) policies for data protection
- Indexes for performance optimization
- Triggers for automatic harmony points updates and notification creation

## Testing the Connection

To verify your database connection is working, you can use the following code snippet:

```typescript
import { supabase } from '../lib/supabase/client';

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase!', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}
```

## Next Steps

After setting up your database:

1. Create authentication providers if needed
2. Set up storage buckets for avatars or other media
3. Consider configuring edge functions for server-side logic
4. Test your API endpoints using the Supabase dashboard 