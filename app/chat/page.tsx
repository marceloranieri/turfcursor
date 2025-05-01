'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const ChatRoom = dynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
  loading: () => <div className="p-6 text-center">Loading chat...</div>,
});

export default function ChatPage() {
  return (
    <ErrorBoundary fallback={<div className="p-6 text-red-600">Failed to load chat. Please try again later.</div>}>
      <Suspense fallback={<div className="p-6 text-center">Preparing chat...</div>}>
        <ChatRoom />
      </Suspense>
    </ErrorBoundary>
  );
} 