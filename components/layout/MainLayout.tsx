import React from 'react';
import Head from 'next/head';

interface MainLayoutProps {
  children: React.ReactNode;
  enableDebug?: boolean;
}

export default function MainLayout({ children, enableDebug = true }: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>Turf - Debate App</title>
        <meta name="description" content="Join discussions on trending topics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {enableDebug && <script src="/debug.js" />}
      </Head>
      {children}
    </>
  );
} 