import logger from '@/lib/logger';
import React, { useState } from 'react';
import Image from 'next/image';
import { Message as MessageType, ReactionType } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { DiscordButton } from '@/components/ui/DiscordButton';
import { formatDistanceToNow } from 'date-fns';
import { GuestAwareReactionButton } from './GuestAwareReactionButton';
import { FaReply, FaRegSmile } from 'react-icons/fa';

interface MessageProps {
  message: MessageType;
  onReply: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onReply }) => {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleReaction = async (type: ReactionType) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('reactions').insert({
        message_id: message.id,
        user_id: user.id,
        type,
      });

      if (error) throw error;
    } catch (error) {
      logger.error('Error adding reaction:', error);
    }
  };

  const handleReply = () => {
    onReply(message.id);
    setIsReplying(true);
  };

  return (
    <div className={`message-bubble fade-in ${message.is_pinned ? 'border-l-4 border-accent-primary' : ''} ${message.is_wizard ? 'border-l-4 border-accent-secondary' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={message.user?.avatar_url || '/default-avatar.png'}
            alt={message.user?.username || 'User'}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-background-tertiary"
          />
        </div>

        {/* Message content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary truncate">
              {message.user?.username}
            </span>
            <span className="text-xs text-text-muted whitespace-nowrap">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="text-text-primary break-words">{message.content}</div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(
                message.reactions.reduce((acc, reaction) => {
                  acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <GuestAwareReactionButton
                  key={type}
                  emoji={type === 'upvote' ? '👍' : type === 'downvote' ? '👎' : type === 'genius' ? '🌟' : type}
                  count={count}
                  onClick={() => handleReaction(type as ReactionType)}
                  isActive={message.reactions?.some(r => r.user_id === user?.id && r.type === type)}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2">
            <GuestAwareReactionButton
              emoji="👍"
              count={0}
              onClick={() => handleReaction('upvote')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.type === 'upvote')}
            />
            <GuestAwareReactionButton
              emoji="👎"
              count={0}
              onClick={() => handleReaction('downvote')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.type === 'downvote')}
            />
            <GuestAwareReactionButton
              emoji="🌟"
              count={0}
              onClick={() => handleReaction('genius')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.type === 'genius')}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
              aria-label="Add reaction"
            >
              <FaRegSmile className="w-4 h-4" />
            </button>
            <button
              onClick={handleReply}
              className="button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
              aria-label="Reply to message"
            >
              <FaReply className="w-4 h-4" />
            </button>
          </div>

          {showEmojiPicker && (
            <div className="relative mt-2">
              <EmojiPicker
                onSelect={(emoji) => {
                  handleReaction(emoji);
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {message.replies && message.replies.length > 0 && (
        <div className="ml-14 mt-2 border-l-2 border-background-tertiary pl-4">
          {message.replies.map((reply) => (
            <Message key={reply.id} message={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}; 