import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import crypto from 'crypto';
import logger from '@/lib/logger';

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
      logger.error('GitHub webhook secret not configured');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    if (!verifySignature(payload, signature, webhookSecret)) {
      logger.warn('Invalid webhook signature received');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const event = req.headers.get('x-github-event');
    const data = JSON.parse(payload);

    logger.info(`Processing GitHub webhook event: ${event}`);

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
      case 'fork':
        await handleForkEvent(data);
        break;
      case 'release':
        await handleReleaseEvent(data);
        break;
      case 'watch':
        await handleWatchEvent(data);
        break;
      case 'create':
        await handleCreateEvent(data);
        break;
      case 'delete':
        await handleDeleteEvent(data);
        break;
      default:
        logger.info(`Unhandled GitHub event: ${event}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function handlePushEvent(data: any) {
  const { ref, repository, commits, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'push',
      repo_name: repository.full_name,
      action: 'push',
      details: {
        ref,
        commits: commits.map((commit: any) => ({
          sha: commit.id,
          message: commit.message,
          author: commit.author,
        })),
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed push event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving push event:', error);
  }
}

async function handlePullRequestEvent(data: any) {
  const { action, pull_request, repository, sender } = data;

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
        sender: sender.login,
        merged: pull_request.merged,
        mergeable: pull_request.mergeable,
        mergeable_state: pull_request.mergeable_state,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed pull request event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving pull request event:', error);
  }
}

async function handleIssueEvent(data: any) {
  const { action, issue, repository, sender } = data;

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
        sender: sender.login,
        labels: issue.labels,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed issue event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving issue event:', error);
  }
}

async function handleStarEvent(data: any) {
  const { action, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'star',
      repo_name: repository.full_name,
      action,
      details: {
        stars: repository.stargazers_count,
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed star event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving star event:', error);
  }
}

async function handleForkEvent(data: any) {
  const { forkee, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'fork',
      repo_name: repository.full_name,
      action: 'forked',
      details: {
        forkee_name: forkee.full_name,
        forkee_url: forkee.html_url,
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed fork event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving fork event:', error);
  }
}

async function handleReleaseEvent(data: any) {
  const { action, release, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'release',
      repo_name: repository.full_name,
      action,
      details: {
        name: release.name,
        tag_name: release.tag_name,
        url: release.html_url,
        sender: sender.login,
        draft: release.draft,
        prerelease: release.prerelease,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed release event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving release event:', error);
  }
}

async function handleWatchEvent(data: any) {
  const { action, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'watch',
      repo_name: repository.full_name,
      action,
      details: {
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed watch event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving watch event:', error);
  }
}

async function handleCreateEvent(data: any) {
  const { ref_type, ref, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'create',
      repo_name: repository.full_name,
      action: 'created',
      details: {
        ref_type,
        ref,
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed create event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving create event:', error);
  }
}

async function handleDeleteEvent(data: any) {
  const { ref_type, ref, repository, sender } = data;

  try {
    await supabase.from('github_events').insert({
      type: 'delete',
      repo_name: repository.full_name,
      action: 'deleted',
      details: {
        ref_type,
        ref,
        sender: sender.login,
      },
      created_at: new Date().toISOString(),
    });
    logger.info(`Processed delete event for ${repository.full_name}`);
  } catch (error) {
    logger.error('Error saving delete event:', error);
  }
} 