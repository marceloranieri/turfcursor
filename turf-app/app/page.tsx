'use client';

import React from 'react';
import DailyTopics from '../components/DailyTopics';
import { supabase } from '../lib/supabase/client';
import Link from 'next/link';
import Topic from '@/components/Topic';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Topic />
    </main>
  );
}
