'use client';

import React, { useState, useEffect } from 'react';
import ChatLayout from '../../components/ChatLayout';
import Message from '../../components/Message';
import ChatInput from '../../components/ChatInput';
import { supabase, Message as MessageType, User, Reaction as ReactionType, Circle } from '../../lib/supabase/client';
import { BellIcon } from '@heroicons/react/outline';

// Mock data for development purposes
const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'JaneDoe',
    email: 'jane@example.com',
    created_at: new Date().toISOString(),
    harmony_points: 120,
    genius_awards_received: 5,
    genius_awards_remaining: 2,
    is_debate_maestro: true,
  },
  {
    id: 'user-2',
    username: 'JohnSmith',
    email: 'john@example.com',
    created_at: new Date().toISOString(),
    harmony_points: 85,
    genius_awards_received: 2,
    genius_awards_remaining: 3,
    is_debate_maestro: false,
  },
  {
    id: 'wizard',
    username: 'Wizard of Mods',
    email: 'wizard@turf.app',
    created_at: new Date().toISOString(),
    harmony_points: 0,
    genius_awards_received: 0,
    genius_awards_remaining: 0,
    is_debate_maestro: false,
  }
];

const mockCircles: Circle[] = [
  {
    id: 'circle-1',
    topic: 'Is remote work the future?',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'circle-2',
    topic: 'Should AI be regulated?',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'circle-3',
    topic: 'Blockchain: Revolutionary or overhyped?',
    created_at: new Date().toISOString(),
    is_active: true,
  }
];

const mockMessages: MessageType[] = [
  {
    id: 'msg-1',
    user_id: 'user-1',
    content: 'I think remote work is definitely the future. Companies save on office space and employees save commuting time.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    circle_id: 'circle-1',
    is_pinned: false,
    is_wizard: false,
    upvotes: 5,
    downvotes: 1,
  },
  {
    id: 'msg-2',
    user_id: 'user-2',
    content: 'I disagree. In-person collaboration is essential for creative fields.',
    created_at: new Date(Date.now() - 3400000).toISOString(),
    circle_id: 'circle-1',
    reply_to: 'msg-1',
    is_pinned: false,
    is_wizard: false,
    upvotes: 3,
    downvotes: 2,
  },
  {
    id: 'msg-3',
    user_id: 'wizard',
    content: 'Have you considered that hybrid models might offer the best of both worlds?',
    created_at: new Date(Date.now() - 3200000).toISOString(),
    circle_id: 'circle-1',
    is_pinned: true,
    is_wizard: true,
    upvotes: 8,
    downvotes: 0,
  },
  {
    id: 'msg-4',
    user_id: 'user-1',
    content: 'That\'s a good point. Hybrid models allow for flexible schedules while maintaining some in-person collaboration.',
    created_at: new Date(Date.now() - 3000000).toISOString(),
    circle_id: 'circle-1',
    reply_to: 'msg-3',
    is_pinned: false,
    is_wizard: false,
    upvotes: 6,
    downvotes: 0,
  }
];

const mockReactions: ReactionType[] = [
  {
    id: 'reaction-1',
    message_id: 'msg-1',
    user_id: 'user-2',
    type: 'emoji',
    content: '👍',
    created_at: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'reaction-2',
    message_id: 'msg-3',
    user_id: 'user-1',
    type: 'emoji',
    content: '🎉',
    created_at: new Date(Date.now() - 3100000).toISOString(),
  },
  {
    id: 'reaction-3',
    message_id: 'msg-3',
    user_id: 'user-2',
    type: 'emoji',
    content: '👏',
    created_at: new Date(Date.now() - 3000000).toISOString(),
  }
];

