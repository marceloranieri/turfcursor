import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';

// Verify GitHub webhook signature
function verifySignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false;
  
  const sig = Buffer.from(signature);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'));
  
  if (sig.length !== digest.length) return false;
  return crypto.timingSafeEqual(digest, sig);
}

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('GitHub webhook secret not configured');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    if (!verifySignature(payload, signature, webhookSecret)) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const event = req.headers.get('x-github-event');
    const data = JSON.parse(payload);

    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(data);
        break;
      case 'pull_request':
        await handlePullRequestEvent(data);
        break;
      case 'issues':
        await handleIssueEvent(data);
        break;
      case 'star':
        await handleStarEvent(data);
        break;
      default:
        console.log(`Unhandled GitHub event: ${event}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function handlePushEvent(data: any) {
  const { repository, commits, ref } = data;
  const branch = ref.split('/').pop();

  try {
    await supabase.from('github_events').insert({
      type: 'push',
      repo_name: repository.full_name,
      branch,
      commit_count: commits.length,
      details: {
        commits: commits.map((commit: any) => ({
          id: commit.id,
          message: commit.message,
          author: commit.author.username,
          url: commit.url,
        })),
      },
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving push event:', error);
  }
}

async function handlePullRequestEvent(data: any) {
  const { action, pull_request, repository } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'pull_request',
      repo_name: repository.full_name,
      action,
      details: {
        title: pull_request.title,
        number: pull_request.number,
        state: pull_request.state,
        url: pull_request.html_url,
        user: pull_request.user.login,
      },
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving pull request event:', error);
  }
}

async function handleIssueEvent(data: any) {
  const { action, issue, repository } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'issue',
      repo_name: repository.full_name,
      action,
      details: {
        title: issue.title,
        number: issue.number,
        state: issue.state,
        url: issue.html_url,
        user: issue.user.login,
      },
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving issue event:', error);
  }
}

async function handleStarEvent(data: any) {
  const { action, repository } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'star',
      repo_name: repository.full_name,
      action,
      details: {
        stars: repository.stargazers_count,
      },
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving star event:', error);
  }
} 