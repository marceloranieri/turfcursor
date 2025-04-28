'use client';

import React from 'react';
import Image from 'next/image';
import { User } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';

interface MembersListProps {
  members: User[];
  isOpen: boolean;
  onClose: () => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Members list sidebar */}
      <motion.aside
        role="complementary"
        aria-label="Members list"
        className={`fixed right-0 top-0 h-screen w-64 bg-background-secondary border-l border-background-tertiary z-50 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-background-tertiary">
            <h2 className="font-semibold text-text-primary">Members</h2>
            <button
              onClick={onClose}
              className="lg:hidden button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
              aria-label="Close members list"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Members list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <AnimatePresence>
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                >
                  <div className="relative">
                    <Image
                      src={member.avatar_url || '/default-avatar.png'}
                      alt={member.username || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background-secondary ${
                        member.status === 'online' ? 'bg-success' : 'bg-text-muted'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary truncate font-medium">
                      {member.username}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {member.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}; 