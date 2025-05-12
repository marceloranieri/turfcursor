import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GitHubWebhook');

// Verify webhook signature with timeout
function verifyGitHubWebhook(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    const calculatedSignature = `sha256=${hmac.update(payload).digest('hex')}`;
    return calculatedSignature === signature;
  } catch (error) {
    logger.error('Error verifying signature:', error);
    return false;
  }
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

    // Get the raw payload with timeout
    let payload;
    try {
      const bodyPromise = request.text();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request body timeout')), 5000)
      );
      
      payload = await Promise.race([bodyPromise, timeoutPromise]);
    } catch (error) {
      logger.error('Error reading request body:', error);
      return new NextResponse('Error reading request body', { status: 500 });
    }
    
    // Verify the signature
    if (!verifyGitHubWebhook(payload, signature, webhookSecret)) {
      logger.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // Parse the payload
    let data;
    try {
      data = JSON.parse(payload);
    } catch (error) {
      logger.error('Error parsing JSON payload:', error);
      return new NextResponse('Invalid JSON payload', { status: 400 });
    }
    
    const event = request.headers.get('x-github-event');

    // Log event details
    logger.info(`Received ${event} event from ${data.repository?.full_name}`, {
      event,
      repository: data.repository?.full_name,
      sender: data.sender?.login,
      action: data.action,
      vercel_project: "turf (prj_FoBSdmqcM5MPfFjAK4SDFt3kjnHc)"
    });
    
    // Just acknowledge receipt
    return new NextResponse('Webhook received', { status: 200 });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    return new NextResponse(`Error processing webhook: ${error.message}`, { status: 500 });
  }
}