import React, { useState } from 'react';
import Image from 'next/image';
import { Message as MessageType, ReactionType } from '@/lib/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { DiscordButton } from '@/components/ui/DiscordButton';
import { formatDistanceToNow } from 'date-fns';

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
      console.error('Error adding reaction:', error);
    }
  };

  const handleReply = () => {
    onReply(message.id);
    setIsReplying(true);
  };

  const handleUpvote = () => handleReaction('upvote');
  const handleDownvote = () => handleReaction('downvote');
  const handleGenius = () => handleReaction('genius');

  return (
    <div className={`p-4 ${message.is_pinned ? 'bg-[var(--pin-bg)]' : ''} ${message.is_wizard ? 'bg-[var(--wizard-bg)]' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={message.user?.avatar_url || '/default-avatar.png'}
            alt={message.user?.username || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Message content */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[var(--header-primary)]">
              {message.user?.username}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="text-[var(--text-normal)]">{message.content}</div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(
                message.reactions.reduce((acc, reaction) => {
                  acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-[var(--reaction-bg)] hover:bg-[var(--reaction-bg-hover)]"
                >
                  <span>{type === 'upvote' ? '👍' : type === 'downvote' ? '👎' : type === 'genius' ? '🌟' : type}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2">
            <DiscordButton
              variant="secondary"
              onClick={handleUpvote}
              className="!p-1"
            >
              👍
            </DiscordButton>
            <DiscordButton
              variant="secondary"
              onClick={handleDownvote}
              className="!p-1"
            >
              ��
            </DiscordButton>
            <DiscordButton
              variant="secondary"
              onClick={handleGenius}
              className="!p-1"
            >
              🌟
            </DiscordButton>
            <DiscordButton
              variant="secondary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="!p-1"
            >
              😊
            </DiscordButton>
            <DiscordButton
              variant="secondary"
              onClick={handleReply}
              className="!p-1"
            >
              💬
            </DiscordButton>
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
        <div className="ml-14 mt-2 border-l-2 border-[var(--divider)] pl-4">
          {message.replies.map((reply) => (
            <Message key={reply.id} message={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}; 