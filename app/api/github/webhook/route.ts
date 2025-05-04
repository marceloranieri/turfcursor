import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GitHubWebhook');

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

    // Log environment variable status
    logger.info('Environment check:', {
      hasWebhookSecret: !!process.env.GITHUB_WEBHOOK_SECRET,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

    logger.info('Received GitHub webhook:', { event, action: data.action });

    // Handle ping events separately
    if (event === 'ping') {
      logger.info('Processing ping event');
      try {
        // Log before database operation
        logger.info('Storing webhook event in database');
        
        const { error: dbError } = await supabase
          .from('github_events')
          .insert({
            event_type: 'ping',
            payload: data,
            repository: data.repository?.full_name,
            sender: data.sender?.login,
            action: 'ping'
          });

        if (dbError) {
          logger.error('Database error while storing webhook event', { error: dbError });
          return new NextResponse('Error storing ping event', { status: 500 });
        }

        logger.info('Webhook event stored successfully');
        return new NextResponse('Webhook ping received successfully', { status: 200 });
      } catch (error) {
        logger.error('Unexpected error processing ping event:', error);
        return new NextResponse('Error processing ping event', { status: 500 });
      }
    }

    // For non-ping events, store in Supabase
    try {
      // Log before database operation
      logger.info('Storing webhook event in database');
      
      const { error: dbError } = await supabase
        .from('github_events')
        .insert({
          event_type: event,
          payload: data,
          repository: data.repository?.full_name,
          sender: data.sender?.login,
          action: data.action
        });

      if (dbError) {
        logger.error('Database error while storing webhook event', { error: dbError });
        return new NextResponse('Error storing event', { status: 500 });
      }

      logger.info('Webhook event stored successfully');
      return new NextResponse('Webhook processed successfully', { status: 200 });
    } catch (error) {
      logger.error('Unexpected error processing webhook event:', error);
      return new NextResponse('Error processing webhook', { status: 500 });
    }
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}