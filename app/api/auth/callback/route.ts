import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Auth callback executing with URL:', request.url);
  
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    
    // Determine base URL for redirects (handle both development and production)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (requestUrl.origin.includes('localhost') ? 'http://localhost:3000' : requestUrl.origin);
    
    console.log('Processing auth callback with code present:', !!code);
    
    if (error) {
      console.error('Auth error:', {
        error,
        description: errorDescription,
        url: request.url
      });
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=${error}&description=${encodeURIComponent(errorDescription || '')}`);
    }
    
    if (!code) {
      console.error('No code provided in callback');
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=no_code`);
    }
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    console.log('Exchanging code for session...');
    const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (supabaseError) {
      console.error('Session exchange error:', {
        error: supabaseError,
        code: code.substring(0, 8) + '...' // Log only a portion for security
      });
      // Use absolute URL to prevent redirect loops
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=session_exchange&description=${encodeURIComponent(supabaseError.message)}`);
    }
    
    if (!data.session) {
      console.error('No session after code exchange');
      // Use absolute URL to prevent redirect loops 
      return NextResponse.redirect(`${baseUrl}/auth/error?reason=no_session`);
    }
    
    console.log('Auth successful, redirecting to dashboard');
    // Use absolute URL to prevent redirect loops
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    console.error('Unexpected auth error:', err);
    // Get base URL from request
    const baseUrl = new URL(request.url).origin;
    // Use absolute URL to prevent redirect loops
    return NextResponse.redirect(`${baseUrl}/auth/error?reason=unknown`);
  }
} 