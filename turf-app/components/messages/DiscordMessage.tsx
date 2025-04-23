import React from 'react';
import { format } from 'date-fns';

interface Reaction {
  emoji: string;
  count: number;
  isActive?: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
}

interface DiscordMessageProps {
  author: {
    name: string;
    avatar?: string;
    isBot?: boolean;
  };
  content: string;
  timestamp: Date;
  reactions?: Reaction[];
  replies?: Reply[];
  attachment?: {
    type: 'image' | 'gif';
    url: string;
    alt?: string;
  };
  isPinned?: boolean;
  onReactionClick?: (emoji: string) => void;
}

const DiscordMessage: React.FC<DiscordMessageProps> = ({
  author,
  content,
  timestamp,
  reactions,
  replies,
  attachment,
  isPinned,
  onReactionClick,
}) => {
  if (isPinned) {
    return (
      <div className="pinned-message">
        <div className="pinned-header">
          <div className="pin-icon">📌</div>
          <div className="pin-title">Pinned Message</div>
        </div>
        <div className="message-text">{content}</div>
      </div>
    );
  }

  return (
    <div className="message-group">
      <div className="message-avatar">
        {author.avatar || author.name[0]}
      </div>
      <div className="message-content">
        <div className="message-header">
          <div className="message-author">{author.name}</div>
          {author.isBot && <div className="bot-tag">BOT</div>}
          <div className="message-timestamp">
            {format(timestamp, 'MMM d, h:mm a')}
          </div>
        </div>
        
        <div className="message-text">{content}</div>

        {attachment && (
          <div className="message-attachment">
            <img 
              src={attachment.url} 
              alt={attachment.alt || 'Attachment'} 
              className="attachment-image"
            />
          </div>
        )}

        {reactions && reactions.length > 0 && (
          <div className="message-reactions">
            {reactions.map((reaction, index) => (
              <div
                key={`${reaction.emoji}-${index}`}
                className={`reaction ${reaction.isActive ? 'active' : ''}`}
                onClick={() => onReactionClick?.(reaction.emoji)}
              >
                <div className="reaction-emoji">{reaction.emoji}</div>
                <div className="reaction-count">{reaction.count}</div>
              </div>
            ))}
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="message-replies">
            {replies.map((reply) => (
              <div key={reply.id} className="reply">
                <div className="reply-avatar">
                  {reply.author.avatar || reply.author.name[0]}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-author">{reply.author.name}</div>
                    <div className="message-timestamp">
                      {format(reply.timestamp, 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <div className="message-text">{reply.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscordMessage; 