import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);
  
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

  // Set up real-time message subscription
  useEffect(() => {
    const channel = supabase
      .channel(`public:messages:topic_id=eq.${topic.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `topic_id=eq.${topic.id}` 
      }, (payload) => {
        // Add new message to the UI
        const newMessage = payload.new;
        
        // Format the message to match our UI format
        // This is a simplified example - you'd need to fetch author info too
        const formattedMessage = {
          id: newMessage.id,
          author: {
            id: newMessage.user_id,
            name: "New User", // In a real app, fetch this from users table
            avatar: "U"
          },
          content: newMessage.content,
          timestamp: 'Just now',
          reactions: []
        };
        
        setMessages(currentMessages => [...currentMessages, formattedMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topic.id]);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify authentication first
    if (!isAuthenticated) {
      onSendMessage(); // This will trigger the auth modal in the parent
      return;
    }
    
    if (messageText.trim()) {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          onSendMessage(); // Trigger auth modal
          return;
        }
        
        // For demo purpose, add the message locally first for better UX
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
                    author: { id: user.id, name: user.email?.split('@')[0] || 'User', avatar: 'U' },
                    content: messageText,
                    timestamp: 'Just now'
                  }
                ]
              };
            }
            return message;
          });
          setMessages(updatedMessages);
          
          // In a real app, also save to Supabase
          await supabase.from('messages').insert({
            content: messageText,
            user_id: user.id,
            topic_id: topic.id,
            parent_id: replyingTo.id,
            created_at: new Date().toISOString()
          });
          
          setReplyingTo(null);
        } else {
          // Add a new message
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            author: { id: user.id, name: user.email?.split('@')[0] || 'User', avatar: 'U' },
            content: messageText,
            timestamp: 'Just now',
            reactions: []
          };
          setMessages([...messages, newMessage]);
          
          // In a real app, also save to Supabase
          await supabase.from('messages').insert({
            content: messageText,
            user_id: user.id,
            topic_id: topic.id,
            created_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
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
  
  const handleReactionClick = async (messageId: string, emoji: string, isActive: boolean) => {
    // Check authentication first
    if (!isAuthenticated) {
      onSendMessage(); // This will trigger the auth modal in the parent
      return;
    }
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onSendMessage(); // Trigger auth modal
        return;
      }
      
      // For demo purposes, update reaction count locally first for better UX
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
      
      // In a real app, also save/update reaction in Supabase
      if (isActive) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .match({ message_id: messageId, user_id: user.id, content: emoji });
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            content: emoji,
            created_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };
  
  const addNewReaction = (messageId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      onSendMessage(); // This will trigger the auth modal in the parent
      return;
    }
    
    // Simulate adding a new reaction - in a real app this would open an emoji picker
    const emojis = ['👍', '❤️', '🔥', '😂', '🎉', '👀', '😍', '🚀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    handleReactionClick(messageId, randomEmoji, false);
  };
  
  const handlePinMessage = async (message: Message) => {
    // Check authentication first
    if (!isAuthenticated) {
      onSendMessage(); // This will trigger the auth modal in the parent
      return;
    }
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onSendMessage(); // Trigger auth modal
        return;
      }
      
      // For demo purpose, set the pinned message locally
      setPinnedMessage({
        id: message.id,
        content: message.content
      });
      
      // In a real app, also update the message as pinned in Supabase
      await supabase
        .from('messages')
        .update({ is_pinned: true })
        .eq('id', message.id);
      
      // Simulate auto-unpinning after 30 seconds
      setTimeout(async () => {
        setPinnedMessage(undefined);
        // In a real app, also update in Supabase
        await supabase
          .from('messages')
          .update({ is_pinned: false })
          .eq('id', message.id);
      }, 30000);
    } catch (error) {
      console.error('Error pinning message:', error);
    }
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowGifPicker(false);
  };
  
  const toggleGifPicker = () => {
    setShowGifPicker(!showGifPicker);
    setShowEmojiPicker(false);
  };
  
  // Improved emoji picker with GIPHY API integration
  const renderEmojiPicker = () => {
    const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤩', '🔥', '👍', '👏', '🎉', '❤️', '✨'];
    
    return (
      <div className="absolute bottom-16 right-4 bg-background-tertiary p-2 rounded-md shadow-lg z-10">
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
  
  // Improved GIF picker with GIPHY API
  const renderGifPicker = () => {
    const [gifs, setGifs] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      const searchGifs = async () => {
        if (!searchQuery) {
          // Just show trending gifs
          setIsLoading(true);
          try {
            const response = await fetch(
              `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=5`
            );
            const data = await response.json();
            const gifUrls = data.data.map((gif: any) => gif.images.fixed_height.url);
            setGifs(gifUrls);
          } catch (error) {
            console.error('Error fetching GIFs:', error);
            // Fallback to static GIFs if API fails
            setGifs([
              'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDMwbWlxNDg4cGlmMmZuemdqNTk1MHUyMGc2Z3ppNXkyNnV2eTdubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YrBRYRDN4M5Q0dyzKh/giphy.gif',
              'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWdyY3JhNnN1c3I4MG02ZjBpNGhteXBkb3NydnRveTFyc3owbWZ5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZG0OPY9ToFbXO/giphy.gif',
              'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3ppMGJxendnYTk3cHVqcnRyY240em84aXQ2bncydXM3ZXkzYnlmdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohhwytHcusSCXXp96/giphy.gif'
            ]);
          } finally {
            setIsLoading(false);
          }
        } else {
          // Search for gifs based on query
          setIsLoading(true);
          try {
            const response = await fetch(
              `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchQuery}&limit=5`
            );
            const data = await response.json();
            const gifUrls = data.data.map((gif: any) => gif.images.fixed_height.url);
            setGifs(gifUrls);
          } catch (error) {
            console.error('Error searching GIFs:', error);
          } finally {
            setIsLoading(false);
          }
        }
      };
      
      searchGifs();
    }, [searchQuery]);
    
    return (
      <div className="absolute bottom-16 right-4 bg-background-tertiary p-2 rounded-md shadow-lg z-10 w-64">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search GIFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 bg-background-secondary text-text-primary rounded border border-background-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-text-muted">Loading...</div>
          ) : gifs.length > 0 ? (
            gifs.map((url, index) => (
              <img 
                key={index}
                src={url}
                alt="GIF option"
                className="cursor-pointer hover:brightness-90 rounded w-full"
                onClick={() => {
                  // In a real app, we would insert the GIF URL as a message or attachment
                  // For this demo, we'll just close the picker and send a text message
                  setShowGifPicker(false);
                  setMessageText("I sent a GIF! (In a real app, this would show the actual GIF)");
                  // Immediately send the message
                  handleSendMessage({
                    preventDefault: () => {}
                  } as React.FormEvent);
                }}
              />
            ))
          ) : (
            <div className="text-center py-4 text-text-muted">No GIFs found</div>
          )}
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
                <div className="message-actions ml-auto flex">
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
        <button 
          type="submit"
          className="ml-2 px-4 py-1 bg-accent-primary text-background-primary rounded-md hover:bg-gold transition-colors"
        >
          Send
        </button>
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