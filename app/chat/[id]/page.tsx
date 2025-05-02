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

export default async function ChatPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient(cookieStore);

  try {
    // Fetch initial chat data
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', params.id)
      .single();

    if (chatError) {
      if (chatError.code === 'PGRST116') {
        return notFound();
      }
      throw chatError;
    }

    // Fetch initial messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*, author:profiles(id, username, avatar_url)')
      .eq('chat_id', params.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (messagesError) {
      throw messagesError;
    }

    // Serialize data to ensure it's safe to pass to client
    const serializedChat = JSON.parse(JSON.stringify(chatData));
    const serializedMessages = JSON.parse(JSON.stringify(messages || []));

    return (
      <ChatPageClient 
        chatId={params.id} 
        initialChat={serializedChat}
        initialMessages={serializedMessages} 
      />
    );
  } catch (error) {
    logger.error('Error in chat page:', error);
    throw error;
  }
}