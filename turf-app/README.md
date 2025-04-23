# Turf - Daily Debates

A modern debate platform where users can engage in thoughtful discussions on daily topics. Built with Next.js, Tailwind CSS, and Supabase.

![Turf App Screenshot](public/screenshots/turf-app-preview.png)

## Features

- Real-time chat with channels ("Circles") for different debate topics
- User authentication and profiles
- Message reactions with emoji picker
- Reply threading and conversation flows
- Harmony points system for reputation
- Genius Awards to recognize valuable contributions
- Pinned messages for highly engaging content
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 16.14.0 or later
- npm or yarn
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase project, go to the SQL Editor and run the contents of `lib/database/supabaseRpc.sql` 
3. Then run the contents of `supabase_schema.sql` to set up the database schema

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
│   ├── auth/               # Authentication pages
│   ├── chat/               # Chat interface
│   ├── profile/            # User profile
│   ├── settings/           # User settings
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── AuthModal.tsx       # Authentication modal
│   ├── ChatInput.tsx       # Message input
│   ├── ChatLayout.tsx      # Chat layout
│   ├── Message.tsx         # Message component
│   ├── NotificationCenter.tsx # Notifications
│   └── ReactionPicker.tsx  # Emoji reactions
├── lib/                    # Utility functions
│   ├── auth/               # Authentication utilities
│   ├── database/           # Database helpers
│   └── supabase/           # Supabase client
├── pages/                  # Next.js Pages
│   └── api/                # API routes
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Deployment

### Deploying to Vercel

1. Connect your GitHub repository to Vercel
2. Add the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Deploy the project

### Deploying to Netlify

1. Connect your GitHub repository to Netlify
2. Add the environment variables in your Netlify project settings
3. Set the build command to `npm run build` and publish directory to `out`
4. Deploy the project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
