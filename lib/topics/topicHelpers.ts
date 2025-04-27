import logger from '@/lib/logger';
'use client';

import { supabase } from '../supabase/client';
import { Topic, TopicHistory } from './types';
import toast from 'react-hot-toast';

/**
 * Fetch active topics (daily circles) - limited to 5
 * @returns Array of active topics
 */
export async function getActiveTopics(): Promise<Topic[]> {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('active', true)
      .limit(5);
      
    if (error) throw error;
    
    return data as unknown as Topic[];
  } catch (error) {
    logger.error('Error fetching active topics:', error);
    toast.error('Failed to load daily topics');
    return [];
  }
}

/**
 * Subscribe to real-time updates for topics
 * @param callback Function to call when topics change
 * @returns Subscription object with cleanup function
 */
export function subscribeToTopics(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('public:topics')
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'topics' }, 
      callback
    )
    .subscribe();
    
  return subscription;
}

/**
 * For admin use only - Manually refresh topics
 * @param apiKey Admin API key for authorization
 * @returns Result of the refresh operation
 */
export async function manuallyRefreshTopics(apiKey: string): Promise<{success: boolean, message: string}> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }
    
    // Call the edge function with authorization
    const response = await fetch(`${supabaseUrl}/functions/v1/refreshTopics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to refresh topics');
    }
    
    toast.success('Topics refreshed successfully');
    return { success: true, message: 'Topics refreshed successfully' };
  } catch (error: any) {
    logger.error('Error refreshing topics:', error);
    toast.error(error.message || 'Failed to refresh topics');
    return { success: false, message: error.message || 'Failed to refresh topics' };
  }
}

/**
 * For admin use only - Get topic history
 * @returns Array of topic history entries
 */
export async function getTopicHistory(): Promise<TopicHistory[]> {
  try {
    const { data, error } = await supabase
      .from('topic_history')
      .select('*')
      .order('used_on', { ascending: false });
      
    if (error) throw error;
    
    return data as unknown as TopicHistory[];
  } catch (error) {
    logger.error('Error fetching topic history:', error);
    toast.error('Failed to load topic history');
    return [];
  }
}

/**
 * For admin use only - Add a new topic
 * @param topic New topic data without id
 * @returns The created topic if successful
 */
export async function addTopic(topic: Omit<Topic, 'id' | 'created_at' | 'active'>): Promise<Topic | null> {
  try {
    const { data, error } = await supabase
      .from('topics')
      .insert([{
        ...topic,
        active: false
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Topic added successfully');
    return data as unknown as Topic;
  } catch (error: any) {
    logger.error('Error adding topic:', error);
    // Handle unique constraint violation
    if (error.code === '23505') {
      toast.error('A topic with this title already exists');
    } else {
      toast.error('Failed to add topic');
    }
    return null;
  }
} 