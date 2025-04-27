import logger from '@/lib/logger';
'use client'

import { useEffect, useState } from 'react';
import { logComponentLifecycle } from '@/lib/debug-helpers';

interface HydrationSafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

export default function HydrationSafeComponent({
  children,
  fallback = <div>Loading...</div>,
  componentName = 'HydrationSafeComponent',
}: HydrationSafeComponentProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (process.env.NODE_ENV === 'development') {
      logger.info(`${componentName} hydrated at:`, new Date().toISOString());
    }
  }, [componentName]);

  // Log component lifecycle in development
  logComponentLifecycle(componentName);

  // Show fallback until hydration is complete
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 