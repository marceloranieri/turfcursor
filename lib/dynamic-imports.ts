import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for dynamic imports
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
  </div>
);

// Error component for dynamic imports
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="p-4 text-red-500">
    <p>Error loading component: {error.message}</p>
  </div>
);

// Helper function to create dynamic imports with consistent loading and error states
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    ssr?: boolean;
    loading?: ComponentType;
    error?: ComponentType<{ error: Error }>;
  } = {}
) {
  return dynamic(importFn, {
    ssr: options.ssr ?? true,
    loading: options.loading ?? LoadingComponent,
    error: options.error ?? ErrorComponent,
  });
}

// Pre-defined dynamic imports for heavy components
export const DynamicChatArea = createDynamicImport(
  () => import('@/components/layout/ChatArea'),
  { ssr: false }
);

export const DynamicMessageList = createDynamicImport(
  () => import('@/components/MessageList'),
  { ssr: false }
);

export const DynamicEmojiPicker = createDynamicImport(
  () => import('@/components/ui/EmojiPicker'),
  { ssr: false }
);

export const DynamicProfile = createDynamicImport(
  () => import('@/components/Profile'),
  { ssr: true }
);

export const DynamicSettings = createDynamicImport(
  () => import('@/components/Settings'),
  { ssr: true }
); 