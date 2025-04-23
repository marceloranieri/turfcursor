import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

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

export interface TopicMessage {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

export interface DiscordMessageProps {
  message: TopicMessage;
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
  message,
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
        <div className="message-text">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex-shrink-0 mr-4">
        <Image
          src={message.author.avatar}
          alt={message.author.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message.author.name}
          </p>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {message.content}
        </p>

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