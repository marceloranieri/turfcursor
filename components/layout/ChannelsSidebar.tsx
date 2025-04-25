import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  
  const handleTopicClick = (id: string) => {
    router.push(`/chat/${id}`);
  };
  
  return (
    <div className="channels-sidebar bg-background-secondary w-60 h-screen overflow-y-auto fixed left-[72px] top-0">
      {/* Server Header */}
      <div className="server-header border-b border-background-tertiary p-4 flex justify-between items-center">
        <div className="server-header-name text-white font-bold text-lg">Turf</div>
        <div className="server-dropdown text-gray-400 cursor-pointer">▼</div>
      </div>
      
      {/* Search Box */}
      <div className="search-box mx-3 my-2 bg-background-tertiary rounded-md flex items-center p-1.5">
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-transparent text-text-secondary w-full border-none outline-none text-sm p-1"
        />
        <div className="search-icon text-text-muted ml-1">🔍</div>
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
            <div className="category-icon-right text-lg">+</div>
          </div>
          
          {/* Channels in this category */}
          {topics.map(topic => (
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
          ))}
        </div>
        
        {/* Information Category */}
        <div className="category mb-2">
          <div className="category-header px-4 py-1 flex justify-between items-center text-xs font-semibold text-text-muted hover:text-text-secondary cursor-pointer uppercase">
            <div className="flex items-center">
              <div className="category-icon mr-1">▼</div>
              <div className="category-name">Information</div>
            </div>
            <div className="category-icon-right text-lg">+</div>
          </div>
          
          {/* Static channels */}
          <div className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50">
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>general</div>
          </div>
          
          <div className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50">
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>discussion</div>
          </div>
          
          <div className="channel px-2 py-1.5 mx-2 rounded flex items-center cursor-pointer text-text-muted hover:text-text-secondary hover:bg-background-tertiary/50">
            <div className="channel-icon mr-2 text-text-muted">#</div>
            <div>work-report</div>
          </div>
        </div>
      </div>
      
      {/* User Area (bottom of sidebar) */}
      <div className="user-area absolute bottom-0 left-0 right-0 bg-background-tertiary px-2 py-2 flex items-center">
        <div className="user-avatar bg-accent-secondary w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
          C
        </div>
        <div className="user-info flex-1 min-w-0">
          <div className="user-name text-white font-medium text-sm truncate">CharlieDebate</div>
          <div className="user-status text-text-muted text-xs">Online</div>
        </div>
        <div className="user-actions flex">
          <div className="user-action text-text-muted hover:text-text-secondary cursor-pointer mx-1">🎤</div>
          <div className="user-action text-text-muted hover:text-text-secondary cursor-pointer mx-1">⚙️</div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsSidebar; 