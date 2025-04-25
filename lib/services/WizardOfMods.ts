import { supabase } from '@/lib/supabase/client';
import { Message } from '@/lib/types';

export class WizardOfMods {
  private static instance: WizardOfMods;
  private lastMessageTime: number = 0;
  private readonly LULL_THRESHOLD = 20000; // 20 seconds

  private constructor() {}

  public static getInstance(): WizardOfMods {
    if (!WizardOfMods.instance) {
      WizardOfMods.instance = new WizardOfMods();
    }
    return WizardOfMods.instance;
  }

  public async checkAndTrigger(topicId: string, messages: Message[]) {
    const now = Date.now();
    if (now - this.lastMessageTime >= this.LULL_THRESHOLD) {
      await this.triggerWizardMessage(topicId, messages);
      this.lastMessageTime = now;
    }
  }

  public updateLastMessageTime() {
    this.lastMessageTime = Date.now();
  }

  private async triggerWizardMessage(topicId: string, messages: Message[]) {
    try {
      // Get the last few messages for context
      const recentMessages = messages.slice(-5);
      const context = recentMessages.map(m => m.content).join('\n');

      // Generate a response using your preferred AI service
      const response = await this.generateResponse(context);

      // Insert the wizard's message
      const { error: messageError } = await supabase.from('messages').insert({
        topic_id: topicId,
        content: response,
        is_wizard: true,
      });

      if (messageError) throw messageError;

      // Create a notification for all users in the topic
      const uniqueUserIds = new Set(messages.map(m => m.user_id));
      const notifications = Array.from(uniqueUserIds).map(userId => ({
        user_id: userId,
        type: 'wizard',
        content: 'The Wizard of Mods has shared some wisdom! 🧙‍♂️',
      }));

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) throw notificationError;
    } catch (error) {
      console.error('Error in Wizard of Mods:', error);
    }
  }

  private async generateResponse(context: string): Promise<string> {
    // This is a placeholder. Replace with your actual AI service integration.
    const responses = [
      "Have you considered the opposite perspective? 🤔",
      "Let me play devil's advocate for a moment... 😈",
      "Here's an interesting angle to consider... 🎯",
      "What if we looked at this from a different viewpoint? 🔄",
      "Allow me to challenge that assumption... 🧐",
      "Here's a thought-provoking question... ❓",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
} 