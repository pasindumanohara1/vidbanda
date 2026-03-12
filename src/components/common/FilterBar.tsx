import React, { useEffect, useState } from 'react';
import { tmdb } from '../../services/tmdb';

interface FilterBarProps {
  mediaType: 'movie' | 'tv';
  onFilterChange: (filters: { genre: string; year: string; sort: string }) => void;
  initialSort?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ mediaType, onFilterChange, initialSort = 'popularity.desc' }) => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState(initialSort);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdb.getGenres(mediaType);
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, [mediaType]);

  useEffect(() => {
    onFilterChange({
      genre: selectedGenre,
      year: selectedYear,
      sort: selectedSort,
    });
  }, [selectedGenre, selectedYear, selectedSort]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    if (e.target.value && selectedSort === 'trending') {
      setSelectedSort('popularity.desc');
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    if (e.target.value && selectedSort === 'trending') {
      setSelectedSort('popularity.desc');
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
    if (e.target.value === 'trending') {
      setSelectedGenre('');
      setSelectedYear('');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full md:w-auto">
      <select
        value={selectedGenre}
        onChange={handleGenreChange}
        className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={selectedSort}
        onChange={handleSortChange}
        className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
      >
        <option value="trending">Trending This Week</option>
        <option value="popularity.desc">Most Popular</option>
        <option value="vote_average.desc">Highest Rated</option>
        <option value="primary_release_date.desc">Newest</option>
        <option value="revenue.desc">Highest Grossing</option>
      </select>
    </div>
  );
};
