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

    if (dbError) {
      throw new Error(`Database connection error: ${dbError.message}`);
    }

    // Test auth configuration
    const { data: authTest, error: authError } = await supabase.auth.getSession();

    if (authError) {
      throw new Error(`Auth configuration error: ${authError.message}`);
    }

    // Test OAuth providers
    const { data: providers, error: providersError } = await supabase.auth.getProviders();

    if (providersError) {
      throw new Error(`OAuth providers error: ${providersError.message}`);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase configuration is valid',
      details: {
        database: {
          connected: true,
          message: 'Database connection successful'
        },
        auth: {
          configured: true,
          session: authTest.session ? 'Session available' : 'No active session',
          providers: providers
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      details: {
        database: {
          connected: false,
          error: error.message
        },
        auth: {
          configured: false,
          error: error.message
        }
      }
    }, { status: 500 });
  }
} 