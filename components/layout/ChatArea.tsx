import React, { useState, useEffect, useRef } from 'react';
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

const ChatArea = ({ topic, messages: initialMessages, pinnedMessage: initialPinnedMessage, onSendMessage }: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pinnedMessage, setPinnedMessage] = useState<PinnedMessage | undefined>(initialPinnedMessage);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update messages when the prop changes (e.g. when topic changes)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Update pinned message when the prop changes
  useEffect(() => {
    setPinnedMessage(initialPinnedMessage);
  }, [initialPinnedMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // If this was a real app, we would send to Supabase here
      
      // For demo purpose, add the message locally
      if (replyingTo) {
        // Add a reply to a message
        const updatedMessages = messages.map(message => {
          if (message.id === replyingTo.id) {
            return {
              ...message,
              replies: [
                ...(message.replies || []),
                {
                  id: `reply-${Date.now()}`,
                  author: { id: 'user3', name: 'Charlie', avatar: 'C' },
                  content: messageText,
                  timestamp: 'Just now'
                }
              ]
            };
          }
          return message;
        });
        setMessages(updatedMessages);
        setReplyingTo(null);
      } else {
        // Add a new message
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          author: { id: 'user3', name: 'Charlie', avatar: 'C' },
          content: messageText,
          timestamp: 'Just now',
          reactions: []
        };
        setMessages([...messages, newMessage]);
      }
      
      setMessageText('');
      onSendMessage(); // Notify parent
    }
  };
  
  const handleReplyClick = (message: Message) => {
    setReplyingTo(message);
    // Focus the input field
    document.querySelector('.input-field')?.focus();
  };
  
  const cancelReply = () => {
    setReplyingTo(null);
  };
  
  const handleReactionClick = (messageId: string, emoji: string, isActive: boolean) => {
    // In a real app, this would update the reactions in Supabase
    
    // For demo purpose, update reaction count locally
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        let updatedReactions = [...(message.reactions || [])];
        
        // Find if this emoji already exists in reactions
        const existingIndex = updatedReactions.findIndex(r => r.emoji === emoji);
        
        if (existingIndex >= 0) {
          // Emoji already exists
          if (isActive) {
            // User has already reacted, remove their reaction
            if (updatedReactions[existingIndex].count > 1) {
              updatedReactions[existingIndex] = {
                ...updatedReactions[existingIndex],
                count: updatedReactions[existingIndex].count - 1,
                active: false
              };
            } else {
              // If count would be 0, remove the reaction
              updatedReactions = updatedReactions.filter((_, i) => i !== existingIndex);
            }
          } else {
            // User has not reacted, add their reaction
            updatedReactions[existingIndex] = {
              ...updatedReactions[existingIndex],
              count: updatedReactions[existingIndex].count + 1,
              active: true
            };
          }
        } else {
          // Emoji doesn't exist yet, add it
          updatedReactions.push({
            emoji,
            count: 1,
            active: true
          });
        }
        
        return {
          ...message,
          reactions: updatedReactions
        };
      }
      return message;
    });
    
    setMessages(updatedMessages);
  };
  
  const addNewReaction = (messageId: string) => {
    // Simulate adding a new reaction - in a real app this would open an emoji picker
    const emojis = ['👍', '❤️', '🔥', '😂', '🎉', '👀', '😍', '🚀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    handleReactionClick(messageId, randomEmoji, false);
  };
  
  const handlePinMessage = (message: Message) => {
    // In a real app, this would update the pinned message in Supabase
    
    // For demo purpose, set the pinned message locally
    setPinnedMessage({
      id: message.id,
      content: message.content
    });
    
    // Simulate auto-unpinning after 30 seconds
    setTimeout(() => {
      setPinnedMessage(undefined);
    }, 30000);
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowGifPicker(false);
  };
  
  const toggleGifPicker = () => {
    setShowGifPicker(!showGifPicker);
    setShowEmojiPicker(false);
  };
  
  // Simulated emoji picker
  const renderEmojiPicker = () => {
    const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤩', '🔥', '👍', '👏', '🎉', '❤️', '✨'];
    
    return (
      <div className="absolute bottom-16 right-4 bg-background-tertiary p-2 rounded-md shadow-lg">
        <div className="flex flex-wrap gap-2 max-w-xs">
          {emojis.map((emoji, index) => (
            <div 
              key={index}
              className="cursor-pointer hover:bg-background-secondary p-1 rounded text-lg"
              onClick={() => {
                setMessageText(messageText + emoji);
                setShowEmojiPicker(false);
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Simulated GIF picker
  const renderGifPicker = () => {
    const gifUrls = [
      'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDMwbWlxNDg4cGlmMmZuemdqNTk1MHUyMGc2Z3ppNXkyNnV2eTdubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YrBRYRDN4M5Q0dyzKh/giphy.gif',
      'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWdyY3JhNnN1c3I4MG02ZjBpNGhteXBkb3NydnRveTFyc3owbWZ5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZG0OPY9ToFbXO/giphy.gif',
      'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3ppMGJxendnYTk3cHVqcnRyY240em84aXQ2bncydXM3ZXkzYnlmdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohhwytHcusSCXXp96/giphy.gif'
    ];
    
    return (
      <div className="absolute bottom-16 right-4 bg-background-tertiary p-2 rounded-md shadow-lg">
        <div className="flex flex-col gap-2 max-w-xs">
          {gifUrls.map((url, index) => (
            <img 
              key={index}
              src={url}
              alt="GIF option"
              className="cursor-pointer hover:brightness-90 rounded w-full max-w-[200px]"
              onClick={() => {
                // In a real app, we would insert the GIF, but for now just add text
                handleSendMessage({
                  preventDefault: () => {}
                } as React.FormEvent);
                setShowGifPicker(false);
              }}
            />
          ))}
        </div>
      </div>
    );
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
          <div 
            className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2"
            onClick={() => alert('Notification settings would open here')}
          >
            🔔
          </div>
          <div 
            className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2"
            onClick={() => alert('Pinned messages would show here')}
          >
            📌
          </div>
          <div 
            className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2"
            onClick={() => alert('Member list would toggle on mobile')}
          >
            👥
          </div>
          <div 
            className="header-action text-text-muted hover:text-text-secondary cursor-pointer mx-2"
            onClick={() => alert('Search messages would open here')}
          >
            🔍
          </div>
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
      
      {/* Reply Bar - show when replying to a message */}
      {replyingTo && (
        <div className="reply-bar mx-4 mt-2 p-2 bg-background-tertiary/30 rounded flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-text-secondary text-sm mr-2">
              Replying to <span className="text-accent-secondary">{replyingTo.author.name}</span>
            </div>
            <div className="text-text-muted text-xs truncate max-w-[300px]">{replyingTo.content}</div>
          </div>
          <button 
            className="text-text-muted hover:text-text-secondary p-1"
            onClick={cancelReply}
          >
            ✕
          </button>
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
                
                {/* Message Actions */}
                <div className="message-actions ml-auto flex opacity-0 group-hover:opacity-100">
                  <button 
                    className="p-1 text-text-muted hover:text-text-secondary"
                    onClick={() => handleReplyClick(message)}
                    title="Reply"
                  >
                    ↩️
                  </button>
                  <button 
                    className="p-1 text-text-muted hover:text-text-secondary"
                    onClick={() => handlePinMessage(message)}
                    title="Pin"
                  >
                    📌
                  </button>
                </div>
              </div>
              
              <div className="message-text text-text-primary mb-2 group">
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
              
              {/* Reactions */}
              <div className="message-reactions flex flex-wrap gap-2 mb-2">
                {message.reactions && message.reactions.length > 0 && message.reactions.map((reaction, index) => (
                  <div 
                    key={index} 
                    className={`reaction flex items-center px-2 py-1 rounded-full text-sm cursor-pointer ${
                      reaction.active 
                        ? 'bg-accent-primary/30 text-accent-primary' 
                        : 'bg-background-tertiary hover:bg-background-secondary'
                    }`}
                    onClick={() => handleReactionClick(message.id, reaction.emoji, reaction.active)}
                  >
                    <div className="reaction-emoji mr-1">{reaction.emoji}</div>
                    <div className="reaction-count">{reaction.count}</div>
                  </div>
                ))}
                <div 
                  className="reaction flex items-center px-2 py-1 rounded-full text-sm cursor-pointer bg-background-tertiary hover:bg-background-secondary text-text-muted"
                  onClick={() => addNewReaction(message.id)}
                >
                  <div className="reaction-emoji">+</div>
                </div>
              </div>
              
              {/* Replies */}
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
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input Area */}
      <form onSubmit={handleSendMessage} className="input-container border-t border-background-tertiary p-3 mt-auto flex items-center">
        <div className="input-actions flex mr-2">
          <div 
            className="input-action w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer"
            onClick={() => alert('Upload file functionality would open here')}
          >
            +
          </div>
          <div 
            className="input-action ml-2 bg-background-tertiary px-2 py-1 rounded text-text-muted hover:text-text-secondary cursor-pointer"
            onClick={toggleGifPicker}
          >
            GIF
          </div>
        </div>
        <input 
          type="text" 
          className="input-field flex-1 bg-background-tertiary text-text-primary p-2 rounded-md focus:outline-none"
          placeholder={`Message #${topic.name}`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <div className="input-buttons flex ml-2">
          <div 
            className="input-action w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer"
            onClick={toggleEmojiPicker}
          >
            😊
          </div>
          <div 
            className="input-action ml-2 w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-text-muted hover:text-text-secondary cursor-pointer"
            onClick={() => alert('Voice message functionality would open here')}
          >
            🎤
          </div>
        </div>
      </form>
      
      {/* Emoji Picker */}
      {showEmojiPicker && renderEmojiPicker()}
      
      {/* GIF Picker */}
      {showGifPicker && renderGifPicker()}
    </div>
  );
};

export default ChatArea; 