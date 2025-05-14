import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AuthCallback');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  logger.debug('Auth callback executing with URL:', request.url);
  
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    const returnTo = requestUrl.searchParams.get('returnTo') || '/dashboard';
    
    // Determine base URL for redirects (handle both development and production)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (requestUrl.origin.includes('localhost') ? 'http://localhost:3000' : requestUrl.origin);
    
    logger.debug('Processing auth callback with code present:', !!code);
    
    if (error) {
      logger.error('Auth error:', {
        error,
        description: errorDescription,
        url: request.url
      });
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=${error}&description=${encodeURIComponent(errorDescription || '')}`);
    }
    
    if (!code) {
      logger.error('No code provided in callback');
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=no_code`);
    }
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    logger.debug('Exchanging code for session...');
    const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (supabaseError) {
      logger.error('Session exchange error:', {
        error: supabaseError,
        code: code.substring(0, 8) + '...' // Log only a portion for security
      });
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=session_exchange&description=${encodeURIComponent(supabaseError.message)}`);
    }
    
    if (!data.session) {
      logger.error('No session after code exchange');
      // Use absolute URL to prevent redirect loops 
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=no_session`);
    }
    
    // Check if user needs to accept terms
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('terms_accepted, terms_version')
      .eq('id', data.session.user.id)
      .single();
    
    if (profileError) {
      logger.error('Error checking terms acceptance:', profileError);
      // Continue to dashboard on error
      return NextResponse.redirect(`${baseUrl}${returnTo}`);
    }
    
    // If terms not accepted, redirect to terms page
    if (!profile?.terms_accepted) {
      logger.debug('Terms not accepted, redirecting to terms page');
      const encodedReturnUrl = encodeURIComponent(returnTo);
      return NextResponse.redirect(`${baseUrl}/legal/accept-terms?returnUrl=${encodedReturnUrl}`);
    }
    
    // If terms version outdated, redirect to terms update page
    if (profile.terms_version !== '1.0') {
      logger.debug('Terms version outdated, redirecting to terms update page');
      const encodedReturnUrl = encodeURIComponent(returnTo);
      return NextResponse.redirect(`${baseUrl}/legal/terms-update?returnUrl=${encodedReturnUrl}`);
    }
    
    logger.debug('Auth successful, redirecting to:', returnTo);
    // Use absolute URL to prevent redirect loops
    return NextResponse.redirect(`${baseUrl}${returnTo}`);
  } catch (err) {
    logger.error('Unexpected auth error:', err);
    // Get base URL from request
    const baseUrl = new URL(request.url).origin;
    // Use absolute URL to prevent redirect loops
    return NextResponse.redirect(`${baseUrl}/auth/error?reason=unknown`);
  }
} 