import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Plus, Check } from 'lucide-react';
import { MediaItem } from '../../types';
import { IMAGE_BASE_URL } from '../../services/tmdb';
import { useList } from '../../context/ListContext';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const { isInList, addToList, removeFromList } = useList();
  const inList = isInList(item.id);

  const title = item.title || item.name || item.original_title || item.original_name || 'Unknown';
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const type = item.media_type === 'tv' ? 'TV Show' : 'Movie';

  const handleListToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromList(item.id);
    } else {
      addToList(item);
    }
  };

  return (
    <Link
      to={`/details/${item.media_type || 'movie'}/${item.id}`}
      className="group relative flex flex-col gap-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
        {item.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${item.poster_path}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3 md:p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-1">
            <div className="flex items-center gap-1 text-yellow-400 font-medium text-[10px] sm:text-xs md:text-sm bg-black/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md backdrop-blur-sm shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
              <span>{item.vote_average ? item.vote_average.toFixed(1) : 'NR'}</span>
            </div>
            <button
              onClick={handleListToggle}
              className={`p-1 sm:p-1.5 md:p-2 rounded-full backdrop-blur-md transition-colors shrink-0 ${
                inList ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
              }`}
            >
              {inList ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
          <button className="w-full py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md sm:rounded-lg text-[10px] sm:text-xs md:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 transition-colors min-w-0">
            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current shrink-0" /> 
            <span className="truncate">Watch<span className="hidden sm:inline"> Now</span></span>
          </button>
        </div>
      </div>
      
      <div className="px-1">
        <h3 className="font-semibold text-sm md:text-base line-clamp-1 text-slate-900 dark:text-slate-100" title={title}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
          {year && <span>{year}</span>}
          {year && <span>•</span>}
          <span className="capitalize">{type}</span>
        </div>
      </div>
    </Link>
  );
};
