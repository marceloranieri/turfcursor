import React from 'react';
import '@/app/styles/discord-theme.css';

export interface Topic {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface DiscordLayoutProps {
  children: React.ReactNode;
  topics?: Topic[];
  currentUser?: {
    name: string;
    avatar?: string;
    status?: string;
  };
  onTopicSelect?: (topicId: string) => void;
}

const DiscordLayout: React.FC<DiscordLayoutProps> = ({
  children,
  topics = [],
  currentUser,
  onTopicSelect
}) => {
  return (
    <div className="discord-theme">
      <div className="app-container">
        {/* Server Sidebar */}
        <div className="server-sidebar">
          <div className="server-icon active">T</div>
          <div className="server-divider" />
        </div>

        {/* Channels Sidebar */}
        <div className="channels-sidebar">
          <div className="server-header">
            <div className="server-header-name">Turf</div>
            <div className="server-dropdown">▼</div>
          </div>

          <div className="search-box">
            <div className="search-icon">🔍</div>
            <input type="text" placeholder="Search topics" />
          </div>

          <div className="channels-container">
            <div className="category">
              <div className="category-header">
                <div className="category-icon">▼</div>
                <div className="category-name">Topics</div>
              </div>

              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`channel ${topic.isActive ? 'active' : ''}`}
                  onClick={() => onTopicSelect?.(topic.id)}
                >
                  <div className="channel-icon">#</div>
                  <div>{topic.name}</div>
                </div>
              ))}
            </div>
          </div>

          {currentUser && (
            <div className="user-area">
              <div className="user-avatar">
                {currentUser.avatar || currentUser.name[0]}
              </div>
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-status">{currentUser.status || 'Online'}</div>
              </div>
              <div className="user-actions">
                <div className="user-action">⚙️</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="chat-container">
          {children}
        </div>

        {/* Members List */}
        <div className="members-list">
          <div className="members-header">Online Members</div>
          {/* Members list content will be added later */}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="mobile-nav-items">
          <div className="mobile-nav-item active">
            <div className="mobile-nav-icon">💬</div>
            <div>Topics</div>
          </div>
          <div className="mobile-nav-item">
            <div className="mobile-nav-icon">🔔</div>
            <div>Notifications</div>
          </div>
          <div className="mobile-nav-item">
            <div className="mobile-nav-icon">👤</div>
            <div>Profile</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordLayout; 