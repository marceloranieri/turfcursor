import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// This middleware function will run for all routes
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if the path should be protected
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/chat') || 
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/settings');
                          
  if (isProtectedRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // Check terms acceptance
    const { data: profile } = await supabase
      .from('profiles')
      .select('terms_accepted, terms_version')
      .eq('id', session.user.id)
      .single();
      
    if (!profile?.terms_accepted) {
      // User hasn't accepted terms, redirect to terms acceptance page
      // Store the original URL they were trying to access
      const returnUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/legal/accept-terms?returnUrl=${returnUrl}`, req.url));
    }

    // Check if terms version is current
    if (profile.terms_version !== '1.0') {
      // User needs to accept the latest terms
      const returnUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/legal/terms-update?returnUrl=${returnUrl}`, req.url));
    }
  }
  
  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/chat/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // Add other protected routes here
  ],
}; 