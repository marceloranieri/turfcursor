import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    
    if (error) {
      console.error('Auth error:', {
        error,
        description: errorDescription,
        url: request.url
      });
      return NextResponse.redirect(new URL(`/auth/error?reason=${error}&description=${encodeURIComponent(errorDescription || '')}`, request.url));
    }
    
    if (!code) {
      console.error('No code provided in callback');
      return NextResponse.redirect(new URL('/auth/error?reason=no_code', request.url));
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (supabaseError) {
      console.error('Session exchange error:', {
        error: supabaseError,
        code
      });
      return NextResponse.redirect(new URL(`/auth/error?reason=session_exchange&description=${encodeURIComponent(supabaseError.message)}`, request.url));
    }
    
    if (!data.session) {
      console.error('No session after code exchange');
      return NextResponse.redirect(new URL('/auth/error?reason=no_session', request.url));
    }
    
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Unexpected auth error:', err);
    return NextResponse.redirect(new URL('/auth/error?reason=unknown', request.url));
  }
} 