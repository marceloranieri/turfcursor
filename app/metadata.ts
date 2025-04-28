import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turf - Social Debate Platform',
  description: 'Join daily debates and connect through meaningful conversations.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  keywords: ['discussion', 'social', 'community', 'chat', 'debate'],
  authors: [{ name: 'Turf App Team' }],
  creator: 'Turf App Team',
  publisher: 'Turf App',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Turf',
    description: 'Engage in vibrant daily discussions.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    siteName: 'Turf',
    images: [
      {
        url: '/opengraph-image.png', // Optional
        width: 1200,
        height: 630,
        alt: 'Turf social discussion preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turf App - Your Social Discussion Platform',
    description: 'Join Turf App to engage in meaningful discussions, share ideas, and connect with like-minded individuals.',
    images: ['https://turf-app.vercel.app/twitter-image.png'],
    creator: '@turfapp',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Turf App',
  },
}; 