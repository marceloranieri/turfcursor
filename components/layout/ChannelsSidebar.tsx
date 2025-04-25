import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Topic {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ChannelsSidebarProps {
  topics: Topic[];
}

const ChannelsSidebar = ({ topics }: ChannelsSidebarProps) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>(topics);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);
  
  // Subscribe to topic changes
  useEffect(() => {
    setAvailableTopics(topics);
    
    const channel = supabase
      .channel('public:topics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'topics'
      }, (payload) => {
        // Refresh topics
        fetchTopics();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [topics]);
  
  // Fetch topics from Supabase
  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Transform to match our Topic interface
        const transformedTopics = data.map(topic => ({
          id: topic.id,
          name: topic.name,
          description: topic.description || '',
          isActive: false // Will be set by the parent component
        }));
        
        // Preserve the active state from the current topics
        const updatedTopics = transformedTopics.map(newTopic => {
          const matchingTopic = availableTopics.find(t => t.id === newTopic.id);
          return {
            ...newTopic,
            isActive: matchingTopic ? matchingTopic.isActive : false
          };
        });
        
        setAvailableTopics(updatedTopics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };
  
  const handleTopicClick = (id: string) => {
    router.push(`/chat/${id}`);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Focus search input when showing
      setTimeout(() => {
        const searchInput = document.getElementById('channel-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };
  
  const handleServerDropdown = () => {
    setShowServerDropdown(!showServerDropdown);
  };
  
  const handleAddTopic = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add a topic');
      return;
    }
    
    // Get a simple topic name from the user
    const topicName = prompt('Enter a topic name:');
    if (!topicName || !topicName.trim()) return;
    
    const topicDescription = prompt('Enter a topic description:');
    
    try {
      // Create the topic in Supabase
      const { data, error } = await supabase
        .from('topics')
        .insert([
          { 
            name: topicName.trim(), 
            description: topicDescription?.trim() || '',
            created_by: (await supabase.auth.getUser()).data.user?.id,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Navigate to the new topic
        router.push(`/chat/${data[0].id}`);
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('Failed to create topic. Please try again.');
    }
  };
  
  const handleAddChannel = () => {
    // In a real app, this would open a modal to add a new channel
    alert('Add channel functionality would open a form here');
  };
  
  // Filter topics based on search query
  const filteredTopics = searchQuery
    ? availableTopics.filter(topic => 
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTopics;
  
  return (
    <div className="channels-sidebar bg-background-secondary w-60 h-screen overflow-y-auto fixed left-[72px] top-0">
      {/* Server Header */}
      <div className="server-header border-b border-background-tertiary p-4 flex justify-between items-center">
        <div className="server-header-name text-white font-bold text-lg">Turf</div>
        <div 
          className="server-dropdown text-gray-400 cursor-pointer hover:text-white transition-colors"
          onClick={handleServerDropdown}
        >
          ▼
        </div>
      </div>
      
      {/* Server Dropdown */}
      {showServerDropdown && (
        <div className="absolute z-10 top-14 right-2 bg-background-tertiary rounded-md shadow-lg py-2 w-48">
          <div className="px-4 py-2 text-text-primary hover:bg-background-secondary cursor-pointer" onClick={() => alert('Server Settings would open here')}>
            Server Settings
          </div>
          <div className="px-4 py-2 text-text-primary hover:bg-background-secondary cursor-pointer" onClick={() => alert('Create Invitation link would be generated')}>
            Create Invitation
          </div>
          <div className="px-4 py-2 text-danger hover:bg-background-secondary cursor-pointer" onClick={() => alert('Leave Server functionality would be implemented')}>
            Leave Server
          </div>
        </div>
      )}
      
      {/* Search Box */}
      <div className="search-box mx-3 my-2 bg-background-tertiary rounded-md flex items-center p-1.5">
        <input 
          id="channel-search"
          type="text" 
          placeholder="Search" 
          className="bg-transparent text-text-secondary w-full border-none outline-none text-sm p-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div 
          className="search-icon text-text-muted ml-1 cursor-pointer hover:text-text-secondary transition-colors"
          onClick={toggleSearch}
        >
          🔍
        </div>
      </div>
      
      {/* Channels List */}
      <div className="channels-container mt-4">
        {/* Daily Topics Category */}
        <div className="category mb-2">
          <div className="category-header px-4 py-1 flex justify-between items-center text-xs font-semibold text-text-muted hover:text-text-secondary cursor-pointer uppercase">
            <div className="flex items-center">
              <div className="category-icon mr-1">▼</div>
              <div className="category-name">Daily Topics</div>
            </div>
            <div 
              className="category-icon-right text-lg cursor-pointer hover:text-accent-primary transition-colors"
              onClick={handleAddTopic}
            >
              +
            </div>
          </div>
          
          {/* Channels in this category */}
          {filteredTopics.length > 0 ? (
            filteredTopics.map(topic => (
              <div 
                key={topic.id} 
                className={`channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer ${
                  topic.isActive ? 'bg-background-tertiary text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50'
                }`}
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className="channel-icon mr-2 text-text-muted">#</div>
                <div className="truncate">{topic.name}</div>
              </div>
            ))
          ) : (
            <div className="px-2 py-1.5 mx-2 text-text-muted text-center text-sm">
              {searchQuery ? 'No topics found' : 'Loading topics...'}
            </div>
          )}
        </div>
        
        {/* Information Category */}
        <div className="category mb-2">
          <div className="category-header px-4 py-1 flex justify-between items-center text-xs font-semibold text-text-muted hover:text-text-secondary cursor-pointer uppercase">
            <div className="flex items-center">
              <div className="category-icon mr-1">▼</div>
              <div className="category-name">Information</div>
            </div>
            <div 
              className="category-icon-right text-lg cursor-pointer hover:text-accent-primary transition-colors"
              onClick={handleAddChannel}
            >
              +
            </div>
          </div>
          
          {/* Static channels */}
          <div 
            className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50"
            onClick={() => router.push('/general')}
          >
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>general</div>
          </div>
          
          <div 
            className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50"
            onClick={() => router.push('/discussion')}
          >
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>discussion</div>
          </div>
          
          <div 
            className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50"
            onClick={() => router.push('/work-report')}
          >
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>work-report</div>
          </div>
        </div>
      </div>
      
      {/* User Area (bottom of sidebar) */}
      <div className="user-area absolute bottom-0 left-0 right-0 bg-background-tertiary px-2 py-2 flex items-center">
        <div 
          className="user-avatar bg-accent-secondary w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2 cursor-pointer"
          onClick={() => router.push('/profile')}
        >
          {isAuthenticated ? 'U' : 'G'}
        </div>
        <div className="user-info flex-1 min-w-0 cursor-pointer" onClick={() => router.push('/profile')}>
          <div className="user-name text-white font-medium text-sm truncate">
            {isAuthenticated ? 'User' : 'Guest'}
          </div>
          <div className="user-status text-text-muted text-xs">Online</div>
        </div>
        <div className="user-actions flex">
          <div 
            className="user-action text-text-muted hover:text-text-secondary cursor-pointer mx-1"
            onClick={() => alert('Voice settings would open here')}
          >
            🎤
          </div>
          <div 
            className="user-action text-text-muted hover:text-text-secondary cursor-pointer mx-1"
            onClick={() => router.push('/settings')}
          >
            ⚙️
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsSidebar; 