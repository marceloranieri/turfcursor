'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Message from './Message';
import { Message as MessageType, Profile } from '@/lib/types/database.types';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import logger from '@/lib/logger';
import GuestAwareChatInput from './GuestAwareChatInput';
import { TopNavigation } from './TopNavigation';
import { MembersList } from './MembersList';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

interface ChatRoomProps {
  circleId: string;
}

export default function ChatRoom({ circleId }: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<Record<string, Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('circle_id', circleId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data as MessageType[]);

      // Fetch user profiles for all message authors
      const userIds = [...new Set(data.map(m => m.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const userMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, Profile>);

      setUsers(userMap);
    } catch (error) {
      logger.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [circleId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to new messages
  useSupabaseRealtime(
    {
      table: 'messages',
      event: '*',
      filter: `circle_id=eq.${circleId}`,
    },
    fetchMessages
  );

  const handleReply = (messageId: string) => {
    // TODO: Implement reply functionality
  };

  const handleReact = async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          content: reaction,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Error adding reaction:', error);
    }
  };

  const handleGeniusAward = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('award_genius', {
        p_message_id: messageId,
        p_from_user_id: user.id,
      });

      if (error) throw error;
    } catch (error) {
      logger.error('Error awarding genius:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-primary">
      <div className="flex-1 flex flex-col">
        <TopNavigation
          title={circleId}
          onMembersClick={() => setIsMembersOpen(true)}
        />

        {/* Messages container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              user={users[message.user_id]}
              onReply={handleReply}
              onReact={handleReact}
              onGeniusAward={handleGeniusAward}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-4 border-t border-background-tertiary bg-background-primary pb-safe">
          <GuestAwareChatInput
            placeholder="Type a message..."
            className="w-full"
          />
        </div>
      </div>

      {/* Members list */}
      <MembersList
        members={Object.values(users)}
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </div>
  );
} 