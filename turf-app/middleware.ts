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
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 