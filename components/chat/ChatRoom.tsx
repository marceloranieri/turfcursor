'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message as MessageComponent } from './Message';
import { Message, Topic } from '@/lib/types';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { GuestAwareChatInput } from './GuestAwareChatInput';
import { FaTimes } from 'react-icons/fa';

interface ChatRoomProps {
  topic: Topic;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ topic }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:profiles(*),
          reactions(*),
          replies:messages(
            *,
            user:profiles(*),
            reactions(*)
          )
        `)
        .eq('topic_id', topic.id)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [topic.id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleNewMessage = (message: Message) => {
    if (message.parent_id) {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === message.parent_id) {
            return {
              ...m,
              replies: [...(m.replies || []), message],
            };
          }
          return m;
        })
      );
    } else {
      setMessages((prev) => [...prev, message]);
    }
  };

  const handleUpdateMessage = (message: Message) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === message.id) {
          return { ...m, ...message };
        } else if (m.replies?.some((r) => r.id === message.id)) {
          return {
            ...m,
            replies: m.replies.map((r) =>
              r.id === message.id ? { ...r, ...message } : r
            ),
          };
        }
        return m;
      })
    );
  };

  useSupabaseRealtime({
    topicId: topic.id,
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessage,
  });

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('messages').insert({
        topic_id: topic.id,
        user_id: user.id,
        content: content.trim(),
        parent_id: replyTo,
      });

      if (error) throw error;

      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (messageId: string) => {
    setReplyTo(messageId);
  };

  return (
    <div className="flex flex-col h-full bg-background-primary">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-background-tertiary">
        <h2 className="text-lg font-semibold text-text-primary">{topic.name}</h2>
        <button
          className="md:hidden button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
          aria-label="Close chat"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            onReply={handleReply}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-background-secondary border-t border-background-tertiary flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Replying to message
          </span>
          <button
            onClick={() => setReplyTo(null)}
            className="button bg-background-tertiary hover:bg-background-secondary text-text-secondary text-sm"
            aria-label="Cancel reply"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat input */}
      <div className="p-4 border-t border-background-tertiary bg-background-primary">
        <GuestAwareChatInput
          onSendMessage={handleSendMessage}
          placeholder="Type a message..."
          className="w-full"
        />
      </div>
    </div>
  );
}; 