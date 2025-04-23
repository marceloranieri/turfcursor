import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../lib/auth/AuthContext';
import toast from 'react-hot-toast';
import DiscordLayout from './layout/DiscordLayout';
import DiscordMessage from './messages/DiscordMessage';

interface TopicMessage {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
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

      if (error) throw error;

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
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
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

      if (error) throw error;

      const mappedMessages = data?.map((message: any) => ({
        id: message.id,
        content: message.content,
        author: {
          name: message.profiles?.username || 'Anonymous',
          avatar: message.profiles?.avatar_url
        },
        timestamp: new Date(message.created_at),
        isPinned: message.is_pinned || false,
        reactions: message.reactions || []
      })) || [];

      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [currentTopic]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    if (currentTopic) {
      fetchMessages();
    }
  }, [currentTopic, fetchMessages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !user || !currentTopic) return;

    try {
      const newMessage = {
        content: inputValue.trim(),
        topic_id: currentTopic,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();

      if (error) throw error;

      if (data) {
        const mappedMessage = {
          id: data[0].id,
          content: data[0].content,
          author: {
            name: user.email?.split('@')[0] || 'Anonymous',
            avatar: user.user_metadata?.avatar_url
          },
          timestamp: new Date(data[0].created_at),
          reactions: []
        };

        setMessages([...messages, mappedMessage]);
        setInputValue('');
        toast.success('Message sent!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
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
    setTopics(topics.map(topic => ({
      ...topic,
      isActive: topic.id === topicId
    })));
  };

  const currentTopicData = topics.find(topic => topic.id === currentTopic);

  return (
    <DiscordLayout
      topics={topics}
      currentUser={user ? {
        name: user.email?.split('@')[0] || 'Anonymous',
        avatar: user.user_metadata?.avatar_url,
        status: 'Online'
      } : undefined}
      onTopicSelect={handleTopicSelect}
    >
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-hash">#</div>
        <div className="chat-header-topic">
          {currentTopicData?.title || 'Select a Topic'}
          {currentTopicData?.description && (
            <div className="chat-header-description">{currentTopicData.description}</div>
          )}
        </div>
        <div className="chat-header-actions">
          <div className="header-action">📌</div>
          <div className="header-action">👥</div>
          <div className="header-action">🔍</div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-2">💭</div>
            <div>No messages yet</div>
          </div>
        ) : (
          messages.map(message => (
            <DiscordMessage
              key={message.id}
              author={message.author}
              content={message.content}
              timestamp={message.timestamp}
              reactions={message.reactions}
              isPinned={message.isPinned}
            />
          ))
        )}
      </div>

      {/* Input Area */}
      {user ? (
        <div className="input-container">
          <div className="input-actions">
            <div className="input-action">+</div>
            <div className="input-action">GIF</div>
          </div>
          <input
            type="text"
            className="input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${currentTopicData?.title || 'Select a Topic'}`}
          />
          <div className="input-buttons">
            <div className="input-action">😊</div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-4 bg-gray-800">
          <button
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary"
          >
            Sign In to Join the Discussion
          </button>
        </div>
      )}
    </DiscordLayout>
  );
} 