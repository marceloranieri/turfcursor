'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveTopics, subscribeToTopics } from '../lib/topics/topicHelpers';
import { Topic } from '../lib/topics/types';
import { useRouter } from 'next/navigation';

export default function DailyTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch active topics on mount
    async function loadTopics() {
      try {
        setLoading(true);
        const activeTopics = await getActiveTopics();
        setTopics(activeTopics);
      } catch (error) {
        console.error('Error loading topics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();

    // Subscribe to real-time updates
    const subscription = subscribeToTopics((payload) => {
      // Refresh topics when there's a change
      loadTopics();
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Display a loading skeleton while fetching topics
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Daily Debate Circles</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  // If no topics are available
  if (topics.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Daily Debate Circles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">No active topics available right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Daily Debate Circles</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => router.push(`/circles/${topic.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{topic.title}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {topic.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{topic.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Active for 24h
              </span>
              <Link
                href={`/circles/${topic.id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                Join Discussion →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 