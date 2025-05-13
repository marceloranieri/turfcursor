import { Metadata, Viewport } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Turf - Engage in Meaningful Discussions',
      template: '%s | Turf'
    },
    description: 'Join Turf to engage in meaningful discussions, share ideas, and connect with others in a respectful environment.',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}; 