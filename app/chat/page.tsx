'use client';

import { Suspense } from 'react';
import { default as loadDynamic } from 'next/dynamic';

const ChatRoom = loadDynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
});

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatRoom />
    </Suspense>
  );
} 