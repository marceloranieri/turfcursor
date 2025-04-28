'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import logger from '@/lib/logger';

interface RealtimeConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

export function useSupabaseRealtime(config: RealtimeConfig, callback: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: config.event,
          schema: 'public',
          table: config.table,
          filter: config.filter,
        },
        () => {
          callback();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info(`Subscribed to ${config.table} changes`);
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [config, callback]);
} 