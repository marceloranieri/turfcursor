import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createServerSupabase } from '@/lib/supabase/server-client';
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
    // Create server-side Supabase client
    const supabase = createServerSupabase();
    
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

    // Handle ping events separately
    if (event === 'ping') {
      logger.info('Processing ping event');
      try {
        const { error: dbError } = await supabase
          .from('github_events')
          .insert({
            event_type: 'ping',
            payload: JSON.stringify(data),
            repository: data.repository?.full_name,
            sender: data.sender?.login,
            action: 'ping'
          });

        if (dbError) {
          logger.error('Database error details:', {
            message: dbError.message,
            details: dbError.details,
            code: dbError.code,
            hint: dbError.hint
          });
          return new NextResponse(`Error storing ping event: ${JSON.stringify(dbError)}`, { status: 500 });
        }

        logger.info('Ping event stored successfully');
        return new NextResponse('Webhook ping received successfully', { status: 200 });
      } catch (error) {
        logger.error('Unexpected error processing ping event:', error);
        return new NextResponse('Error processing ping event', { status: 500 });
      }
    }

    // For non-ping events, store in Supabase
    try {
      const { error: dbError } = await supabase
        .from('github_events')
        .insert({
          event_type: event,
          payload: JSON.stringify(data),
          repository: data.repository?.full_name,
          sender: data.sender?.login,
          action: data.action
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
      logger.error('Unexpected error processing webhook event:', error);
      return new NextResponse('Error processing webhook', { status: 500 });
    }
  } catch (error) {
    logger.error('Unexpected error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}