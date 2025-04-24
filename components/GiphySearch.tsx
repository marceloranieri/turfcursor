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

export default function GiphySearch({ onSelect, onClose }: GiphySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GiphyResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // In a real app, this would come from an environment variable
  const GIPHY_API_KEY = 'YOUR_GIPHY_API_KEY';
  
  useEffect(() => {
    // Load trending GIFs by default
    fetchTrendingGifs();
  }, []);
  
  const fetchTrendingGifs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=15`
      );
      
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchGifs = async () => {
    if (!searchTerm.trim()) {
      fetchTrendingGifs();
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          searchTerm
        )}&limit=15`
      );
      
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchGifs();
  };
  
  // Function for mocking GIF results since we don't have a real API key
  const getMockGifs = () => {
    return [
      {
        id: '1',
        title: 'Happy Cat',
        images: {
          fixed_height: {
            url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif'
          },
          original: {
            url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif'
          }
        }
      },
      {
        id: '2',
        title: 'Thumbs Up',
        images: {
          fixed_height: {
            url: 'https://media.giphy.com/media/9g8PH1MbwTy4o/giphy.gif'
          },
          original: {
            url: 'https://media.giphy.com/media/9g8PH1MbwTy4o/giphy.gif'
          }
        }
      },
      {
        id: '3',
        title: 'Mind Blown',
        images: {
          fixed_height: {
            url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif'
          },
          original: {
            url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif'
          }
        }
      },
      {
        id: '4',
        title: 'Dancing',
        images: {
          fixed_height: {
            url: 'https://media.giphy.com/media/DGWAx8d3IkICs/giphy.gif'
          },
          original: {
            url: 'https://media.giphy.com/media/DGWAx8d3IkICs/giphy.gif'
          }
        }
      }
    ];
  };
  
  // For demo purposes, use mock data instead of real API calls
  useEffect(() => {
    setResults(getMockGifs());
  }, [searchTerm]);
  
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-text-primary font-semibold">GIF Search</h3>
        <button 
          className="p-1 rounded-full hover:bg-background-secondary text-text-muted hover:text-text-primary"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="flex mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GIFs..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="button-primary ml-2">
          Search
        </button>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {results.map(gif => (
            <div 
              key={gif.id}
              className="cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-accent-primary"
              onClick={() => onSelect(gif.images.original.url)}
            >
              <Image 
                src={gif.images.fixed_height.url} 
                alt={gif.title} 
                width={200}
                height={96}
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 