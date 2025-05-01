'use client';

import { Suspense } from 'react';
import { default as loadDynamic } from 'next/dynamic';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const dynamic = 'force-dynamic';

const ChatRoom = loadDynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem' }}>Loading chatroom...</div>,
});

export default function ChatPage() {
  return (
    <ErrorBoundary fallback={<div style={{ padding: '2rem' }}>⚠️ Unable to load chatroom.</div>}>
      <Suspense fallback={<div style={{ padding: '2rem' }}>Spinning up chatroom…</div>}>
        <ChatRoom />
      </Suspense>
    </ErrorBoundary>
  );
} 