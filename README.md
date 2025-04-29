# Turf - Daily Debates

![Vercel Deployment](https://img.shields.io/github/deployments/marceloranieri/turf-app/production?label=Vercel%20Deployment&style=for-the-badge&logo=vercel)
![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/marceloranieri/turf-app/lighthouse.yml?branch=main&label=Lighthouse%20Audit&style=for-the-badge&logo=githubactions)
![Lighthouse Performance Badge](https://github.com/marceloranieri/turf-app/actions/workflows/lighthouse.yml/badge.svg)

A modern debate platform where users can engage in thoughtful discussions on daily topics. Built with ❤️ using Next.js, Tailwind CSS, and Supabase.

> 🚀 Production-ready with automated CI/CD, performance monitoring, and quality checks.

![Turf App Screenshot](public/screenshots/turf-app-preview.png)

## Features

- **Modern Discord-inspired UI**: Clean and intuitive interface following Discord's design patterns
- **Authentication**: Secure email/password authentication with user profiles
- **Real-time Chat**: Instant message updates using Supabase's real-time subscriptions
- **Topics System**: 
  - Organized discussions through categorized topics
  - Automated daily rotation with 5 new topics every 24 hours
- **Responsive Design**: Fully responsive layout that works on desktop and mobile
- **Dark Mode**: Built-in dark mode support for better user experience
- **Performance Monitoring**: Integrated Vercel Speed Insights for performance tracking
- User authentication and profiles
- Message reactions with emoji picker
- Reply threading and conversation flows
- Harmony points system for reputation
- Genius Awards to recognize valuable contributions
- Pinned messages for highly engaging content
- Mobile-responsive design
- Admin panel for topic management

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with Discord-inspired UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time subscriptions)
- **Deployment**: Vercel
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time
- **Edge Functions**: Supabase Functions
- **Automation**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 16.14.0 or later
- npm or yarn
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase project, go to the SQL Editor and run the contents of `lib/database/supabaseRpc.sql` 
3. Then run the contents of `supabase_schema.sql` to set up the database schema
4. Finally, run the contents of `lib/database/migrations/daily_topics_schema.sql` to set up the daily topics system

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/turf-app.git
   cd turf-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the project root with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
turf-app/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panels
│   │   └── topics/         # Topic administration
│   │   └── api/            # API routes
│   ├── auth/               # Authentication pages
│   ├── chat/               # Chat interface
│   ├── profile/            # User profile
│   ├── settings/           # User settings
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── admin/              # Admin components
│   │   └── TopicAdmin.tsx  # Topic admin interface
│   ├── layout/             # Layout components
│   │   └── DiscordLayout.tsx # Discord-inspired layout
│   ├── ui/                 # UI components
│   │   ├── DiscordButton.tsx # Custom button component
│   │   ├── DiscordInput.tsx  # Custom input component
│   │   └── DiscordMessage.tsx # Message component
│   ├── AuthModal.tsx       # Authentication modal
│   ├── DailyTopics.tsx     # Daily topics display
│   ├── NotificationCenter.tsx # Notifications
│   └── ReactionPicker.tsx  # Emoji reactions
├── lib/                    # Utility functions
│   ├── auth/               # Authentication utilities
│   ├── database/           # Database helpers
│   │   └── migrations/     # Database migrations
│   ├── supabase/           # Supabase client
│   │   └── edge-functions/ # Supabase Edge Functions
│   └── topics/             # Topic management utilities
├── .github/                # GitHub Actions workflows
├── pages/                  # Next.js Pages
└── styles/                 # Global styles
```

## Daily Topics System

The Turf app features an automated system that rotates 5 unique debate topics every 24 hours:

- No topic repeats until all topics in the pool have been used
- Topics automatically expire after 24 hours
- Admin panel allows for managing topics and manually refreshing them
- Detailed documentation available in `docs/DAILY_TOPICS_SYSTEM.md`

### Deploying the Daily Topics System

1. Deploy the Edge Function for topic rotation:
   ```bash
   npx supabase functions deploy refreshTopics --no-verify-jwt
   ```

2. Set up a scheduled job to trigger the function daily (using GitHub Actions or a cron service)
   - Detailed setup instructions in `docs/EDGE_FUNCTION_DEPLOYMENT.md`

3. Add GitHub repository secrets for automated deployments:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_URL`

## Deployment

The application is configured for deployment on Vercel.

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Add the environment variables in your Vercel project settings
3. Deploy! Vercel will automatically detect the Next.js configuration and deploy appropriately

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GIPHY_API_KEY`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Updated on Thu Apr 24 16:15:04 -03 2025
# Fresh deployment attempt - Thu Apr 24 16:17:16 -03 2025
// Test comment
