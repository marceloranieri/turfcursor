'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { FaBars, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TopNavigationProps {
  title: string;
  onMenuClick: () => void;
  onMembersClick: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  onMenuClick,
  onMembersClick,
}) => {
  const { user } = useAuth();

  return (
    <motion.header
      className="sticky top-0 z-40 bg-background-primary border-b border-background-tertiary"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side - Menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
          aria-label="Open menu"
        >
          <FaBars className="w-5 h-5" />
        </button>

        {/* Center - Title */}
        <h1 className="text-lg font-semibold text-text-primary truncate mx-4">
          {title}
        </h1>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Members button */}
          <button
            onClick={onMembersClick}
            className="lg:hidden button bg-background-tertiary hover:bg-background-secondary text-text-secondary"
            aria-label="Show members"
          >
            <FaUsers className="w-5 h-5" />
          </button>

          {/* Profile link */}
          <Link
            href="/profile"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <Image
              src={user?.avatar_url || '/default-avatar.png'}
              alt={user?.username || 'User'}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-background-tertiary"
            />
            {user?.online && (
              <div
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-background-primary"
                aria-hidden="true"
              />
            )}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}; 