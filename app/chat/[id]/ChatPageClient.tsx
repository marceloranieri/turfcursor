'use client';

import logger from '@/lib/logger';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ChatArea from '@/components/layout/ChatArea';
import MembersList from '@/components/layout/MembersList';
import MobileNavigation from '@/components/layout/MobileNavigation';
import GuestModal from '@/components/modals/GuestModal';
import { createClient } from '@/lib/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useDebugListeners } from '@/lib/debug-helpers';
import HydrationSafeComponent from '@/components/HydrationSafeComponent';
import { toast } from 'react-hot-toast';
import { Message, Topic, Author, Reaction } from '@/lib/types';
import { sendMessage, loadMoreMessages } from './actions';

// Define the Member type
interface Member {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar: string;
  isBot?: boolean;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
}

// Defined topics with messages for demo purposes
const DEMO_TOPICS: Topic[] = [
  { 
    id: '1', 
    name: 'Remote Work Debate', 
    description: 'Discuss pros and cons of remote work', 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'AI Ethics', 
    description: 'Ethical considerations of AI development', 
    isActive: false 
  },
  { 
    id: '3', 
    name: 'Climate Solutions', 
    description: 'Debating effective climate change solutions', 
    isActive: false 
  },
  { 
    id: '4', 
    name: 'Education Reform', 
    description: 'How to improve educational systems', 
    isActive: false 
  },
  { 
    id: '5', 
    name: 'Cryptocurrency Future', 
    description: 'The future of digital currencies', 
    isActive: false 
  },
];

