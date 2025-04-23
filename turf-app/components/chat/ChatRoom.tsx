import React, { useState, useEffect, useRef } from 'react';
import { Message as MessageComponent } from './Message';
import { Message, Topic } from '@/lib/types';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { DiscordInput } from '@/components/ui/DiscordInput';
import { DiscordButton } from '@/components/ui/DiscordButton';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, [topic.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
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
  };

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

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('messages').insert({
        topic_id: topic.id,
        user_id: user.id,
        content: newMessage.trim(),
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            onReply={handleReply}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--divider)]">
        {replyTo && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">
              Replying to message
            </span>
            <DiscordButton
              variant="secondary"
              onClick={() => setReplyTo(null)}
              className="!p-1 text-sm"
            >
              Cancel
            </DiscordButton>
          </div>
        )}
        <div className="flex gap-2">
          <DiscordInput
            label=""
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow"
          />
          <DiscordButton
            onClick={handleSendMessage}
            isLoading={isLoading}
            disabled={!newMessage.trim()}
          >
            Send
          </DiscordButton>
        </div>
      </div>
    </div>
  );
}; 