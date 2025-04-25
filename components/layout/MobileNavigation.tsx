import React from 'react';
import Link from 'next/link';

const MobileNavigation = () => {
  return (
    <div className="mobile-nav fixed bottom-0 left-0 right-0 bg-background-tertiary py-2 border-t border-background-secondary hidden mobile:block z-50">
      <div className="mobile-nav-items flex justify-around">
        <div className="mobile-nav-item flex flex-col items-center">
          <div className="mobile-nav-icon text-text-muted text-xl mb-1">🏠</div>
          <div className="text-text-muted text-xs">Home</div>
        </div>
        
        <div className="mobile-nav-item flex flex-col items-center active">
          <div className="mobile-nav-icon text-accent-primary text-xl mb-1">💬</div>
          <div className="text-accent-primary text-xs">Chat</div>
        </div>
        
        <div className="mobile-nav-item flex flex-col items-center">
          <div className="mobile-nav-icon text-text-muted text-xl mb-1">🔔</div>
          <div className="text-text-muted text-xs">Notifications</div>
        </div>
        
        <div className="mobile-nav-item flex flex-col items-center">
          <div className="mobile-nav-icon text-text-muted text-xl mb-1">👤</div>
          <div className="text-text-muted text-xs">Profile</div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation; 