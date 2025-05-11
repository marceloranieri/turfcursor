import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/client';
import ChatPage from './page';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ChatPageServer');

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

export default function ChatPageServer(props: { params: { id: string } }) {
  return <ChatPage {...props} />;
} 