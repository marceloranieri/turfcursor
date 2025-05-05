import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
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
    logger.info('Webhook request received');
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

    // Log event details (but don't try to store in Supabase)
    logger.info(`Received ${event} event from ${data.repository?.full_name}`, {
      event,
      repository: data.repository?.full_name,
      sender: data.sender?.login,
      action: data.action
    });
    
    // Just acknowledge receipt
    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}