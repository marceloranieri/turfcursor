import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  highlight?: boolean;
}

const NavButton = ({ icon, label, href, active, highlight }: NavButtonProps) => {
  return (
    <Link 
      href={href}
      className={`flex flex-col items-center justify-center w-16 ${
        active ? 'text-blue-500' : 'text-gray-500'
      }`}
    >
      <div className={`p-1 ${highlight ? 'bg-blue-500 rounded-full' : ''}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );
};

const MobileNav = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-between px-2 pt-3 pb-6">
      <NavButton 
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
        label="Home"
        href="/"
        active={isActive('/')}
      />
      
      <NavButton 
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        label="Explore"
        href="/explore"
        active={isActive('/explore')}
      />
      
      <NavButton 
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        label="New"
        href="/new"
        active={isActive('/new')}
        highlight={true}
      />
      
      <NavButton 
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        }
        label="Alerts"
        href="/notifications"
        active={isActive('/notifications')}
      />
      
      <NavButton 
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        label="Profile"
        href="/profile"
        active={isActive('/profile')}
      />
    </div>
  );
};

export default MobileNav; 