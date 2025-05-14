import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check Supabase connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);
    
    // Get auth settings
    const { data: settings, error: settingsError } = await supabase.auth.getSession();
    
    // Get RLS policies for User table
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies');
    
    // Return diagnostic info
    return NextResponse.json({
      supabaseConnection: healthError ? 'Error' : 'Connected',
      connectionError: healthError ? healthError.message : null,
      authSettings: settings,
      authError: settingsError ? settingsError.message : null,
      policies: policies || [],
      policiesError: policiesError ? policiesError.message : null,
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing URL',
        authRedirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://app.turfyeah.com'}/api/auth/callback`,
        googleOAuthEnabled: true
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 