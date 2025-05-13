# Turf App

A modern web application for managing and tracking turf-related activities.

## Features

- Modern UI with Tailwind CSS
- Type-safe development with TypeScript
- Real-time analytics and performance monitoring
- Error boundary handling
- Responsive design
- Dark mode support

## Environment Configuration

### Important: Do Not Delete .env.local

The `.env.local` file contains critical configuration for the application, including:
- Domain settings for authentication
- OAuth provider configurations
- API keys and secrets

If this file is deleted, authentication will break because:
1. OAuth redirects will fail
2. Session cookies won't work properly
3. API calls will fail

### Setting Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual configuration:
   - `NEXT_PUBLIC_SITE_URL`: Must be `https://app.turfyeah.com`
   - `NEXT_PUBLIC_APP_URL`: Must be `https://app.turfyeah.com`
   - `AUTH_REDIRECT_URL`: Must be `https://app.turfyeah.com/api/auth/callback`

### Domain Configuration

The application uses `app.turfyeah.com` as its primary domain. Any requests to `app.turfeah.com` will be automatically redirected to the correct domain.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

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
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   # Add your environment variables here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
turf-app/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and hooks
├── public/          # Static assets
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors who have helped shape this project

# Updated on Thu Apr 24 16:15:04 -03 2025

# Fresh deployment attempt - Thu Apr 24 16:17:16 -03 2025

// Test comment
// Test comment

## 📚 Documentation

- [Changelog](./CHANGELOG.md) – Latest build updates and implementation details
- [Contributing](./.github/CONTRIBUTING.md) – Guidelines for contributing to the project
- [Code of Conduct](./.github/CODE_OF_CONDUCT.md) – Our standards for participation

## Production

The application is deployed to Vercel. Make sure to:
1. Configure the correct domain in Vercel
2. Set up all environment variables in the Vercel dashboard
3. Configure OAuth providers to use the correct redirect URLs

## Authentication

The app uses Supabase for authentication with the following providers:
- Google OAuth
- GitHub OAuth
- Email/Password

Make sure to configure the correct redirect URLs in your OAuth provider settings:
- Google Developer Console
- GitHub Developer Settings
- Supabase Authentication Settings

All redirect URLs should use `https://app.turfyeah.com/auth/callback`
