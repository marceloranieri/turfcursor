'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ChatActions');

export async function sendMessage(chatId: string, content: string) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        user_id: session.user.id,
        content: content.trim(),
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('Error sending message:', error);
    return { success: false, error };
  }
}

export async function loadMoreMessages(chatId: string, beforeDate: string) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient(cookieStore);

    const { data, error } = await supabase
      .from('messages')
      .select('*, author:profiles(id, username, avatar_url)')
      .eq('chat_id', chatId)
      .lt('created_at', beforeDate)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    logger.error('Error loading more messages:', error);
    return { success: false, error };
  }
} 