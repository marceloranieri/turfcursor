'use client';

import React, { Suspense } from 'react';
import { default as loadDynamic } from 'next/dynamic';

export const dynamic = 'force-dynamic';

const ChatRoom = loadDynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
  loading: () => <div className="p-6 text-center">Loading chat...</div>,
});

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Preparing chat...</div>}>
      <ChatRoom />
    </Suspense>
  );
} 