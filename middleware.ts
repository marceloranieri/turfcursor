import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/login',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/onboarding',
  '/onboarding/welcome',
  '/onboarding/guest',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // For public routes, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For all other routes, check for authentication
  // For now, we'll just pass through all requests
  // In a real implementation, you would check for a session token
  const response = NextResponse.next();
  
  // Cache static assets for 1 year
  if (pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Cache API responses for 5 minutes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  }

  // Add security headers
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.vercel.app"
  );

  return response;
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 