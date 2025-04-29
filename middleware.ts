import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function will run for all routes
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // List of routes that should be dynamically rendered
  const dynamicRoutes = [
    '/dashboard',
    '/onboarding',
    '/auth/signup',
    '/auth/login',
    '/settings',
    '/',
    '/onboarding/welcome',
    '/chat',
    '/auth/callback',
    '/profile',
  ];
  
  // Check if the current path is in our list of dynamic routes
  const isDynamicRoute = dynamicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If it's a dynamic route, add a header to indicate it should be dynamically rendered
  if (isDynamicRoute) {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }
  
  // For all other routes, proceed normally
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/auth/:path*',
    '/settings/:path*',
    '/',
    '/chat/:path*',
    '/profile/:path*',
  ],
}; 