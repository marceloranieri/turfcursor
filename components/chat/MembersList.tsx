'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '@/lib/types/database.types';

interface MembersListProps {
  members: Profile[];
  isOpen: boolean;
  onClose: () => void;
}

export function MembersList({ members, isOpen, onClose }: MembersListProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 right-0 h-full w-64 bg-background-secondary border-l border-background-tertiary shadow-lg"
        >
          <div className="flex items-center justify-between p-4 border-b border-background-tertiary">
            <h2 className="text-lg font-semibold text-text-primary">Members</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-background-tertiary"
              aria-label="Close members list"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center text-sm font-semibold text-text-primary">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {member.username}
                    </p>
                    {member.is_debate_maestro && (
                      <p className="text-xs text-accent-primary">
                        Debate Maestro
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 