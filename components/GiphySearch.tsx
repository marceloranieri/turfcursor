import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface GiphySearchProps {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

interface GiphyResult {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
    original: {
      url: string;
    };
  };
}

const GiphySearch: React.FC<GiphySearchProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trending GIFs by default
  useEffect(() => {
    fetchGifs();
  }, []);

  // Search for GIFs when query changes
  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => {
        fetchGifs();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const fetchGifs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = searchQuery
        ? `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=10&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=10&rating=g`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GIFs');
      }
      
      const data = await response.json();
      setGifs(data.data);
    } catch (err) {
      console.error('Error fetching GIFs:', err);
      setError('Failed to load GIFs. Please try again.');
      
      // Fallback to static GIFs if API fails
      setGifs([
        {
          id: '1',
          images: {
            fixed_height: {
              url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDMwbWlxNDg4cGlmMmZuemdqNTk1MHUyMGc2Z3ppNXkyNnV2eTdubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YrBRYRDN4M5Q0dyzKh/giphy.gif'
            }
          }
        },
        {
          id: '2',
          images: {
            fixed_height: {
              url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWdyY3JhNnN1c3I4MG02ZjBpNGhteXBkb3NydnRveTFyc3owbWZ5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZG0OPY9ToFbXO/giphy.gif'
            }
          }
        },
        {
          id: '3',
          images: {
            fixed_height: {
              url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3ppMGJxendnYTk3cHVqcnRyY240em84aXQ2bncydXM3ZXkzYnlmdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohhwytHcusSCXXp96/giphy.gif'
            }
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="giphy-search w-full max-h-60 overflow-y-auto">
      <div className="giphy-search-header flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Search for GIFs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background-tertiary text-text-primary border border-background-primary rounded px-2 py-1 flex-1 mr-2"
        />
        <button 
          onClick={onClose}
          className="text-text-muted hover:text-text-primary"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="text-danger text-center py-2">{error}</div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <div className="giphy-results grid grid-cols-2 gap-2">
          {gifs.map((gif) => (
            <div 
              key={gif.id}
              className="giphy-result cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onSelect(gif.images.fixed_height.url)}
            >
              <img 
                src={gif.images.fixed_height.url}
                alt="GIF"
                className="w-full h-auto rounded"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="giphy-attribution text-xs text-text-muted text-center mt-2">
        Powered by GIPHY
      </div>
    </div>
  );
};

export default GiphySearch; 