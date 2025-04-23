import { supabase } from '../supabase/client';
import { User, Message, Reaction, Circle, Notification } from '../supabase/client';

// Users
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get user profile data from the users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error || !data) return null;
  
  return data as User;
}

// Circles
export async function getCircles() {
  const { data, error } = await supabase
    .from('circles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching circles:', error);
    return [];
  }
  
  return data as Circle[];
}

// Messages
export async function getMessages(circleId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('circle_id', circleId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  
  return data as Message[];
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      ...message,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  return data as Message;
}

// Reactions
export async function getReactions(messageIds: string[]) {
  if (messageIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .in('message_id', messageIds);
    
  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }
  
  return data as Reaction[];
}

export async function addReaction(reaction: Omit<Reaction, 'id' | 'created_at'>) {
  // Check if the reaction already exists
  const { data: existingReaction } = await supabase
    .from('reactions')
    .select('*')
    .eq('message_id', reaction.message_id)
    .eq('user_id', reaction.user_id)
    .eq('content', reaction.content)
    .maybeSingle();
    
  // If it exists, delete it (toggle behavior)
  if (existingReaction) {
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existingReaction.id);
      
    if (deleteError) {
      console.error('Error removing reaction:', deleteError);
    }
    
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
    
  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }
  
  return data as Reaction;
}

// Notifications
export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data as Notification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
    
  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  
  return true;
}

export async function clearAllNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
  
  return true;
}

// Genius Awards
export async function giveGeniusAward(messageId: string) {
  // Get current user
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;
  
  // Check if user has awards remaining
  if (currentUser.genius_awards_remaining <= 0) return false;
  
  // Get the message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();
    
  if (messageError || !message) return false;
  
  // Start a transaction by using Supabase's RPC
  const { error: transactionError } = await supabase.rpc('award_genius', {
    p_message_id: messageId,
    p_from_user_id: currentUser.id,
    p_to_user_id: message.user_id
  });
  
  if (transactionError) {
    console.error('Error awarding genius:', transactionError);
    return false;
  }
  
  return true;
} 