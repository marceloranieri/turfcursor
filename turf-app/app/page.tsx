'use client';

import React from 'react';
import DailyTopics from '../components/DailyTopics';
import { supabase } from '../lib/supabase/client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Welcome to Turf
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Daily Debates. Real Connections.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <DailyTopics />
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Daily Topics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every day, 5 new debate topics are selected. Each topic is available for exactly 24 hours.
              </p>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Join the Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pick a topic that interests you and dive into respectful debate with other users.
              </p>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Earn Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive Genius Awards for insightful contributions and build your reputation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
