import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Test database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    // Test auth configuration
    const { data: authTest, error: authError } = await supabase.auth.getSession();

    // Test OAuth providers
    const { data: providers, error: providersError } = await supabase.auth.getProviders();

    return NextResponse.json({
      success: true,
      database: {
        connected: !dbError,
        error: dbError?.message
      },
      auth: {
        configured: !authError,
        error: authError?.message,
        providers: providers || []
      },
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 