import React, { useState } from 'react';
import Image from 'next/image';

interface Topic {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  isBot?: boolean;
}

interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

interface Reply {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}

interface Attachment {
  type: string;
  url: string;
  alt: string;
}

interface Message {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  reactions?: Reaction[];
  replies?: Reply[];
  attachment?: Attachment;
  isBot?: boolean;
}

interface PinnedMessage {
  id: string;
  content: string;
}

interface ChatAreaProps {
  topic: Topic;
  messages: Message[];
  pinnedMessage?: PinnedMessage;
  onSendMessage: () => void;
}

const ChatArea = ({ topic, messages, pinnedMessage, onSendMessage }: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage();
      setMessageText('');
    }
  };

  return (
    <div className="chat-container bg-background-primary flex-1 flex flex-col h-screen ml-[calc(72px+240px)] mr-[240px] relative">
      {/* Chat Header */}
      <div className="chat-header border-b border-background-tertiary py-3 px-4 flex items-center">
        <div className="chat-header-hash text-text-muted text-2xl mr-2">#</div>
        <div className="chat-header-topic flex-1">
          <div className="font-bold text-text-primary">{topic.name}</div>
          <div className="text-text-muted text-xs">{topic.description}</div>
        </div>
        <div className="chat-header-actions flex">
          <div className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2">🔔</div>
          <div className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2">📌</div>
          <div className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2">👥</div>
          <div className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2">🔍</div>
        </div>
      </div>
      
      {/* Pinned Message */}
      {pinnedMessage && (
        <div className="pinned-message mx-4 my-2 p-2 bg-background-tertiary/30 rounded border-l-4 border-gold">
          <div className="pinned-header flex items-center mb-1">
            <div className="pin-icon text-gold mr-1">📌</div>
            <div className="pin-title text-gold text-sm font-semibold">Pincredible!</div>
          </div>
          <div className="message-text text-text-secondary text-sm">
            {pinnedMessage.content}
          </div>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="messages-container flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(message => (
          <div key={message.id} className={`message-group flex ${message.isBot ? 'bot-message' : ''}`}>
            <div className={`message-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
              message.isBot 
                ? 'bg-[#43b581]' 
                : 'bg-accent-secondary'
            }`}>
              {message.author.avatar}
            </div>
            <div className="message-content flex-1">
              <div className="message-header flex items-center mb-1">
                <div className={`message-author font-semibold ${message.isBot ? 'text-[#43b581]' : 'text-white'}`}>
                  {message.author.name}
                </div>
                {message.isBot && <div className="bot-tag bg-[#43b581] text-white text-xs px-1 rounded ml-2">BOT</div>}
                <div className="message-timestamp text-text-muted text-xs ml-2">{message.timestamp}</div>
              </div>
              
              <div className="message-text text-text-primary mb-2">
                {message.content.split(' ').map((word, index) => (
                  word.startsWith('@') 
                    ? <span key={index} className="text-accent-secondary mr-1">{word}</span> 
                    : <span key={index} className="mr-1">{word}</span>
                ))}
              </div>
              
              {message.attachment && (
                <div className="message-attachment mb-2">
                  <img 
                    src={message.attachment.url} 
                    alt={message.attachment.alt} 
                    className="attachment-image max-w-md rounded-md"
                  />
                </div>
              )}
              
              {message.reactions && message.reactions.length > 0 && (
                <div className="message-reactions flex flex-wrap gap-2 mb-2">
                  {message.reactions.map((reaction, index) => (
                    <div 
                      key={index} 
                      className={`reaction flex items-center px-2 py-1 rounded-full text-sm cursor-pointer ${
                        reaction.active 
                          ? 'bg-accent-primary/30 text-accent-primary' 
                          : 'bg-background-tertiary hover:bg-background-secondary'
                      }`}
                    >
                      <div className="reaction-emoji mr-1">{reaction.emoji}</div>
                      <div className="reaction-count">{reaction.count}</div>
                    </div>
                  ))}
                  <div className="reaction flex items-center px-2 py-1 rounded-full text-sm cursor-pointer bg-background-tertiary hover:bg-background-secondary text-text-muted">
                    <div className="reaction-emoji">+</div>
                  </div>
                </div>
              )}
              
              {message.replies && message.replies.length > 0 && (
                <div className="message-replies pl-4 border-l-2 border-background-tertiary mt-3 space-y-3">
                  {message.replies.map(reply => (
                    <div key={reply.id} className="reply flex">
                      <div className="reply-avatar w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 bg-accent-secondary">
                        {reply.author.avatar}
                      </div>
                      <div className="reply-content flex-1">
                        <div className="message-header flex items-center mb-1">
                          <div className="message-author font-semibold text-white">{reply.author.name}</div>
                          <div className="message-timestamp text-text-muted text-xs ml-2">{reply.timestamp}</div>
                        </div>
                        <div className="message-text text-text-primary">{reply.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat Input Area */}
      <form onSubmit={handleSendMessage} className="input-container border-t border-background-tertiary p-3 mt-auto flex items-center">
        <div className="input-actions flex mr-2">
          <div className="input-action w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer">+</div>
          <div className="input-action ml-2 bg-background-tertiary px-2 py-1 rounded text-text-muted hover:text-text-secondary cursor-pointer">GIF</div>
        </div>
        <input 
          type="text" 
          className="input-field flex-1 bg-background-tertiary text-text-primary p-2 rounded-md focus:outline-none"
          placeholder={`Message #${topic.name}`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <div className="input-buttons flex ml-2">
          <div className="input-action w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer">😊</div>
          <div className="input-action ml-2 w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer">🎤</div>
        </div>
      </form>
    </div>
  );
};

export default ChatArea; 