const DEMO_MEMBERS: Member[] = [
  { id: 'bot1', name: 'Wizard of Mods', role: 'moderator', isBot: true, status: 'online', avatar: 'W' },
  { id: 'user1', name: 'Alice', role: 'owner', status: 'online', avatar: 'A' },
  { id: 'user2', name: 'Bob', role: 'member', status: 'online', avatar: 'B' },
  { id: 'user3', name: 'Charlie', role: 'member', status: 'idle', avatar: 'C' },
  { id: 'user4', name: 'Diana', role: 'member', status: 'dnd', avatar: 'D' },
  { id: 'user5', name: 'Elijah', role: 'member', status: 'offline', avatar: 'E' },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1',
      topic_id: '1',
      author: { id: 'user1', name: 'Alice', avatar: 'A' },
      content: 'Remote work has significantly boosted productivity for many companies. Studies show fewer distractions and better work-life balance.',
      timestamp: 'Today at 12:30 PM',
      is_pinned: false,
      is_wizard: false,
      reactions: [
        { emoji: '👍', count: 3, active: true },
        { emoji: '🤔', count: 1, active: false }
      ],
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'msg2',
      topic_id: '1',
      author: { id: 'user2', name: 'Bob', avatar: 'B' },
      content: '@Alice I agree and would add that it also cuts down on commuting stress and environmental impact.',
      timestamp: 'Today at 12:35 PM',
      is_pinned: false,
      is_wizard: false,
      reactions: [
        { emoji: '✨', count: 2, active: false }
      ],
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'msg3',
      topic_id: '1',
      author: { id: 'bot1', name: 'Wizard of Mods', avatar: 'W', isBot: true },
      content: "Devil's Advocate: Remote work kills team spirit and creative collaboration! In-person brainstorming sessions cannot be replicated virtually.",
      timestamp: 'Today at 12:55 PM',
      is_pinned: false,
      is_wizard: true,
      reactions: [],
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  '2': [
    {
      id: 'msg1',
      topic_id: '2',
      author: { id: 'user2', name: 'Bob', avatar: 'B' },
      content: 'What ethical considerations should guide AI development as it becomes more advanced?',
      timestamp: 'Today at 10:15 AM',
      is_pinned: false,
      is_wizard: false,
      reactions: [
        { emoji: '🤖', count: 4, active: true }
      ],
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'msg2',
      topic_id: '2',
      author: { id: 'user5', name: 'Elijah', avatar: 'E' },
      content: "Transparency is crucial. Users should always know when they're interacting with AI vs humans.",
      timestamp: 'Today at 10:22 AM',
      is_pinned: false,
      is_wizard: false,
      reactions: [],
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

interface PinnedMessage {
  id: string;
  content: string;
}

const DEMO_PINNED_MESSAGES: Record<string, PinnedMessage> = {
  '1': {
    id: 'pin1',
    content: "Remote work has increased productivity in my team by 25%, but we've had to implement new communication strategies to maintain collaboration."
  },
  '2': {
    id: 'pin2',
    content: "AI systems must be developed with ethical considerations built in from the start, not added as an afterthought."
  }
};

interface ChatPageClientProps {
  chatId: string;
  initialChat: any; // TODO: Add proper type
  initialMessages: Message[];
}

interface MessageWithStatus extends Message {
  status?: 'sending' | 'sent' | 'error';
  optimistic?: boolean;
}

export default function ChatPageClient({ chatId, initialChat, initialMessages }: ChatPageClientProps) {
  const router = useRouter();
  
  // Call the debug hook at the component level
  useDebugListeners();
  
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageWithStatus[]>(initialMessages.map(msg => ({ ...msg, status: 'sent' })));
  const [chat, setChat] = useState(initialChat);
  const [isOnline, setIsOnline] = useState(true);
  const supabase = createClient();
  
  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;

    setLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const result = await loadMoreMessages(chatId, oldestMessage.created_at);

      if (!result.success || !result.data) {
        throw new Error('Failed to load more messages');
      }

      if (result.data.length < 20) {
        setHasMore(false);
      }

      setMessages(prev => [...result.data.reverse().map(msg => ({ ...msg, status: 'sent' })), ...prev]);
    } catch (error) {
      logger.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setLoadingMore(false);
    }
  }, [chatId, loadingMore, hasMore, messages]);

  // Memoize sorted messages
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages]);

  // Check authentication with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session) {
          setUser(session.user);
          logger.info("User authenticated:", session.user);
        } else {
          logger.info("No authenticated user");
          setShowGuestModal(true);
        }
      } catch (error) {
        logger.error("Auth error:", error);
        toast.error('Authentication error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setUser(session.user);
      } else {
        setShowGuestModal(true);
      }
    });
    
    // Log some useful debugging information
    logger.info('Chat page loaded:', { chatId, initialChat });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  // Subscribe to new messages and chat updates with reconnection logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const subscribeToChannels = () => {
      try {
        const messagesChannel = supabase
          .channel(`messages:${chatId}`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'messages',
              filter: `chat_id=eq.${chatId}`
            }, 
            (payload) => {
              if (payload.eventType === 'INSERT') {
                // Only add the message if it's not from our optimistic updates
                setMessages(prev => {
                  const exists = prev.some(msg => msg.id === payload.new.id);
                  if (!exists) {
                    return [...prev, { ...payload.new as Message, status: 'sent' }];
                  }
                  return prev.map(msg => 
                    msg.id === payload.new.id ? { ...payload.new as Message, status: 'sent' } : msg
                  );
                });
              } else if (payload.eventType === 'UPDATE') {
                setMessages(prev => prev.map(msg => 
                  msg.id === payload.new.id ? { ...payload.new as Message, status: 'sent' } : msg
                ));
              } else if (payload.eventType === 'DELETE') {
                setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              retryCount = 0;
            }
          });

        const chatChannel = supabase
          .channel(`chat:${chatId}`)
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'chats',
              filter: `id=eq.${chatId}`
            },
            (payload) => {
              if (payload.eventType === 'UPDATE') {
                setChat(payload.new);
              } else if (payload.eventType === 'DELETE') {
                toast.error('This chat has been deleted');
                router.push('/');
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(messagesChannel);
          supabase.removeChannel(chatChannel);
        };
      } catch (error) {
        logger.error('Error in subscription:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
          setTimeout(subscribeToChannels, timeout);
        }
      }
    };

    return subscribeToChannels();
  }, [chatId, router]);
  
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !user) return;

    const optimisticId = `${Date.now()}-${Math.random()}`;
    const newMessage: MessageWithStatus = {
      id: optimisticId,
      content: message.trim(),
      user_id: user.id,
      chat_id: chatId,
      created_at: new Date().toISOString(),
      status: 'sending',
      optimistic: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const result = await sendMessage(chatId, newMessage.content);

      if (!result.success) {
        throw new Error('Failed to send message');
      }

      // The real message will come through the subscription
      // We just need to handle the error case
    } catch (error) {
      logger.error('Error sending message:', error);
      // Mark the message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticId ? { ...msg, status: 'error' } : msg
      ));
      toast.error('Failed to send message. Please try again.');
    }
  }, [user?.id, chatId, message]);
  
  const handleSignIn = async () => {
    try {
      // Store current path for redirect after auth
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterAuth', `/chat/${chatId}`);
      }
      router.push('/auth/signin');
    } catch (error) {
      logger.error('Error signing in:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };
  
  const handleCloseModal = () => {
    setShowGuestModal(false);
  };

  // This useEffect handles form submission and channel navigation
  useEffect(() => {
    // Make channels clickable
    const channels = document.querySelectorAll('.channel-item');
    channels.forEach(channel => {
      channel.addEventListener('click', () => {
        const id = channel.getAttribute('data-id');
        if (id) router.push(`/chat/${id}`);
      });
    });

    // Enable form submission
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage();
      });
    }

    // Cleanup
    return () => {
      channels.forEach(channel => {
        channel.removeEventListener('click', () => {});
      });
      if (form) {
        form.removeEventListener('submit', () => {});
      }
    };
  }, [router, handleSendMessage]);

  const handleMessageReceived = useCallback((newMessage: any) => {
    // Handle the new message
    console.log('New message received:', newMessage);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <HydrationSafeComponent>
      <MainLayout>
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <ChatArea
                messages={sortedMessages}
                chat={chat}
                onSendMessage={handleSendMessage}
                isAuthenticated={isAuthenticated}
                onSignInClick={() => setShowGuestModal(true)}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadingMore={loadingMore}
                isOnline={isOnline}
              />
              <MembersList members={DEMO_MEMBERS} />
            </div>
            <MobileNavigation />
          </div>
        </div>
        <GuestModal
          isOpen={showGuestModal}
          onClose={handleCloseModal}
          onSignIn={handleSignIn}
        />
      </MainLayout>
    </HydrationSafeComponent>
  );
} 