import logger from '@/lib/logger';
import React, { useState } from 'react';
import Image from 'next/image';
import { Message as MessageType, Reply, Reaction } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { EmojiPicker } from '@/components/chat/EmojiPicker';
import DiscordButton from '@/components/ui/DiscordButton';
import { formatDistanceToNow } from 'date-fns';
import { GuestAwareReactionButton } from './GuestAwareReactionButton';
import { FaReply } from '@react-icons/all-files/fa/FaReply';
import { FaRegSmile } from '@react-icons/all-files/fa/FaRegSmile';

interface ReplyMessageProps {
  reply: Reply;
  onReply: (messageId: string) => void;
}

const ReplyMessage: React.FC<ReplyMessageProps> = ({ reply, onReply }) => {
  return (
    <div className="flex items-start gap-4 py-2">
      <div className="flex-shrink-0">
        <Image
          src={reply.author.avatar || '/default-avatar.png'}
          alt={reply.author.name || 'User'}
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-text-primary truncate">
            {reply.author.name}
          </span>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="text-text-primary">{reply.content}</div>
      </div>
    </div>
  );
};

interface MessageProps {
  message: MessageType;
  onReply: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onReply }) => {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reactions')
        .upsert({
          message_id: message.id,
          user_id: user.id,
          emoji: emoji
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleReply = () => {
    onReply(message.id);
    setIsReplying(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={message.author.avatar || '/default-avatar.png'}
            alt={message.author.name || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Message content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary truncate">
              {message.author.name}
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
                  acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([emoji, count]) => (
                <GuestAwareReactionButton
                  key={emoji}
                  emoji={emoji}
                  count={count}
                  onClick={() => handleReaction(emoji as string)}
                  isActive={message.reactions?.some(r => r.user_id === user?.id && r.emoji === emoji)}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2">
            <GuestAwareReactionButton
              emoji="👍"
              count={0}
              onClick={() => handleReaction('👍')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.emoji === '👍')}
            />
            <GuestAwareReactionButton
              emoji="👎"
              count={0}
              onClick={() => handleReaction('👎')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.emoji === '👎')}
            />
            <GuestAwareReactionButton
              emoji="🌟"
              count={0}
              onClick={() => handleReaction('🌟')}
              isActive={message.reactions?.some(r => r.user_id === user?.id && r.emoji === '🌟')}
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
            <ReplyMessage key={reply.id} reply={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}; 