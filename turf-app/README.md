# Turf - Daily Debate Platform

Turf is a social chat platform designed to foster engaging debates on a single daily topic. Inspired by Discord's community dynamics and Ivy League debate clubs, Turf features a unified debate space with game-like mechanics to drive participation.

## Features

- **Focused Topics**: Single daily topics for concentrated, quality debates
- **Discord-Inspired UI**: Familiar chat interface for seamless user experience
- **Harmony Points**: Reward system for positive contributions
- **Wizard of Mods**: AI agent that keeps conversations flowing with perspective shifts
- **Pincredible**: Automatic highlighting of engaging content
- **Genius Awards**: User-driven recognition system
- **Mobile-Responsive**: Designed for both desktop and mobile experiences

## Game-Like Mechanics

- **Harmony Points**: Earn points for positive contributions and linked comments
- **Perspective Shifts**: AI-driven prompts during conversation lulls
- **Pincredible**: Most engaged message gets pinned every 5 minutes
- **Genius Award**: Limited daily awards users can give to exceptional contributions
- **Debate Maestro**: Status awarded to users who receive the most Genius Awards

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Supabase for database, authentication, and real-time subscriptions
- **AI Integration**: Botpress for the Wizard of Mods functionality
- **Styling**: Custom Discord-inspired UI components

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/turf-app.git
   cd turf-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_GIPHY_API_KEY=your_giphy_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router structure
  - `/auth`: Authentication pages
  - `/chat`: Chat interface
  - `/onboarding`: User onboarding flow
  - `/profile`: User profile management
  - `/settings`: Application settings
- `/components`: Reusable React components
- `/lib`: Utility functions and Supabase client
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