export default function Chat() {
  const [activeCircleId, setActiveCircleId] = useState<string>('circle-1');
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [users, setUsers] = useState<{[key: string]: User}>(
    mockUsers.reduce((acc, user) => ({...acc, [user.id]: user}), {})
  );
  const [reactions, setReactions] = useState<ReactionType[]>(mockReactions);
  const [circles, setCircles] = useState<Circle[]>(mockCircles);
  const [replyToId, setReplyToId] = useState<string | undefined>();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // For demo, assume authenticated
  
  // Filter messages for the current circle
  const currentCircleMessages = messages.filter(msg => msg.circle_id === activeCircleId);
  
  // Get pinned message if any
  const pinnedMessage = currentCircleMessages.find(msg => msg.is_pinned);
  
  const handleSendMessage = (content: string, type: 'text' | 'gif') => {
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      user_id: 'user-1', // Current user
      content,
      created_at: new Date().toISOString(),
      circle_id: activeCircleId,
      reply_to: replyToId,
      is_pinned: false,
      is_wizard: false,
      upvotes: 0,
      downvotes: 0,
    };
    
    setMessages([...messages, newMessage]);
    if (replyToId) {
      setReplyToId(undefined);
    }
    
    // In a real app, you would use Supabase to save the message
    // supabase.from('messages').insert([newMessage]).then(...)
  };
  
  const handleReaction = (messageId: string, reaction: string) => {
    // Check if the user already reacted with this emoji
    const existingReaction = reactions.find(
      r => r.message_id === messageId && r.user_id === 'user-1' && r.content === reaction
    );
    
    if (existingReaction) {
      // Remove reaction if it exists
      setReactions(reactions.filter(r => r.id !== existingReaction.id));
    } else {
      // Add new reaction
      const newReaction: ReactionType = {
        id: `reaction-${Date.now()}`,
        message_id: messageId,
        user_id: 'user-1', // Current user
        type: 'emoji',
        content: reaction,
        created_at: new Date().toISOString(),
      };
      
      setReactions([...reactions, newReaction]);
      
      // In a real app, you would use Supabase to save the reaction
      // supabase.from('reactions').insert([newReaction]).then(...)
    }
  };
  
  const handleGeniusAward = (messageId: string) => {
    // Check if user has any genius awards left
    const currentUser = users['user-1'];
    if (currentUser.genius_awards_remaining <= 0) {
      alert('You have no Genius Awards remaining today.');
      return;
    }
    
    // Update the user's remaining awards
    setUsers({
      ...users,
      'user-1': {
        ...currentUser,
        genius_awards_remaining: currentUser.genius_awards_remaining - 1,
      }
    });
    
    // Get the message author
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    const authorId = message.user_id;
    const author = users[authorId];
    
    // Update the author's received awards
    setUsers({
      ...users,
      [authorId]: {
        ...author,
        genius_awards_received: author.genius_awards_received + 1,
        is_debate_maestro: author.genius_awards_received + 1 >= 10,
      }
    });
    
    // In a real app, you would use Supabase transactions to update both users
  };
  
  // Simulate Wizard of Mods activity during chat lulls
  useEffect(() => {
    const lullTimer = setTimeout(() => {
      // If no message in the last minute, have Wizard of Mods chime in
      const lastMessage = currentCircleMessages[currentCircleMessages.length - 1];
      const now = new Date();
      const lastMessageTime = new Date(lastMessage.created_at);
      
      if ((now.getTime() - lastMessageTime.getTime()) > 20000) { // 20 seconds for demo
        const wizardMessages = [
          "What about looking at this from another angle?",
          "Playing devil's advocate here: what if the opposite were true?",
          "Let's challenge our assumptions for a moment.",
          "How would this work in a completely different context?",
          "What's a counterintuitive outcome that might result from this?"
        ];
        
        const randomMessage = wizardMessages[Math.floor(Math.random() * wizardMessages.length)];
        
        const wizardMessage: MessageType = {
          id: `msg-${Date.now()}`,
          user_id: 'wizard',
          content: randomMessage,
          created_at: new Date().toISOString(),
          circle_id: activeCircleId,
          is_pinned: false,
          is_wizard: true,
          upvotes: 0,
          downvotes: 0,
        };
        
        setMessages([...messages, wizardMessage]);
      }
    }, 20000); // 20 seconds for demo
    
    return () => clearTimeout(lullTimer);
  }, [messages, activeCircleId, currentCircleMessages]);
  
  // Simulate Pincredible feature (pin most engaged message every 5 minutes)
  useEffect(() => {
    const pincredibleTimer = setInterval(() => {
      // Find message with most engagement (upvotes + replies)
      const messageEngagement = currentCircleMessages.map(msg => {
        const repliesCount = currentCircleMessages.filter(m => m.reply_to === msg.id).length;
        const reactionsCount = reactions.filter(r => r.message_id === msg.id).length;
        return {
          messageId: msg.id,
          score: msg.upvotes + repliesCount + reactionsCount,
        };
      });
      
      messageEngagement.sort((a, b) => b.score - a.score);
      
      if (messageEngagement.length > 0 && messageEngagement[0].score > 0) {
        // Unpin any currently pinned messages
        setMessages(messages.map(msg => ({
          ...msg,
          is_pinned: msg.id === messageEngagement[0].messageId,
        })));
      }
    }, 5 * 60 * 1000); // 5 minutes in real app, shorter for demo
    
    return () => clearInterval(pincredibleTimer);
  }, [messages, activeCircleId, currentCircleMessages, reactions]);
  
  return (
    <ChatLayout
      circles={circles}
      activeCircleId={activeCircleId}
      onCircleChange={setActiveCircleId}
      isAuthenticated={isAuthenticated}
      username={users['user-1'].username}
      harmonyPoints={users['user-1'].harmony_points}
      isDebateMaestro={users['user-1'].is_debate_maestro}
      geniusAwardsRemaining={users['user-1'].genius_awards_remaining}
      notifications={[]}
    >
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b border-background-tertiary flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {circles.find(c => c.id === activeCircleId)?.topic}
            </h2>
            <p className="text-text-secondary text-sm">
              {currentCircleMessages.length} messages
            </p>
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-background-tertiary text-text-secondary hover:text-text-primary"
            onClick={() => {/* Show notifications */}}
          >
            <BellIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Pinned message */}
        {pinnedMessage && (
          <div className="px-4 py-2 bg-background-secondary border-b border-background-tertiary">
            <div className="pinned-message">
              <div className="flex items-center mb-2">
                <span className="text-accent-primary font-semibold">Pinned Message</span>
                <span className="ml-2 text-text-secondary text-xs">Most engaging message right now</span>
              </div>
              <p className="text-text-primary">{pinnedMessage.content}</p>
              <div className="text-text-secondary text-xs mt-1">
                By {users[pinnedMessage.user_id].username}
              </div>
            </div>
          </div>
        )}
        
        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentCircleMessages.map(message => {
            const messageUser = users[message.user_id];
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
          })}
        </div>
        
        {/* Chat input */}
        <div className="mt-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            replyingTo={replyToId}
            onCancelReply={() => setReplyToId(undefined)}
            isAuthenticated={isAuthenticated}
            onAuthPrompt={() => setShowAuthModal(true)}
          />
        </div>
        
        {/* Mobile spacing for bottom nav */}
        <div className="h-16 md:hidden" />
      </div>
      
      {/* Authentication modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background-secondary rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Sign in to continue</h2>
            <p className="mb-6 text-text-secondary">
              You need to sign in or create an account to participate in discussions.
            </p>
            <div className="space-y-4">
              <button 
                className="button-primary w-full"
                onClick={() => {
                  setIsAuthenticated(true);
                  setShowAuthModal(false);
                }}
              >
                Sign In
              </button>
              <button 
                className="button-secondary w-full"
                onClick={() => {
                  /* Navigate to signup page */
                  setShowAuthModal(false);
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </ChatLayout>
  );
} 