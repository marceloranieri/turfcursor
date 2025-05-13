-- Create github_events table
create table if not exists github_events (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null,
  payload jsonb not null,
  repository text,
  sender text,
  action text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table github_events enable row level security;

-- Allow read access to authenticated users
create policy "Allow read access to authenticated users"
  on github_events for select
  to authenticated
  using (true);

-- Allow insert access to service role (for webhook)
create policy "Allow insert access to service role"
  on github_events for insert
  to service_role
  with check (true); 