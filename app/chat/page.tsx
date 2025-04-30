'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ChatRoom = dynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
});

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoom />
    </Suspense>
  );
} 