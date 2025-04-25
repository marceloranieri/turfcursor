import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Message, Reaction, Notification } from '@/lib/types';

interface UseSupabaseRealtimeProps {
  topicId?: string;
  onNewMessage?: (message: Message) => void;
  onUpdateMessage?: (message: Message) => void;
  onNewReaction?: (reaction: Reaction) => void;
  onDeleteReaction?: (reaction: Reaction) => void;
  onNewNotification?: (notification: Notification) => void;
}

export function useSupabaseRealtime({
  topicId,
  onNewMessage,
  onUpdateMessage,
  onNewReaction,
  onDeleteReaction,
  onNewNotification,
}: UseSupabaseRealtimeProps) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscriptions = () => {
      channel = supabase.channel(`room:${topicId}`);

      // Messages subscription
      if (topicId) {
        channel
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `topic_id=eq.${topicId}`,
            },
            (payload) => onNewMessage?.(payload.new as Message)
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'messages',
              filter: `topic_id=eq.${topicId}`,
            },
            (payload) => onUpdateMessage?.(payload.new as Message)
          );
      }

      // Reactions subscription
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'reactions',
          },
          (payload) => onNewReaction?.(payload.new as Reaction)
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'reactions',
          },
          (payload) => onDeleteReaction?.(payload.old as Reaction)
        );

      // Notifications subscription
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => onNewNotification?.(payload.new as Notification)
      );

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to realtime channel');
        }
      });
    };

    setupRealtimeSubscriptions();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [topicId, onNewMessage, onUpdateMessage, onNewReaction, onDeleteReaction, onNewNotification]);
} 