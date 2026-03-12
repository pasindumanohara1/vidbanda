import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tmdb } from '../services/tmdb';
import { MediaItem } from '../types';
import { MediaCard } from '../components/common/MediaCard';
import { FilterBar } from '../components/common/FilterBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ResponsiveBanner } from '../components/ads/ResponsiveBanner';
import { NativeBanner } from '../components/ads/NativeBanner';
import { AdBanner } from '../components/ads/AdBanner';

export const Movies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', sort: initialSort });
  
  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset page when filters change
  const handleFilterChange = (newFilters: { genre: string; year: string; sort: string }) => {
    setFilters(newFilters);
    setPage(1);
    setMovies([]);
    setHasMore(true);
    setSearchParams({ sort: newFilters.sort });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        if (filters.sort === 'trending') {
          data = await tmdb.getTrending('movie', 'week', page);
        } else {
          const params: Record<string, string> = {
            sort_by: filters.sort,
          };
          if (filters.genre) params.with_genres = filters.genre;
          if (filters.year) params.primary_release_year = filters.year;

          data = await tmdb.discover('movie', params, page);
        }
        
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies(prev => {
            const newIds = new Set(prev.map(m => m.id));
            const uniqueNew = data.results.filter((m: MediaItem) => !newIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
        }
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters, page]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <Helmet>
        <title>Movies - Vidbanda</title>
        <meta name="description" content="Browse and discover the best movies on Vidbanda. Filter by genre, year, and popularity to find your next favorite film." />
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Movies</h1>
        <FilterBar mediaType="movie" onFilterChange={handleFilterChange} initialSort={initialSort} />
      </div>

      <ResponsiveBanner />

      <div className="my-8">
        <NativeBanner />
      </div>

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {movies.map((item) => (
              <MediaCard key={item.id} item={{ ...item, media_type: 'movie' }} />
            ))}
          </div>
          <div ref={observerTarget} className="py-2 flex justify-center min-h-[40px]">
            {loading && hasMore && <LoadingSpinner />}
            {!hasMore && <p className="text-slate-500 dark:text-slate-400 text-sm">No more movies to load.</p>}
          </div>
          
          <div className="flex justify-center mt-4">
            <AdBanner adKey="b7b9503357eacfd5d6a20f48a28440b7" width={300} height={250} />
          </div>
        </>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          No movies found matching your filters.
        </div>
      )}
    </div>
  );
};
