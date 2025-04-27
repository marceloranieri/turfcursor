'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopicCard from '@/components/TopicCard';

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold">Welcome to Turf App</h1>
    </main>
  );
}
