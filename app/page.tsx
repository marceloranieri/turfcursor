'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServerSidebar from '@/components/layout/ServerSidebar';
import ChannelsSidebar from '@/components/layout/ChannelsSidebar';
import ChatArea from '@/components/layout/ChatArea';
import MembersList from '@/components/layout/MembersList';
import MobileNavigation from '@/components/layout/MobileNavigation';
import GuestModal from '@/components/modals/GuestModal';

export default function Home() {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);

  // You would typically get these from your Supabase database
  const dailyTopics = [
    { id: '1', name: 'Remote Work Debate', description: 'Discuss pros and cons of remote work', isActive: true },
    { id: '2', name: 'AI Ethics', description: 'Ethical considerations of AI development', isActive: false },
    { id: '3', name: 'Climate Solutions', description: 'Debating effective climate change solutions', isActive: false },
    { id: '4', name: 'Education Reform', description: 'How to improve educational systems', isActive: false },
    { id: '5', name: 'Cryptocurrency Future', description: 'The future of digital currencies', isActive: false },
  ];

  // Example members - would come from Supabase in a real implementation
  const members = [
    { id: 'bot1', name: 'Wizard of Mods', role: 'Bot', isBot: true, status: 'online', avatar: 'W' },
    { id: 'user1', name: 'Alice', role: 'Debate Leader', status: 'online', avatar: 'A' },
    { id: 'user2', name: 'Bob', status: 'online', avatar: 'B' },
    { id: 'user3', name: 'Charlie', status: 'online', avatar: 'C' },
    { id: 'user4', name: 'Diana', status: 'online', avatar: 'D' },
    { id: 'user5', name: 'Elijah', role: 'New Member', status: 'online', avatar: 'E' },
  ];

  // Example messages - would come from Supabase in a real implementation
  const messages = [
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
  ];

  // Example pinned message - would come from Supabase in a real implementation
  const pinnedMessage = {
    id: 'pin1',
    content: "Remote work has increased productivity in my team by 25%, but we've had to implement new communication strategies to maintain collaboration."
  };

  return (
    <div className="app-container">
      <ServerSidebar />
      <ChannelsSidebar topics={dailyTopics} />
      <ChatArea 
        topic={dailyTopics[0]} 
        messages={messages} 
        pinnedMessage={pinnedMessage}
        onSendMessage={() => setShowGuestModal(true)} 
      />
      <MembersList members={members} />
      <MobileNavigation />
      
      {showGuestModal && (
        <GuestModal onClose={() => setShowGuestModal(false)} />
      )}
    </div>
  );
}
