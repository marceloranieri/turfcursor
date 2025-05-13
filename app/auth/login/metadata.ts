import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Turf',
  description: 'Login to Turf - Your social debate platform',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Login - Turf',
    description: 'Sign in to your Turf account',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Turf Login'
      }
    ]
  }
}; 