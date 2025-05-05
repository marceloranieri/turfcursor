import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GitHubWebhook');

// Create Supabase client directly (no separate file)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
  });
}

// Verify webhook signature
function verifyGitHubWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  const calculatedSignature = `sha256=${hmac.update(payload).digest('hex')}`;
  return calculatedSignature === signature;
}

export async function POST(request: Request) {
  try {
    // Log initial request details
    logger.info('Webhook request received', {
      event: request.headers.get('x-github-event'),
      delivery: request.headers.get('x-github-delivery')
    });

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      logger.error('Missing GITHUB_WEBHOOK_SECRET environment variable');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Get the signature from the headers
    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) {
      logger.error('No signature found in webhook request');
      return new NextResponse('No signature provided', { status: 401 });
    }

    // Get the raw payload
    const payload = await request.text();
    
    // Verify the signature
    if (!verifyGitHubWebhook(payload, signature, webhookSecret)) {
      logger.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // Parse the payload
    const data = JSON.parse(payload);
    const event = request.headers.get('x-github-event');

    logger.info('Processing webhook event:', { event, action: data.action });

    try {
      // Create Supabase client for this request
      const supabase = getSupabaseClient();
      
      // Insert the event data
      const { error: dbError } = await supabase
        .from('github_events')
        .insert({
          event_type: event,
          payload: JSON.stringify(data),
          repository: data.repository?.full_name,
          sender: data.sender?.login,
          action: data.action || event
        });

      if (dbError) {
        logger.error('Database error details:', {
          message: dbError.message,
          details: dbError.details,
          code: dbError.code,
          hint: dbError.hint
        });
        return new NextResponse(`Error storing event: ${JSON.stringify(dbError)}`, { status: 500 });
      }

      logger.info('Webhook event stored successfully');
      return new NextResponse('Webhook processed successfully', { status: 200 });
    } catch (error) {
      logger.error('Supabase error:', error);
      return new NextResponse(`Supabase error: ${JSON.stringify(error)}`, { status: 500 });
    }
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return new NextResponse(`Error processing webhook: ${JSON.stringify(error)}`, { status: 500 });
  }
} 