import logger from '@/lib/logger';
'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    logger.info('✅ Hydration complete — DebugPage loaded');
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Debug Mode 🛠</h1>
      <p>This page confirms hydration, CSP behavior, and bundle execution.</p>
      <button onClick={() => alert('🟢 Button works!')}>
        Click Me
      </button>
    </div>
  );
} 