import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get used topic IDs
    const { data: used, error: usedError } = await supabase
      .from('topic_history')
      .select('topic_id');

    if (usedError) throw usedError;
    const usedIds = used.map((r) => r.topic_id);

    // Get unused topics
    const { data: available, error: availError } = await supabase
      .from('topics')
      .select('*')
      .not('id', 'in', usedIds.length > 0 ? `(${usedIds.join(',')})` : '()');

    if (availError) throw availError;

    if (!available || available.length < 5) {
      // Reset topic history if we don't have enough unused topics
      await supabase.from('topic_history').delete().neq('topic_id', 'none');
      
      // Get all topics again
      const { data: allTopics, error: allError } = await supabase
        .from('topics')
        .select('*');

      if (allError) throw allError;
      available = allTopics;
    }

    // Pick 5 random topics
    const selectedTopics = available
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    // Deactivate all currently active topics
    await supabase
      .from('topics')
      .update({ active: false })
      .eq('active', true);

    // Activate the new topics
    await supabase
      .from('topics')
      .update({ active: true })
      .in('id', selectedTopics.map((t) => t.id));

    // Log the usage in topic_history
    await supabase
      .from('topic_history')
      .insert(selectedTopics.map((t) => ({ topic_id: t.id })));

    // Create notifications for all users
    const { data: users } = await supabase
      .from('profiles')
      .select('id');

    if (users) {
      const notifications = users.flatMap((user) =>
        selectedTopics.map((topic) => ({
          user_id: user.id,
          type: 'topic',
          content: `New topic available: ${topic.title}`,
        }))
      );

      await supabase.from('notifications').insert(notifications);
    }

    return new Response(
      JSON.stringify({ message: 'Topics refreshed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 