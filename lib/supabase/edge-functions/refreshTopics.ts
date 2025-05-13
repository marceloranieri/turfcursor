import logger from '@/lib/logger';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/supabase';

interface Topic {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

async function checkAvailability(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (err) {
    const availErr = err instanceof Error ? err : new Error('Unknown error');
    console.error('Availability check failed:', availErr.message);
    return false;
  }
}

export async function refreshTopics(supabaseUrl: string, supabaseKey: string): Promise<Topic[]> {
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    const { data: topics, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return topics || [];
  } catch (error) {
    console.error('Error refreshing topics:', error);
    return [];
  }
}

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Verify request has authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase URL and service role key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Call the refresh function
    const newTopics = await refreshTopics(supabaseUrl, supabaseKey);
    
    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Topics refreshed successfully',
        topics: newTopics
      }),
      { 
        status: 200, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    logger.error('Error refreshing topics:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      }
    );
  }
}); 