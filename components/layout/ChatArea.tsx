'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import { useInView } from 'react-intersection-observer';

interface ChatAreaProps {
  messages: Message[];
  chat: any;
  onSendMessage: () => void;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  isOnline: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  chat,
  onSendMessage,
  isAuthenticated,
  onSignInClick,
  onLoadMore,
  hasMore,
  loadingMore,
  isOnline
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load more messages when scrolling up
  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  return (
    <div className="flex-1 flex flex-col bg-background-secondary">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">{chat.title || 'Chat'}</h2>
        {!isOnline && (
          <div className="text-sm text-yellow-500">
            You're offline. Messages will be sent when you reconnect.
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {hasMore && (
          <div ref={loadMoreRef} className="text-center py-2">
            {loadingMore ? (
              <span className="text-text-secondary">Loading more messages...</span>
            ) : (
              <button
                onClick={onLoadMore}
                className="text-accent-primary hover:text-accent-primary-dark"
              >
                Load more
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.optimistic ? 'opacity-70' : 'opacity-100'
              }`}
            >
              <div className="flex-1 bg-background-primary rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {message.author?.username || 'Unknown User'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                    {message.status && (
                      <span className="text-sm">
                        {message.status === 'sending' && '⏳'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'error' && '❌'}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-text-primary">{message.content}</p>
                {message.status === 'error' && (
                  <div className="mt-1 text-sm text-red-500">
                    Failed to send. Click to retry.
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {isAuthenticated ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage();
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg bg-background-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark transition-colors"
              disabled={!isOnline}
            >
              Send
            </button>
          </form>
        ) : (
          <button
            onClick={onSignInClick}
            className="w-full px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-dark transition-colors"
          >
            Sign in to chat
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatArea); 