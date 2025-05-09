import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Debate {
  title: string;
  image: string;
  category: string;
  sampleResponse: {
    username: string;
    text: string;
    avatar: string;
  };
}

const MobileWelcome = () => {
  const router = useRouter();
  
  const featuredDebate: Debate = {
    title: "Could Luke have resisted the One Ring better than Frodo?",
    image: "/star_rings_turf.webp",
    category: "Fantasy Debates",
    sampleResponse: {
      username: "Tolkien_Lore",
      text: "The Ring corrupts power. Luke's stronger = faster fall",
      avatar: "/Tolkien_Lore.png"
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Dynamic debate preview - occupies top 60% of screen */}
      <div className="relative h-3/5 w-full overflow-hidden">
        <img 
          src={featuredDebate.image} 
          alt="Background" 
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        
        {/* Featured debate */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <h2 className="text-white text-xl font-bold mb-4">
            {featuredDebate.title}
          </h2>
          
          {/* Sample response bubble */}
          <div className="bg-white rounded-2xl p-4 mb-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              <img 
                src={featuredDebate.sampleResponse.avatar} 
                alt={featuredDebate.sampleResponse.username} 
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{featuredDebate.sampleResponse.username}</p>
              <p className="text-gray-700">{featuredDebate.sampleResponse.text}</p>
            </div>
          </div>
          
          {/* Topic indicator */}
          <div className="inline-block bg-blue-500 px-3 py-1 rounded-full text-white text-sm">
            {featuredDebate.category}
          </div>
        </div>
      </div>
      
      {/* Welcome content - bottom 40% */}
      <div className="flex-1 px-6 pt-8 pb-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Welcome to Turf 👋</h1>
        <p className="text-gray-600 mb-8">
          Chatrooms with daily-curated debates on your favorite topics.
          Fresh ideas, your kind of people.
        </p>
        
        <button 
          onClick={() => router.push('/auth/signin')}
          className="mt-auto w-full bg-blue-600 text-white p-4 rounded-xl font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default MobileWelcome; 