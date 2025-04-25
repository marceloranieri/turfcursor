'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopicCard from '@/components/TopicCard';

export default function Home() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  
  // This would typically check actual auth state and user history
  useEffect(() => {
    // Check if this is the first time user has visited (would use cookies or local storage)
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsNewUser(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // If new user, redirect to onboarding
  useEffect(() => {
    if (isNewUser) {
      router.push('/onboarding');
    }
  }, [isNewUser, router]);

  // Example topics - would come from Supabase in a real implementation
  const topics = [
    { 
      id: '1', 
      name: 'Remote Work Debate', 
      description: 'Discuss pros and cons of remote work',
      category: 'Workplace',
      participants: 28,
      lastActivity: '2 min ago'
    },
    { 
      id: '2', 
      name: 'AI Ethics', 
      description: 'Ethical considerations of AI development',
      category: 'Technology',
      participants: 45,
      lastActivity: '5 min ago'
    },
    { 
      id: '3', 
      name: 'Climate Solutions', 
      description: 'Debating effective climate change solutions',
      category: 'Environment',
      participants: 32,
      lastActivity: 'Just now'
    },
    { 
      id: '4', 
      name: 'Education Reform', 
      description: 'How to improve educational systems',
      category: 'Society',
      participants: 19,
      lastActivity: '12 min ago'
    },
    { 
      id: '5', 
      name: 'Cryptocurrency Future', 
      description: 'The future of digital currencies',
      category: 'Finance',
      participants: 37,
      lastActivity: '3 min ago'
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Today's Debate Circles</h1>
        <p className="text-text-secondary">Join one of today's active topics - refreshed daily at 00:00 UTC</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <TopicCard 
            key={topic.id}
            topic={topic}
            onClick={() => router.push(`/chat/${topic.id}`)}
          />
        ))}
      </div>

      <script src="/direct-fix.js"></script>
    </div>
  );
}
