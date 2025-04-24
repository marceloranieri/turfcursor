'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/auth/AuthContext';
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

  const fetchTopics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching topics:', error);
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
      console.error('Unexpected error fetching topics:', error);
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
        console.error('Error fetching messages:', error);
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
      console.error('Unexpected error fetching messages:', error);
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
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      setInputValue('');
      fetchMessages();
    } catch (error) {
      console.error('Unexpected error sending message:', error);
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
    <DiscordLayout>
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