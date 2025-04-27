import logger from '@/lib/logger';
import { supabase } from '../supabase/client';
import { User, Message, Reaction, Circle, Notification } from '../supabase/client';

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param retryDelay Initial delay in ms
 * @returns Promise with the function result
 */
async function retry<T>(
  fn: () => Promise<T>, 
  maxRetries = 3, 
  retryDelay = 300
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warn(`API call failed, retrying (${i + 1}/${maxRetries})...`, error);
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
}

// Users
export async function getCurrentUser() {
  return retry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get user profile data from the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return data as unknown as User;
  });
}

// Circles
export async function getCircles() {
  return retry(async () => {
    const { data, error } = await supabase
      .from('circles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as unknown as Circle[];
  });
}

// Messages
export async function getMessages(circleId: string) {
  return retry(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data as unknown as Message[];
  });
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
  return retry(async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...message,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('Failed to send message');
    
    return data as unknown as Message;
  });
}

// Reactions
export async function getReactions(messageIds: string[]) {
  if (messageIds.length === 0) return [];
  
  return retry(async () => {
    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .in('message_id', messageIds);
      
    if (error) throw error;
    
    return data as unknown as Reaction[];
  });
}

export async function addReaction(reaction: Omit<Reaction, 'id' | 'created_at'>) {
  return retry(async () => {
    // Check if the reaction already exists
    const { data: existingReaction, error: checkError } = await supabase
      .from('reactions')
      .select('*')
      .eq('message_id', reaction.message_id)
      .eq('user_id', reaction.user_id)
      .eq('content', reaction.content)
      .maybeSingle();
      
    if (checkError) throw checkError;
      
    // If it exists, delete it (toggle behavior)
    if (existingReaction) {
      const existingId = (existingReaction as unknown as { id: string }).id;
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existingId);
        
      if (deleteError) throw deleteError;
      
      return null;
    }
    
    // Otherwise, add the new reaction
    const { data, error } = await supabase
      .from('reactions')
      .insert([{
        ...reaction,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('Failed to add reaction');
    
    return data as unknown as Reaction;
  });
}

// Notifications
export async function getNotifications() {
  return retry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as unknown as Notification[];
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return retry(async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) throw error;
    
    return true;
  });
}

export async function clearAllNotifications() {
  return retry(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
      
    if (error) throw error;
    
    return true;
  });
}

// Genius Awards
export async function giveGeniusAward(messageId: string) {
  return retry(async () => {
    // Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    // Check if user has awards remaining
    if (currentUser.genius_awards_remaining <= 0) {
      throw new Error('Not enough genius awards remaining');
    }
    
    // Get the message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();
      
    if (messageError) throw messageError;
    if (!message) throw new Error('Message not found');
    
    const messageUserId = (message as unknown as { user_id: string }).user_id;
    
    // Start a transaction by using Supabase's RPC
    const { error: transactionError } = await supabase.rpc('award_genius', {
      p_message_id: messageId,
      p_from_user_id: currentUser.id,
      p_to_user_id: messageUserId
    });
    
    if (transactionError) throw transactionError;
    
    return true;
  });
} 