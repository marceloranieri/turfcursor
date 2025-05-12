'use client';

import React from 'react';

export default function MobileLayout({ 
  children, 
  showNav = true 
}: { 
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white">
      <main className="pb-20">
        {children}
      </main>
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
          <div className="container mx-auto flex justify-around">
            <div>Home</div>
            <div>Explore</div>
            <div>New</div>
            <div>Profile</div>
          </div>
        </nav>
      )}
    </div>
  );
} 