'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DiscordLayout from '@/components/layout/DiscordLayout';
import Message from '@/components/Message';
import ChatInput from '@/components/ChatInput';
import { Message as MessageType, Reaction as ReactionType, Circle } from '@/lib/supabase/client';
import { User } from '@/types/supabase';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  getCircles, 
  getMessages, 
  getReactions, 
  sendMessage, 
  addReaction,
  giveGeniusAward, 
  getCurrentUser
} from '@/lib/database/apiHelpers';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [activeCircleId, setActiveCircleId] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<{[key: string]: User}>({});
  const [reactions, setReactions] = useState<ReactionType[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [replyToId, setReplyToId] = useState<string | undefined>();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Load user data
  const loadUserData = useCallback(async () => {
    const user = await getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setUsers(prev => ({ ...prev, [user.id]: user }));
    }
  }, []);

  // Load circle data
  const loadCircleData = useCallback(async (circleId: string) => {
    setIsDataLoading(true);
    try {
      const messagesData = await getMessages(circleId);
      setMessages(messagesData);
      
      const messageIds = messagesData.map(msg => msg.id);
      const reactionsData = await getReactions(messageIds);
      setReactions(reactionsData);
      
      const userIds = new Set<string>();
      messagesData.forEach(msg => userIds.add(msg.user_id));
      reactionsData.forEach(reaction => userIds.add(reaction.user_id));
      
      const usersObj: { [key: string]: User } = {};
      for (const userId of userIds) {
        const { data } = await fetch(`/api/users/${userId}`).then(res => res.json());
        if (data) {
          usersObj[userId] = data;
        }
      }
      
      setUsers(prev => ({ ...prev, ...usersObj }));
    } catch (error) {
      console.error("Error loading circle data:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const circlesData = await getCircles();
      setCircles(circlesData);
      
      if (circlesData.length > 0 && !activeCircleId) {
        setActiveCircleId(circlesData[0].id);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, [activeCircleId]);

  // Auth state effect
  useEffect(() => {
    if (!isLoading) {
      setIsAuthenticated(!!session);
      
      if (session) {
        loadUserData();
      }
    }
  }, [session, isLoading, loadUserData]);
  
  // Initial data load effect
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Active circle effect
  useEffect(() => {
    if (activeCircleId) {
      loadCircleData(activeCircleId);
    }
  }, [activeCircleId, loadCircleData]);

  // Message handlers
  const handleSendMessage = async (content: string, type: 'text' | 'gif') => {
    if (!currentUser || !activeCircleId) return;
    
    try {
      const newMessage = await sendMessage({
        user_id: currentUser.id,
        content,
        circle_id: activeCircleId,
        reply_to: replyToId,
        is_pinned: false,
        is_wizard: false,
        upvotes: 0,
        downvotes: 0,
      });
      
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        if (replyToId) {
          setReplyToId(undefined);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleReaction = async (messageId: string, reaction: string) => {
    if (!currentUser) return;
    
    try {
      await addReaction({
        message_id: messageId,
        user_id: currentUser.id,
        type: 'emoji',
        content: reaction,
      });
      
      const messageIds = messages.map(msg => msg.id);
      const reactionsData = await getReactions(messageIds);
      setReactions(reactionsData);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };
  
  const handleGeniusAward = async (messageId: string) => {
    if (!currentUser) return;
    
    try {
      const success = await giveGeniusAward(messageId);
      
      if (success) {
        await loadUserData();
        
        const message = messages.find(m => m.id === messageId);
        if (message) {
          const { data } = await fetch(`/api/users/${message.user_id}`).then(res => res.json());
          if (data) {
            setUsers(prev => ({ ...prev, [message.user_id]: data }));
          }
        }
      } else {
        alert('Failed to give Genius Award. You may not have any awards remaining.');
      }
    } catch (error) {
      console.error("Error giving genius award:", error);
    }
  };

  // Derived state
  const currentCircleMessages = messages.filter(msg => msg.circle_id === activeCircleId);
  const pinnedMessage = currentCircleMessages.find(msg => msg.is_pinned);

  // Auth checks
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }
  
  return (
    <DiscordLayout
      circles={circles}
      activeCircleId={activeCircleId}
      onCircleChange={setActiveCircleId}
      isAuthenticated={!!currentUser}
      username={currentUser?.user_metadata?.full_name || 'Guest'}
      harmonyPoints={currentUser?.user_metadata?.harmony_points || 0}
      isDebateMaestro={currentUser?.user_metadata?.is_debate_maestro || false}
      geniusAwardsRemaining={currentUser?.user_metadata?.genius_awards_remaining || 0}
      notifications={[]} // In a real app, you'd fetch notifications here
    >
      <div className="flex flex-col h-full bg-background">
        {isDataLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-background-tertiary flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {circles.find(c => c.id === activeCircleId)?.topic || 'Select a circle'}
                </h2>
                <p className="text-text-secondary text-sm">
                  {currentCircleMessages.length} messages
                </p>
              </div>
              
              <button 
                className="p-2 rounded-full hover:bg-background-tertiary text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => {/* Show notifications */}}
              >
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Pinned message */}
            {pinnedMessage && users[pinnedMessage.user_id] && (
              <div className="px-4 py-2 bg-background-secondary/50 border-b border-accent-primary border-opacity-50">
                <div className="pinned-message">
                  <div className="flex items-center mb-2">
                    <span className="text-accent-primary font-semibold">📌 Pinned Message</span>
                    <span className="ml-2 text-text-secondary text-xs">Most engaging message right now</span>
                  </div>
                  <p className="text-text-primary">{pinnedMessage.content}</p>
                  <div className="text-text-secondary text-xs mt-1">
                    By {(users[pinnedMessage.user_id] as any)?.user_metadata?.full_name || 'Unknown User'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentCircleMessages.length === 0 ? (
                <div className="text-center text-text-secondary py-8">
                  No messages yet. Be the first to start the conversation!
                </div>
              ) : (
                currentCircleMessages.map(message => {
                  const messageUser = users[message.user_id];
                  if (!messageUser) return null; // Skip if user data not loaded
                  
                  const messageReactions = reactions.filter(r => r.message_id === message.id);
                  const replyToMessage = message.reply_to 
                    ? messages.find(m => m.id === message.reply_to) 
                    : undefined;
                  
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      user={messageUser}
                      reactions={messageReactions}
                      replyTo={replyToMessage}
                      onReply={(id) => setReplyToId(id)}
                      onReact={handleReaction}
                      onGeniusAward={handleGeniusAward}
                      isWizardMessage={message.is_wizard}
                      isPinned={message.is_pinned}
                    />
                  );
                })
              )}
            </div>
            
            {/* Chat input */}
            <div className="mt-auto border-t border-background-tertiary p-4">
              <ChatInput
                onSendMessage={handleSendMessage}
                replyingTo={replyToId}
                onCancelReply={() => setReplyToId(undefined)}
                isAuthenticated={!!currentUser}
                onAuthPrompt={() => setShowAuthModal(true)}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Authentication modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-background-secondary rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Sign in to continue</h2>
            <p className="mb-6 text-text-secondary">
              You need to sign in or create an account to participate in discussions.
            </p>
            <div className="space-y-4">
              <Link 
                href="/auth/signin"
                className="block w-full button-primary text-center"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="block w-full button-secondary text-center"
              >
                Create Account
              </Link>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DiscordLayout>
  );
} 