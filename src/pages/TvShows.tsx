import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import { MediaItem } from '../types';
import { MediaCard } from '../components/common/MediaCard';
import { FilterBar } from '../components/common/FilterBar';
import { Pagination } from '../components/common/Pagination';

export const TvShows: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || 'popularity.desc';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [shows, setShows] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', sort: initialSort });
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when filters change
  const handleFilterChange = (newFilters: { genre: string; year: string; sort: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchParams({ sort: newFilters.sort, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ sort: filters.sort, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        if (filters.sort === 'trending') {
          const data = await tmdb.getTrending('tv', 'week', currentPage);
          setShows(data.results);
          setTotalPages(data.total_pages);
        } else {
          const params: Record<string, string> = {
            sort_by: filters.sort,
          };
          if (filters.genre) params.with_genres = filters.genre;
          if (filters.year) params.first_air_date_year = filters.year;

          const data = await tmdb.discover('tv', params, currentPage);
          setShows(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [filters, currentPage]);

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">TV Shows</h1>
        <FilterBar mediaType="tv" onFilterChange={handleFilterChange} initialSort={initialSort} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : shows.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {shows.map((item) => (
              <MediaCard key={item.id} item={{ ...item, media_type: 'tv' }} />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          No TV shows found matching your filters.
        </div>
      )}
    </div>
  );
};
