import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Topic } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { DiscordButton } from '@/components/ui/DiscordButton';

export const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();

    const channel = supabase
      .channel('topics_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'topics',
        },
        () => {
          fetchTopics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/topics/${topic.id}`}
          className="block group"
        >
          <div className="bg-[var(--channel-bg)] rounded-lg p-6 hover:bg-[var(--channel-hover)] transition-colors">
            <h3 className="text-xl font-semibold text-[var(--header-primary)] mb-2">
              {topic.title}
            </h3>
            <p className="text-[var(--text-normal)] mb-4">
              {topic.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">
                {topic.category}
              </span>
              <DiscordButton variant="primary">Join Discussion</DiscordButton>
            </div>
          </div>
        </Link>
      ))}

      {topics.length === 0 && (
        <div className="col-span-full text-center py-12">
          <h3 className="text-xl font-semibold text-[var(--header-primary)] mb-2">
            No Active Topics
          </h3>
          <p className="text-[var(--text-muted)]">
            Check back later for new topics!
          </p>
        </div>
      )}
    </div>
  );
}; 