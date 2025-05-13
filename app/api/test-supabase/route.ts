import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verify environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: "Missing Supabase environment variables",
        environment: {
          url: supabaseUrl ? 'Set' : 'Missing',
          anonKey: supabaseAnonKey ? 'Set' : 'Missing'
        }
      }, { status: 500 });
    }
    
    // Create Supabase client with timeout handling
    const supabase = createRouteHandlerClient({ cookies });
    
    // Test database connection with timeout
    let dbTest, dbError;
    try {
      const dbPromise = supabase.from('profiles').select('count').limit(1);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      );
      
      const result = await Promise.race([dbPromise, timeoutPromise]);
      dbTest = result.data;
      dbError = result.error;
    } catch (error) {
      dbError = error;
    }

    // Test auth configuration with timeout
    let authTest, authError;
    try {
      const authPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth query timeout')), 5000)
      );
      
      const result = await Promise.race([authPromise, timeoutPromise]);
      authTest = result.data;
      authError = result.error;
    } catch (error) {
      authError = error;
    }

    // Test OAuth providers
    let providers, providersError;
    try {
      const providersResult = await supabase.auth.getProviders();
      providers = providersResult.data;
      providersError = providersResult.error;
    } catch (error) {
      providersError = error;
    }

    return NextResponse.json({
      success: !dbError && !authError,
      database: {
        connected: !dbError,
        error: dbError ? dbError.message : null
      },
      auth: {
        configured: !authError,
        error: authError ? authError.message : null,
        providers: providers || []
      },
      environment: {
        url: supabaseUrl ? 'Set' : 'Missing',
        anonKey: supabaseAnonKey ? 'Set' : 'Missing',
        project: "turf (prj_FoBSdmqcM5MPfFjAK4SDFt3kjnHc)"
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        project: "turf (prj_FoBSdmqcM5MPfFjAK4SDFt3kjnHc)"
      }
    }, { status: 500 });
  }
} 