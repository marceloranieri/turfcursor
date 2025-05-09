import React from 'react';
import MobileNav from './MobileNav';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const MobileLayout = ({ children, showNav = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom navigation */}
      {showNav && <MobileNav />}
    </div>
  );
};

export default MobileLayout; 