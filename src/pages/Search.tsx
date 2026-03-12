import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import { MediaItem } from '../types';
import { MediaCard } from '../components/common/MediaCard';
import { Filter, Search as SearchIcon } from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [countries, setCountries] = useState<{iso_3166_1: string, english_name: string}[]>([]);
  
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresData, countriesData] = await Promise.all([
          tmdb.getGenres(mediaType),
          tmdb.getCountries()
        ]);
        setGenres(genresData.genres);
        // Sort countries alphabetically
        setCountries(countriesData.sort((a, b) => a.english_name.localeCompare(b.english_name)));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
    // Reset selected genre when media type changes, as genre IDs differ
    setSelectedGenre('');
    setCurrentPage(1);
  }, [mediaType]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          // If there's a search query, use multi-search
          const data = await tmdb.search(query, currentPage);
          const filtered = data.results.filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          setResults(filtered);
          setTotalPages(data.total_pages);
        } else {
          // If no query, use discover with filters
          const params: Record<string, string> = {
            sort_by: 'popularity.desc',
          };
          if (selectedGenre) params.with_genres = selectedGenre;
          if (selectedCountry) params.with_origin_country = selectedCountry;
          
          const data = await tmdb.discover(mediaType, params, currentPage);
          // Discover endpoint doesn't return media_type, so we inject it
          const resultsWithMediaType = data.results.map(item => ({
            ...item,
            media_type: mediaType
          }));
          setResults(resultsWithMediaType);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error('Search/Discover error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, mediaType, selectedGenre, selectedCountry, currentPage]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('searchInput') as HTMLInputElement;
    setCurrentPage(1);
    if (input.value.trim()) {
      setSearchParams({ q: input.value.trim(), page: '1' });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedCountry('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newParams: Record<string, string> = { page: page.toString() };
    if (query) newParams.q = query;
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {query ? `Search Results for "${query}"` : 'Discover'}
        </h1>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-auto flex-1 max-w-md">
          <input
            name="searchInput"
            type="text"
            defaultValue={query}
            placeholder="Search movies, tv..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </form>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-medium">
          <Filter size={18} />
          <h2>Filters</h2>
          {(selectedGenre || selectedCountry || query) && (
            <button onClick={clearFilters} className="ml-auto text-sm text-blue-500 hover:text-blue-600">
              Clear All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Media Type Toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => { setMediaType('movie'); setCurrentPage(1); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${mediaType === 'movie' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Movies
              </button>
              <button
                onClick={() => { setMediaType('tv'); setCurrentPage(1); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${mediaType === 'tv' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                TV Shows
              </button>
            </div>
          </div>

          {/* Genre Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
              disabled={!!query} // Disable filters when searching by query
              className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Country Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
              disabled={!!query} // Disable filters when searching by query
              className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c.iso_3166_1} value={c.iso_3166_1}>{c.english_name}</option>
              ))}
            </select>
          </div>
        </div>
        {query && (
          <p className="text-xs text-amber-500 mt-3">
            * Filters are disabled while searching by name. Clear the search to use filters.
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {results.map((item) => (
              <MediaCard key={item.id} item={item} />
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
          <p className="text-xl">No results found.</p>
          <p className="mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};
