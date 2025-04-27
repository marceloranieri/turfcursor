import logger from '@/lib/logger';
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import MessageList from '@/components/MessageList';
import { Message } from '@/lib/types';

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

interface PinnedMessage {
  id: string;
  content: string;
}

interface ChatAreaProps {
  topic: Topic;
  messages: Message[];
  pinnedMessage?: PinnedMessage;
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  topic,
  messages: initialMessages,
  pinnedMessage: initialPinnedMessage,
  onSendMessage
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [messagesList, setMessagesList] = useState<Message[]>(initialMessages);
  const [currentPinnedMessage, setCurrentPinnedMessage] = useState<PinnedMessage | undefined>(initialPinnedMessage);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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
    setMessagesList(initialMessages);
  }, [initialMessages]);
  
  // Update pinned message when the prop changes
  useEffect(() => {
    setCurrentPinnedMessage(initialPinnedMessage);
  }, [initialPinnedMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

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
        
        setMessagesList(currentMessages => [...currentMessages, formattedMessage]);
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
  
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      // Call the parent handler with the message content
      onSendMessage(messageInput.trim());
      
      // Clear the input field
      setMessageInput('');
      
      // Focus back on the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
      onSendMessage(''); // This will trigger the auth modal in the parent
      return;
    }
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onSendMessage(''); // Trigger auth modal
        return;
      }
      
      // For demo purposes, update reaction count locally first for better UX
      const updatedMessages = messagesList.map(message => {
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
      
      setMessagesList(updatedMessages);
      
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
      logger.error('Error handling reaction:', error);
    }
  };
  
  const addNewReaction = (messageId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      onSendMessage(''); // This will trigger the auth modal in the parent
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
      onSendMessage(''); // This will trigger the auth modal in the parent
      return;
    }
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onSendMessage(''); // Trigger auth modal
        return;
      }
      
      // For demo purpose, set the pinned message locally
      setCurrentPinnedMessage({
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
        setCurrentPinnedMessage(undefined);
        // In a real app, also update in Supabase
        await supabase
          .from('messages')
          .update({ is_pinned: false })
          .eq('id', message.id);
      }, 30000);
    } catch (error) {
      logger.error('Error pinning message:', error);
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
                setMessageInput(messageInput + emoji);
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
            logger.error('Error fetching GIFs:', error);
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
            logger.error('Error searching GIFs:', error);
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
                  setMessageInput("I sent a GIF! (In a real app, this would show the actual GIF)");
                  // Immediately send the message
                  handleSubmit({
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
    <div className="flex flex-col flex-1 bg-background min-w-0">
      {/* Chat header */}
      <div className="flex items-center px-4 py-3 border-b border-background-tertiary">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text-primary truncate">
            {topic.name}
          </h2>
          <p className="text-sm text-text-secondary truncate">
            {topic.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="header-action p-2 rounded hover:bg-background-secondary text-text-secondary hover:text-text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="header-action p-2 rounded hover:bg-background-secondary text-text-secondary hover:text-text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Pinned message */}
      {currentPinnedMessage && (
        <div className="px-4 py-2 bg-background-secondary/50 border-b border-background-tertiary flex items-start">
          <span className="flex-shrink-0 text-text-secondary mr-2 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary">
              {currentPinnedMessage.content}
            </p>
          </div>
        </div>
      )}
      
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messagesList} />
      </div>
      
      {/* Input area */}
      <div className="px-4 py-3 border-t border-background-tertiary">
        <form id="message-form" onSubmit={handleSubmit} className="flex items-center">
          <div className="flex items-center space-x-2 mr-2">
            <button type="button" className="input-action p-2 rounded hover:bg-background-secondary text-text-secondary hover:text-text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          <input
            ref={inputRef}
            id="message-input"
            name="message"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="input-field flex-1 p-2 bg-background-secondary text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary"
            placeholder={`Message ${topic.name}...`}
            aria-label="Type a message"
          />
          <button 
            type="submit" 
            disabled={!messageInput.trim()}
            className={`ml-2 px-4 py-2 rounded-md font-medium ${
              messageInput.trim() 
                ? 'bg-accent-primary text-white hover:bg-accent-primary/90' 
                : 'bg-background-tertiary text-text-secondary cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && renderEmojiPicker()}
      
      {/* GIF Picker */}
      {showGifPicker && renderGifPicker()}
    </div>
  );
};

export default ChatArea; 