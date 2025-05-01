'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ClientOnly from '@/components/common/ClientOnly';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const dynamic = 'force-dynamic';

const ChatRoom = dynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem' }}>Loading chatroom...</div>,
});

export default function ChatPage() {
  return (
    <ClientOnly>
      <ErrorBoundary fallback={<div style={{ padding: '2rem' }}>⚠️ Chat failed to load.</div>}>
        <Suspense fallback={<div style={{ padding: '2rem' }}>Starting chat session…</div>}>
          <ChatRoom />
        </Suspense>
      </ErrorBoundary>
    </ClientOnly>
  );
} 