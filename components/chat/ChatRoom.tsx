'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message as MessageComponent } from './Message';
import { Message, Topic, User } from '@/lib/types';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { GuestAwareChatInput } from './GuestAwareChatInput';
import { TopNavigation } from './TopNavigation';
import { MembersList } from './MembersList';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

interface ChatRoomProps {
  topic: Topic;
  onOpenSidebar: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ topic, onOpenSidebar }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
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

  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchMembers();
  }, [fetchMessages, fetchMembers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle typing indicator
  const updateTypingStatus = useCallback(
    debounce(async (isTyping: boolean) => {
      if (!user) return;
      try {
        await supabase
          .from('typing_status')
          .upsert({ user_id: user.id, topic_id: topic.id, is_typing: isTyping });
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }, 500),
    [user, topic.id]
  );

  useEffect(() => {
    const channel = supabase
      .channel('typing')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `topic_id=eq.${topic.id}`,
        },
        (payload) => {
          const { user_id, is_typing } = payload.new;
          setTypingUsers((prev) => {
            const next = new Set(prev);
            if (is_typing) {
              next.add(user_id);
            } else {
              next.delete(user_id);
            }
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      updateTypingStatus.cancel();
    };
  }, [topic.id, updateTypingStatus]);

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
      updateTypingStatus(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (messageId: string) => {
    setReplyTo(messageId);
  };

  const handleInputChange = (content: string) => {
    setNewMessage(content);
    updateTypingStatus(content.length > 0);
  };

  const typingIndicator = Array.from(typingUsers)
    .map((userId) => members.find((m) => m.id === userId)?.username)
    .filter((name) => name && name !== user?.username);

  return (
    <div className="flex h-screen bg-background-primary">
      <div className="flex-1 flex flex-col">
        <TopNavigation
          title={topic.name}
          onMenuClick={onOpenSidebar}
          onMembersClick={() => setIsMembersOpen(true)}
        />

        {/* Messages container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MessageComponent
                  message={message}
                  onReply={handleReply}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator */}
        <AnimatePresence>
          {typingIndicator.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 py-2 text-sm text-text-secondary"
            >
              {typingIndicator.length === 1
                ? `${typingIndicator[0]} is typing...`
                : `${typingIndicator.length} people are typing...`}
            </motion.div>
          )}
        </AnimatePresence>

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
              Cancel
            </button>
          </div>
        )}

        {/* Chat input */}
        <div className="p-4 border-t border-background-tertiary bg-background-primary pb-safe">
          <GuestAwareChatInput
            onSendMessage={handleSendMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full"
          />
        </div>
      </div>

      {/* Members list */}
      <MembersList
        members={members}
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </div>
  );
}; 