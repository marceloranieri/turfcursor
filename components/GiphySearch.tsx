'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';
import { useDebounce } from '@/lib/hooks/useDebounce';
import logger from '@/lib/logger';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface GiphySearchProps {
  onSelect: (gif: IGif) => void;
  onClose: () => void;
}

export const GiphySearch: React.FC<GiphySearchProps> = ({ onSelect, onClose }) => {
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const gf = useMemo(() => new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || ''), []);

  const fetchGifs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = debouncedQuery
        ? await gf.search(debouncedQuery, { limit: 20 })
        : await gf.trending({ limit: 20 });
      setGifs(data);
    } catch (error) {
      logger.error('Error fetching GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, gf]);

  // Fetch trending GIFs on mount
  useEffect(() => {
    logger.info("GiphySearch mounted, fetching trending GIFs");
    fetchGifs();
  }, [fetchGifs]);

  // Search for GIFs when query changes
  useEffect(() => {
    if (debouncedQuery) {
      logger.info("Query changed, searching GIFs:", debouncedQuery);
      fetchGifs();
    }
  }, [debouncedQuery, fetchGifs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background-primary rounded-lg p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GIFs..."
            className="flex-1 p-2 rounded bg-background-secondary text-text-primary"
          />
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded hover:bg-background-tertiary text-text-primary"
          >
            Close
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => {
                  onSelect(gif);
                  onClose();
                }}
                className="relative aspect-square overflow-hidden rounded hover:ring-2 hover:ring-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <Image
                  src={gif.images.fixed_height_small.url}
                  alt={gif.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiphySearch; 