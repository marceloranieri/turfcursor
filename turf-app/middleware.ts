import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/login',
  '/onboarding',
  '/onboarding/welcome',
  '/onboarding/guest',
];

export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 