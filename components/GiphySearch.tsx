import logger from '@/lib/logger';
'use client';
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

  // Use the directly set API key for debugging
  const GIPHY_API_KEY = 'LAEhUpkO8Kb5pCjPgiufyX2LVJDv01s6';
  
  // Load trending GIFs by default
  useEffect(() => {
    logger.info("GiphySearch mounted, fetching trending GIFs");
    fetchGifs();
  }, []);

  // Search for GIFs when query changes
  useEffect(() => {
    if (searchQuery) {
      logger.info("Search query changed to:", searchQuery);
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
      logger.info("Fetching GIFs with query:", searchQuery || "trending");
      
      const endpoint = searchQuery
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=10&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=10&rating=g`;
      
      logger.info("GIPHY endpoint:", endpoint);
      
      const response = await fetch(endpoint);
      logger.info("GIPHY response status:", response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GIFs');
      }
      
      const data = await response.json();
      logger.info("GIPHY data received:", data.data.length, "GIFs");
      setGifs(data.data);
    } catch (err) {
      logger.error('Error fetching GIFs:', err);
      setError('Failed to load GIFs. Please try again.');
      
      // Fallback to static GIFs if API fails
      logger.info("Using fallback static GIFs");
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

  const handleGifSelect = (gifUrl: string) => {
    logger.info("GIF selected:", gifUrl);
    onSelect(gifUrl);
  };

  return (
    <div className="giphy-search w-full max-h-60 overflow-y-auto bg-background-tertiary p-3 rounded-md">
      <div className="giphy-search-header flex justify-between items-center mb-3">
        <input
          type="text"
          placeholder="Search for GIFs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background-secondary text-text-primary border border-background-primary rounded px-3 py-2 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
        <button 
          onClick={onClose}
          className="text-text-muted hover:text-text-primary p-2"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 text-center py-2 mb-2">{error}</div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <div className="giphy-results grid grid-cols-2 gap-3">
          {gifs.map((gif) => (
            <div 
              key={gif.id}
              className="giphy-result cursor-pointer hover:opacity-80 transition-opacity border border-background-primary rounded overflow-hidden"
              onClick={() => handleGifSelect(gif.images.fixed_height.url)}
            >
              <img 
                src={gif.images.fixed_height.url}
                alt="GIF"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          ))}
          
          {gifs.length === 0 && !loading && (
            <div className="col-span-2 text-center py-4 text-text-muted">
              No GIFs found. Try a different search term.
            </div>
          )}
        </div>
      )}
      
      <div className="giphy-attribution text-xs text-text-muted text-center mt-3 py-1 border-t border-background-primary">
        Powered by GIPHY
      </div>
    </div>
  );
};

export default GiphySearch; 