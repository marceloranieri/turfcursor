'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@/lib/supabase/client';
import ChatPageClient from './ChatPageClient';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ChatPage');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient(cookieStore);

  try {
    const { data: chat } = await supabase
      .from('chats')
      .select('title, description')
      .eq('id', params.id)
      .single();

    return {
      title: chat?.title || `Chat ${params.id}`,
      description: chat?.description || 'Join the conversation',
    };
  } catch (error) {
    logger.error('Error generating metadata:', error);
    return {
      title: `Chat ${params.id}`,
      description: 'Join the conversation',
    };
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if Supabase keys are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Authentication configuration is missing. Please check your environment variables.');
        return;
      }

      try {
        const supabase = createClientComponentClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Continue with chat initialization...
      } catch (err: any) {
        console.error('Auth check failed:', err);
        setError('Failed to authenticate. Please try again later.');
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat UI will be rendered here */}
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chat Room: {params.id}</h1>
        {/* Add your chat components here */}
      </div>
    </div>
  );
}