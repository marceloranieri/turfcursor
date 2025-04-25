import React from 'react';
import Link from 'next/link';

const ServerSidebar = () => {
  return (
    <div className="server-sidebar bg-background-tertiary h-screen w-[72px] flex flex-col items-center py-4 fixed left-0 top-0">
      <div className="server-icon active bg-gold text-background-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2">
        T
      </div>
      <div className="server-divider w-8 h-[2px] bg-gray-700 my-2"></div>
      
      {/* Example Additional Servers */}
      <div className="server-icon bg-[#6c5ce7] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
        D
      </div>
      <div className="server-icon bg-[#00b894] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
        G
      </div>
      <div className="server-icon bg-[#e17055] w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
        C
      </div>
      
      {/* Add Server Button */}
      <div className="server-icon bg-background-secondary hover:bg-accent-secondary transition-colors w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-white text-2xl font-bold mt-auto cursor-pointer">
        +
      </div>
    </div>
  );
};

export default ServerSidebar; 