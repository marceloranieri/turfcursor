'use client';

import React, { Suspense } from 'react';
import Topic from '@/components/Topic';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Turf</h1>
        <p className="text-lg text-gray-600">Your social debate platform</p>
      </div>
    </main>
  );
}
