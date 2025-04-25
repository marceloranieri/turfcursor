'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ServerSidebar from '@/components/layout/ServerSidebar';
import ChannelsSidebar from '@/components/layout/ChannelsSidebar';
import ChatArea from '@/components/layout/ChatArea';
import MembersList from '@/components/layout/MembersList';
import MobileNavigation from '@/components/layout/MobileNavigation';
import GuestModal from '@/components/modals/GuestModal';

// Defined topics with messages for demo purposes
// In a real app, this would come from Supabase
const DEMO_TOPICS = [
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

const DEMO_MEMBERS = [
  { id: 'bot1', name: 'Wizard of Mods', role: 'Bot', isBot: true, status: 'online', avatar: 'W' },
  { id: 'user1', name: 'Alice', role: 'Debate Leader', status: 'online', avatar: 'A' },
  { id: 'user2', name: 'Bob', status: 'online', avatar: 'B' },
  { id: 'user3', name: 'Charlie', status: 'online', avatar: 'C' },
  { id: 'user4', name: 'Diana', status: 'online', avatar: 'D' },
  { id: 'user5', name: 'Elijah', role: 'New Member', status: 'online', avatar: 'E' },
];

// Demo messages for each topic
const DEMO_MESSAGES = {
  '1': [
    {
      id: 'msg1',
      author: { id: 'user1', name: 'Alice', avatar: 'A' },
      content: 'Remote work has significantly boosted productivity for many companies. Studies show fewer distractions and better work-life balance.',
      timestamp: 'Today at 12:30 PM',
      reactions: [
        { emoji: '👍', count: 3, active: true },
        { emoji: '🤔', count: 1, active: false }
      ]
    },
    {
      id: 'msg2',
      author: { id: 'user2', name: 'Bob', avatar: 'B' },
      content: '@Alice I agree and would add that it also cuts down on commuting stress and environmental impact.',
      timestamp: 'Today at 12:35 PM',
      reactions: [
        { emoji: '✨', count: 2, active: false }
      ]
    },
    {
      id: 'msg3',
      author: { id: 'bot1', name: 'Wizard of Mods', avatar: 'W', isBot: true },
      content: "Devil's Advocate: Remote work kills team spirit and creative collaboration! In-person brainstorming sessions cannot be replicated virtually.",
      timestamp: 'Today at 12:55 PM',
      isBot: true
    },
    {
      id: 'msg4',
      author: { id: 'user3', name: 'Charlie', avatar: 'C' },
      content: "Remote work isn't a one-size-fits-all solution. Some roles require physical presence, while others thrive remotely. Hybrid approaches might be the future.",
      timestamp: 'Today at 1:02 PM',
      reactions: [
        { emoji: '🧠', count: 5, active: false },
        { emoji: '✨', count: 3, active: true }
      ],
      replies: [
        {
          id: 'reply1',
          author: { id: 'user4', name: 'Diana', avatar: 'D' },
          content: 'Great point! My company lets teams decide their own work arrangements based on their specific needs.',
          timestamp: 'Today at 1:05 PM'
        },
        {
          id: 'reply2',
          author: { id: 'user5', name: 'Elijah', avatar: 'E' },
          content: 'Does anyone have data on productivity differences between hybrid vs fully remote teams?',
          timestamp: 'Today at 1:07 PM'
        }
      ]
    },
    {
      id: 'msg5',
      author: { id: 'user4', name: 'Diana', avatar: 'D' },
      content: 'Me trying to focus during a home video call when my kids are around:',
      timestamp: 'Today at 1:15 PM',
      attachment: {
        type: 'image',
        url: 'https://via.placeholder.com/400x220',
        alt: 'Funny work from home GIF'
      },
      reactions: [
        { emoji: '😂', count: 8, active: false }
      ]
    }
  ],
  '2': [
    {
      id: 'msg1',
      author: { id: 'user2', name: 'Bob', avatar: 'B' },
      content: 'What ethical considerations should guide AI development as it becomes more advanced?',
      timestamp: 'Today at 10:15 AM',
      reactions: [
        { emoji: '🤖', count: 4, active: true }
      ]
    },
    {
      id: 'msg2',
      author: { id: 'user5', name: 'Elijah', avatar: 'E' },
      content: "Transparency is crucial. Users should always know when they're interacting with AI vs humans.",
      timestamp: 'Today at 10:22 AM'
    }
  ]
};

// Pinned messages for topics
const DEMO_PINNED_MESSAGES = {
  '1': {
    id: 'pin1',
    content: "Remote work has increased productivity in my team by 25%, but we've had to implement new communication strategies to maintain collaboration."
  },
  '2': {
    id: 'pin2',
    content: "AI systems must be developed with ethical considerations built in from the start, not added as an afterthought."
  }
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params?.id as string;
  
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // In a real app, this would check authentication with Supabase
  useEffect(() => {
    // Simulate checking auth
    const checkAuth = () => {
      // For demo: localStorage method
      const hasAuth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(hasAuth === 'true');
    };
    
    checkAuth();
  }, []);
  
  // Find the current topic
  const currentTopic = DEMO_TOPICS.find(topic => topic.id === topicId) || DEMO_TOPICS[0];
  
  // Set the current topic as active and others as inactive
  const topics = DEMO_TOPICS.map(topic => ({
    ...topic,
    isActive: topic.id === topicId
  }));
  
  // Get messages for the current topic
  const messages = DEMO_MESSAGES[topicId as keyof typeof DEMO_MESSAGES] || [];
  
  // Get pinned message for the current topic
  const pinnedMessage = DEMO_PINNED_MESSAGES[topicId as keyof typeof DEMO_PINNED_MESSAGES];
  
  const handleSendMessage = () => {
    if (!isAuthenticated) {
      setShowGuestModal(true);
      return;
    }
    
    // In a real app, this would send the message to Supabase
    console.log('Message sent');
  };
  
  const handleSignIn = () => {
    // Simulate sign in for demo
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    setShowGuestModal(false);
  };
  
  const handleCloseModal = () => {
    setShowGuestModal(false);
  };
  
  return (
    <div className="app-container">
      <ServerSidebar />
      <ChannelsSidebar topics={topics} />
      <ChatArea 
        topic={currentTopic} 
        messages={messages} 
        pinnedMessage={pinnedMessage}
        onSendMessage={handleSendMessage} 
      />
      <MembersList members={DEMO_MEMBERS} />
      <MobileNavigation />
      
      {showGuestModal && (
        <GuestModal 
          onClose={handleCloseModal}
          onSignIn={handleSignIn}
        />
      )}
    </div>
  );
} 