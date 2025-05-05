import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Log environment variables (redacted in response)
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + '...');
    console.log('Has SUPABASE_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Try to create the client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: { persistSession: false }
      }
    );
    
    // Try a simple query
    const { data, error } = await supabase.from('github_events').select('count').limit(1);
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Supabase error', 
        error: error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful', 
      result: data 
    });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Error connecting to Supabase', 
      error: err 
    }, { status: 500 });
  }
} 