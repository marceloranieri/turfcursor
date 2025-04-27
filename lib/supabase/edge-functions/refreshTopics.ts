import logger from '@/lib/logger';
// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function refreshDailyTopics(supabase: any) {
  // Get all used topics from history
  const { data: used, error: usedErr } = await supabase
    .from('topic_history')
    .select('topic_id');

  if (usedErr) throw new Error(`Used fetch failed: ${usedErr.message}`);
  
  // Create array of used topic IDs
  const usedIds = used ? used.map((r: any) => r.topic_id) : [];
  
  // Query for available topics (not in history)
  const query = usedIds.length > 0
    ? supabase.from('topics').select('*').not('id', 'in', usedIds)
    : supabase.from('topics').select('*');
  
  let { data: available, error: availErr } = await query;

  if (availErr) throw new Error(`Available fetch failed: ${availErr.message}`);
  
  // Error if not enough topics
  if (!available || available.length < 5) {
    // If all topics have been used, clear history to start over
    if (usedIds.length > 0) {
      logger.info("All topics used, resetting rotation cycle");
      const { error: truncateErr } = await supabase.from('topic_history').delete().neq('topic_id', '00000000-0000-0000-0000-000000000000');
      
      if (truncateErr) throw new Error(`History reset failed: ${truncateErr.message}`);
      
      // Fetch all topics again
      const { data: allTopics, error: allErr } = await supabase.from('topics').select('*');
      if (allErr) throw new Error(`All topics fetch failed: ${allErr.message}`);
      available = allTopics;
    } else {
      throw new Error('Not enough unused topics left. Please add more.');
    }
  }
  
  // Randomly select 5 topics
  const picked = available.sort(() => 0.5 - Math.random()).slice(0, 5);
  
  // Reset all active topics
  const { error: resetErr } = await supabase.from('topics').update({ active: false }).eq('active', true);
  if (resetErr) throw new Error(`Reset active failed: ${resetErr.message}`);
  
  // Set new active topics
  const { error: activateErr } = await supabase
    .from('topics')
    .update({ active: true })
    .in('id', picked.map((t: any) => t.id));
  
  if (activateErr) throw new Error(`Activation failed: ${activateErr.message}`);
  
  // Record in history
  const historyRecords = picked.map((t: any) => ({ 
    topic_id: t.id, 
    used_on: new Date().toISOString().split('T')[0]
  }));
  
  const { error: historyErr } = await supabase
    .from('topic_history')
    .insert(historyRecords);
  
  if (historyErr) throw new Error(`History update failed: ${historyErr.message}`);
  
  return picked;
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

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Call the refresh function
    const newTopics = await refreshDailyTopics(supabase);
    
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