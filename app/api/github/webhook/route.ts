import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GitHubWebhook');

// Security configuration
const ALLOWED_EVENTS = ['push', 'pull_request', 'issues', 'release'];
const ALLOWED_REPOS = ['marceloranieri/turfcursor'];
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000 // 1 minute
};

// Simple in-memory rate limiting (consider using Redis in production)
const ipLimiter = new Map<string, {count: number, timestamp: number}>();

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

// Check rate limit for an IP
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipLimiter.get(ip) || {count: 0, timestamp: now};
  
  if (now - record.timestamp > RATE_LIMIT.windowMs) {
    // Reset after window
    record.count = 1;
    record.timestamp = now;
  } else if (record.count >= RATE_LIMIT.maxRequests) {
    return false; // Rate limit exceeded
  } else {
    record.count++;
  }
  
  ipLimiter.set(ip, record);
  return true;
}

export async function POST(request: Request) {
  try {
    logger.info('Webhook request received');
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      logger.error('Missing GITHUB_WEBHOOK_SECRET environment variable');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return new NextResponse('Rate limit exceeded', { status: 429 });
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
      logger.error('Invalid webhook signature', {
        ip,
        event: request.headers.get('x-github-event'),
        repo: JSON.parse(payload).repository?.full_name || 'unknown',
        timestamp: new Date().toISOString()
      });
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
    
    // Validate event type
    const event = request.headers.get('x-github-event');
    if (!event || !ALLOWED_EVENTS.includes(event)) {
      logger.warn(`Unsupported event type: ${event}`);
      return new NextResponse('Unsupported event type', { status: 400 });
    }

    // Validate repository
    const repo = data.repository?.full_name;
    if (!repo || !ALLOWED_REPOS.includes(repo)) {
      logger.warn(`Webhook from unauthorized repository: ${repo}`);
      return new NextResponse('Unauthorized repository', { status: 403 });
    }

    // Log event details with enhanced security context
    logger.info(`Received ${event} event from ${repo}`, {
      event,
      repository: repo,
      sender: data.sender?.login,
      action: data.action,
      vercel_project: "turf (prj_FoBSdmqcM5MPfFjAK4SDFt3kjnHc)",
      ip,
      timestamp: new Date().toISOString()
    });
    
    // Just acknowledge receipt
    return new NextResponse('Webhook received', { status: 200 });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    return new NextResponse(`Error processing webhook: ${error.message}`, { status: 500 });
  }
}