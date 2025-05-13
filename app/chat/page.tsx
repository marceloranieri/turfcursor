'use client';

import React, { Suspense } from 'react';
import { default as loadDynamic } from 'next/dynamic';
import { ClientAuthWrapper } from '@/components/auth/ClientAuthWrapper';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const dynamic = 'force-dynamic';

const ChatRoom = loadDynamic(() => import('@/components/chat/ChatRoom'), {
  ssr: false,
  loading: () => <div className="p-6 text-center">Loading chat...</div>,
});

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary fallback={<div className="p-6 text-red-600">Failed to load chat. Please try again later.</div>}>
        <Suspense fallback={<div className="p-8 text-center">Loading chat...</div>}>
          <ClientAuthWrapper>
            <ChatRoom />
          </ClientAuthWrapper>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
} 