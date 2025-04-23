'use client';

import React from 'react';
import Topic from '@/components/Topic';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Topic />
      <SpeedInsights />
    </main>
  );
}
