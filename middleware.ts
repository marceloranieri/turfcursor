import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Middleware');

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// This middleware function will run for all routes
export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );
    
    // Check if the path should be protected
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/chat') || 
                            req.nextUrl.pathname.startsWith('/profile') ||
                            req.nextUrl.pathname.startsWith('/settings');
                            
    if (isProtectedRoute) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        logger.error('Error checking session:', sessionError);
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      
      if (!session) {
        // Not logged in, redirect to login
        const redirectUrl = new URL('/auth/signin', req.url);
        redirectUrl.searchParams.set('returnUrl', req.nextUrl.pathname);
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
        const returnUrl = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/legal/accept-terms?returnUrl=${returnUrl}`, req.url));
      }

      // Check if terms version is current
      if (profile.terms_version !== '1.0') {
        // User needs to accept the latest terms
        const returnUrl = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/legal/terms-update?returnUrl=${returnUrl}`, req.url));
      }

      // Add user context to headers for server components
      res.headers.set('x-user-id', session.user.id);
      res.headers.set('x-user-email', session.user.email || '');
      res.headers.set('x-user-role', session.user.role || 'user');
    }
    
    return res;
  } catch (error) {
    logger.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth folder (authentication pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}; 