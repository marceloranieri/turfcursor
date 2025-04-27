import logger from '@/lib/logger';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatArea from '@/components/layout/ChatArea';
import MembersList from '@/components/layout/MembersList';
import MobileNavigation from '@/components/layout/MobileNavigation';
import GuestModal from '@/components/modals/GuestModal';
import { createClient } from '@supabase/supabase-js';
import MainLayout from '@/components/layout/MainLayout';
import { setupDebugListeners } from '@/lib/debug-helpers';
import HydrationSafeComponent from '@/components/HydrationSafeComponent';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
        }
      } catch (error) {
        logger.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
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
    logger.info("Send message triggered");
    
    if (!isAuthenticated) {
      logger.info("User not authenticated, showing guest modal");
      setShowGuestModal(true);
      return;
    }
    
    // In a real app, this would send the message to Supabase
    logger.info('Message sent by user:', user?.id);
  };
  
  const handleSignIn = async () => {
    try {
      // For demo purposes, we'll use direct email link
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/chat/' + topicId
        }
      });
      
      if (error) throw error;
      
      // Modal will be closed by auth state change listener
    } catch (error) {
      logger.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    }
  };
  
  const handleCloseModal = () => {
    setShowGuestModal(false);
  };
  
  // Add a useEffect hook at the top of the component to directly attach event handlers
  useEffect(() => {
    logger.info('ChatPage: Adding click handlers directly');
    
    // Function to make channels clickable
    const makeChannelsClickable = () => {
      const channels = document.querySelectorAll('.channel');
      logger.info('Found channels:', channels.length);
      
      channels.forEach(channel => {
        // Add visual cue
        (channel as HTMLElement).style.cursor = 'pointer';
        
        channel.addEventListener('click', (e) => {
          const nameElement = channel.querySelector('.truncate');
          if (nameElement) {
            const name = nameElement.textContent;
            logger.info('Channel clicked:', name);
            
            if (name) {
              const topics = {
                'Remote Work Debate': '1',
                'AI Ethics': '2',
                'Climate Solutions': '3',
                'Education Reform': '4',
                'Cryptocurrency Future': '5'
              };
              
              const id = topics[name as keyof typeof topics] || '1';
              router.push(`/chat/${id}`);
            }
          }
        });
      });
    };
    
    // Function to make the form work
    const enableForm = () => {
      const form = document.querySelector('form');
      if (form) {
        logger.info('Found form');
        
        // Add an ID to the form if it doesn't have one
        if (!form.id) {
          form.id = 'message-form';
        }
        
        // Check for input field and add ID/name if missing
        const inputField = form.querySelector('.input-field');
        if (inputField) {
          // Add ID and name attributes if missing
          if (!inputField.id) {
            inputField.id = 'message-input';
          }
          if (!inputField.getAttribute('name')) {
            inputField.setAttribute('name', 'message');
          }
          
          logger.info('Added accessibility attributes to form fields');
        }
        
        // Add a submit button if missing
        if (!form.querySelector('button[type="submit"]')) {
          const inputField = form.querySelector('.input-field');
          if (inputField) {
            logger.info('Adding submit button');
            const button = document.createElement('button');
            button.type = 'submit';
            button.textContent = 'Send';
            button.id = 'send-button';
            button.name = 'send';
            button.style.marginLeft = '10px';
            button.style.padding = '0 16px';
            button.style.height = '36px';
            button.style.backgroundColor = '#5865f2';
            button.style.color = 'white';
            button.style.borderRadius = '4px';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            
            inputField.insertAdjacentElement('afterend', button);
          }
        }
        
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          logger.info('Form submitted');
          handleSendMessage();
        });
      }
    };
    
    // Run the handlers with a delay to ensure DOM is ready
    setTimeout(() => {
      makeChannelsClickable();
      enableForm();
    }, 500);
    
    // Run again after a longer delay just to be sure
    setTimeout(() => {
      makeChannelsClickable();
      enableForm();
    }, 2000);
  }, []);
  
  // Add this inside the component, after your other useEffect hooks
  useEffect(() => {
    // Set up debug listeners to help diagnose interaction issues
    setupDebugListeners();
    
    // Log some useful debugging information
    logger.info('Chat page loaded for topic:', topicId);
    logger.info('Authentication status:', isAuthenticated ? 'Logged in' : 'Not logged in');
    
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
        
        if (error) {
          logger.error('Supabase connection error:', error);
        } else {
          logger.info('Supabase connection successful:', data);
        }
      } catch (err) {
        logger.error('Supabase test failed:', err);
      }
    };
    
    testSupabase();
  }, []);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <MainLayout enableDebug={true}>
      <div className="app-container flex">
        <ChatArea 
          topic={currentTopic} 
          messages={messages} 
          pinnedMessage={pinnedMessage}
          onSendMessage={handleSendMessage} 
        />
        <MembersList members={DEMO_MEMBERS} topicId={topicId} />
        <MobileNavigation />
        
        {showGuestModal && (
          <div onClick={handleCloseModal} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div onClick={e => e.stopPropagation()} className="bg-background-secondary rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
              <p className="mb-6">You need to sign in to send messages and interact with the debate.</p>
              <div className="flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 bg-background-tertiary text-text-primary rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-accent-primary text-white rounded"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}