import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';
import { cspToString, cspConfig } from './csp-config';

const logger = createLogger('Middleware');

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Add routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/callback',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/error',
  '/legal/terms',
  '/legal/privacy',
];

// This middleware function will run for all routes
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Continue with your existing middleware logic for protected routes
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // If no session and not a public route, redirect to signin
  if (!session) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Check terms acceptance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('terms_accepted, terms_version')
    .eq('id', session.user.id)
    .single();
    
  if (profileError || !profile?.terms_accepted) {
    // User hasn't accepted terms, redirect to terms acceptance page
    const returnUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/legal/accept-terms?returnUrl=${returnUrl}`, request.url));
  }

  // Check if terms version is current
  if (profile.terms_version !== '1.0') {
    // User needs to accept the latest terms
    const returnUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/legal/terms-update?returnUrl=${returnUrl}`, request.url));
  }

  // Add user context to headers for server components
  res.headers.set('x-user-id', session.user.id);
  res.headers.set('x-user-email', session.user.email || '');
  res.headers.set('x-user-role', session.user.role || 'user');

  // Add CSP header
  res.headers.set('Content-Security-Policy', cspToString(cspConfig));
  
  // Add other security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return res;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 