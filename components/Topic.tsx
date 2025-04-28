'use client';

import logger from '@/lib/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';
import DiscordLayout from './layout/DiscordLayout';
import DiscordMessage from './messages/DiscordMessage';

interface TopicMessage {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    isActive?: boolean;
  }>;
  isPinned?: boolean;
}

interface Circle {
  id: string;
  topic: string;
  created_at: string;
  is_active: boolean;
}

export default function Topic() {
  const [messages, setMessages] = useState<TopicMessage[]>([]);
  const [topics, setTopics] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    isActive?: boolean;
  }>>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [activeCircleId, setActiveCircleId] = useState<string>('1');
  const [circles, setCircles] = useState<Circle[]>([]);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general';
    message: string;
    wizNote?: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  // Fetch circles and notifications
  const fetchCirclesAndNotifications = useCallback(async () => {
    try {
      // Fetch circles
      const { data: circlesData, error: circlesError } = await supabase
        .from('circles')
        .select('*')
        .order('created_at', { ascending: false });

      if (circlesError) throw circlesError;
      setCircles(circlesData || []);

      // Set initial active circle if none selected
      if (!activeCircleId && circlesData?.length > 0) {
        setActiveCircleId(circlesData[0].id);
      }

      // Fetch notifications if user is authenticated
      if (user) {
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsError) throw notificationsError;

        // Transform notifications to match the expected format
        const transformedNotifications = (notificationsData || []).map(notification => ({
          id: notification.id,
          type: notification.type as 'harmony_points' | 'genius_award' | 'pinned' | 'wizard' | 'general',
          message: notification.content,
          timestamp: new Date(notification.created_at),
          read: notification.is_read
        }));

        setNotifications(transformedNotifications);
      }
    } catch (error) {
      logger.error('Error fetching circles and notifications:', error);
      toast.error('Failed to load circles and notifications');
    }
  }, [user, activeCircleId]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase.channel('circles-and-notifications');

    // Subscribe to circle changes
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'circles' }, () => {
        fetchCirclesAndNotifications();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchCirclesAndNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCirclesAndNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchCirclesAndNotifications();
  }, [fetchCirclesAndNotifications]);

  const fetchTopics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching topics:', error);
        toast.error('Failed to load topics');
        return;
      }

      const mappedTopics = data?.map((topic: any) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        isActive: topic.id === currentTopic
      })) || [];

      setTopics(mappedTopics);
      if (!currentTopic && mappedTopics.length > 0) {
        setCurrentTopic(mappedTopics[0].id);
      }
    } catch (error) {
      logger.error('Unexpected error fetching topics:', error);
      toast.error('An unexpected error occurred while loading topics');
    }
  }, [currentTopic]);

  const fetchMessages = useCallback(async () => {
    if (!currentTopic) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('topic_id', currentTopic)
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        return;
      }

      const mappedMessages = data?.map((message: any) => ({
        id: message.id,
        content: message.content,
        author: {
          name: message.profiles?.username || 'Anonymous',
          avatar: message.profiles?.avatar_url || '/default-avatar.svg'
        },
        timestamp: new Date(message.created_at).toISOString(),
        isPinned: message.is_pinned || false,
        reactions: message.reactions || []
      })) || [];

      setMessages(mappedMessages);
    } catch (error) {
      logger.error('Unexpected error fetching messages:', error);
      toast.error('An unexpected error occurred while loading messages');
    } finally {
      setLoading(false);
    }
  }, [currentTopic]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentTopic || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: inputValue.trim(),
          topic_id: currentTopic,
          user_id: user.id,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      setInputValue('');
      fetchMessages();
    } catch (error) {
      logger.error('Unexpected error sending message:', error);
      toast.error('An unexpected error occurred while sending message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setCurrentTopic(topicId);
  };

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <DiscordLayout
      circles={circles}
      activeCircleId={activeCircleId}
      onCircleChange={setActiveCircleId}
      isAuthenticated={!!user}
      notifications={notifications}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            messages.map((message) => (
              <DiscordMessage key={message.id} message={message} />
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || !user}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </DiscordLayout>
  );
} 