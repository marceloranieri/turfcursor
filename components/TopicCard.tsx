import React from 'react';

interface Topic {
  id: string;
  name: string;
  description: string;
  category: string;
  participants: number;
  lastActivity: string;
}

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const TopicCard = ({ topic, onClick }: TopicCardProps) => {
  // Generate a consistent but random-seeming color based on the topic name
  const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Pick from a set of Discord-like colors
    const colors = [
      '#5865F2', // Discord blurple
      '#57F287', // Discord green
      '#FEE75C', // Discord yellow
      '#EB459E', // Discord fuchsia
      '#ED4245', // Discord red
      '#5D8AB0', // Discord navy
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const categoryColor = generateColor(topic.category);

  return (
    <div 
      className="bg-background-secondary rounded-lg p-5 cursor-pointer transition-transform hover:translate-y-[-4px] border border-background-tertiary hover:border-accent-primary"
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: categoryColor }}
        ></div>
        <span className="text-xs text-text-muted uppercase">{topic.category}</span>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-2">{topic.name}</h2>
      
      <p className="text-text-secondary mb-4 text-sm">{topic.description}</p>
      
      <div className="flex justify-between text-xs text-text-muted">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" clipRule="evenodd" />
          </svg>
          {topic.participants} active
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-12a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l2.828 2.829a1 1 0 1 0 1.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {topic.lastActivity}
        </div>
      </div>
    </div>
  );
};

export default TopicCard; 