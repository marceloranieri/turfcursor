import logger from '@/lib/logger';
import { supabase } from '@/lib/supabase/client';
import { Message } from '@/lib/types';

export class Pincredible {
  private static instance: Pincredible;
  private lastPinTime: number = 0;
  private readonly PIN_INTERVAL = 300000; // 5 minutes
  private readonly PIN_DURATION = 30000; // 30 seconds

  private constructor() {}

  public static getInstance(): Pincredible {
    if (!Pincredible.instance) {
      Pincredible.instance = new Pincredible();
    }
    return Pincredible.instance;
  }

  public async checkAndPin(topicId: string, messages: Message[]) {
    const now = Date.now();
    if (now - this.lastPinTime >= this.PIN_INTERVAL) {
      await this.pinMostEngagedMessage(topicId, messages);
      this.lastPinTime = now;

      // Schedule unpin after PIN_DURATION
      setTimeout(() => {
        this.unpinMessage(topicId);
      }, this.PIN_DURATION);
    }
  }

  private async pinMostEngagedMessage(topicId: string, messages: Message[]) {
    try {
      // Calculate engagement score for each message
      const messageScores = messages.map(message => {
        const replyCount = message.replies?.length || 0;
        const reactionCount = message.reactions?.length || 0;
        const upvotes = message.reactions?.filter(r => r.type === 'upvote').length || 0;
        
        // Score = replies * 2 + reactions + upvotes * 2
        const score = replyCount * 2 + reactionCount + upvotes * 2;
        
        return {
          messageId: message.id,
          userId: message.user_id,
          score,
        };
      });

      // Find message with highest score
      const topMessage = messageScores.reduce((prev, current) => 
        current.score > prev.score ? current : prev
      );

      if (topMessage.score > 0) {
        // Unpin any currently pinned messages
        await this.unpinMessage(topicId);

        // Pin the top message
        const { error: pinError } = await supabase
          .from('messages')
          .update({ is_pinned: true })
          .eq('id', topMessage.messageId);

        if (pinError) throw pinError;

        // Create notification for the message author
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: topMessage.userId,
            type: 'pin',
            content: 'Your message was pinned for high engagement! 📌',
          });

        if (notificationError) throw notificationError;
      }
    } catch (error) {
      logger.error('Error in Pincredible:', error);
    }
  }

  private async unpinMessage(topicId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_pinned: false })
        .eq('topic_id', topicId)
        .eq('is_pinned', true);

      if (error) throw error;
    } catch (error) {
      logger.error('Error unpinning message:', error);
    }
  }
} 