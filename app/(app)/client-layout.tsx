'use client';

import { ReactNode, useEffect } from 'react';
import { initCSPMonitoring } from '../scripts/csp-monitor';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    initCSPMonitoring();
  }, []);

  return <>{children}</>;
} 