'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Message from './Message';
import { Message as MessageType, Profile } from '@/lib/types/database.types';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import logger from '@/lib/logger';
import GuestAwareChatInput from './GuestAwareChatInput';
import { TopNavigation } from './TopNavigation';
import { MembersList } from './MembersList';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

interface ChatRoomProps {
  circleId: string;
}

export default function ChatRoom() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Chat is rendering correctly ✅</h1>
      <p className="mt-2 text-gray-500">If you're seeing this, your /chat route is stable and ready to wire real logic.</p>
    </div>
  )
} 