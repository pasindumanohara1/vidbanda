import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, IMAGE_BASE_URL, IMAGE_W1280_URL } from '../services/tmdb';
import { MediaDetails, SeasonDetails } from '../types';
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft, Youtube, X, ChevronDown } from 'lucide-react';
import { useList } from '../context/ListContext';
import { Player } from '../components/media/Player';
import { MediaCard } from '../components/common/MediaCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Details: React.FC = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isInList, addToList, removeFromList } = useList();
  const playerRef = useRef<HTMLDivElement>(null);

  // TV Show specific state
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !type) return;
      setLoading(true);
      try {
        const data = await tmdb.getDetails(parseInt(id), type);
        setDetails(data);
        
        // Default to season 1 if it exists, otherwise the first available season
        if (type === 'tv' && data.seasons && data.seasons.length > 0) {
          const defaultSeason = data.seasons.find(s => s.season_number === 1) || data.seasons[0];
          setSelectedSeason(defaultSeason.season_number);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, type]);

  useEffect(() => {
    const fetchSeason = async () => {
      if (type === 'tv' && id && selectedSeason !== null) {
        try {
          const data = await tmdb.getSeasonDetails(parseInt(id), selectedSeason);
          setSeasonDetails(data);
        } catch (error) {
          console.error('Error fetching season details:', error);
        }
      }
    };
    fetchSeason();
  }, [type, id, selectedSeason]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content not found</h2>
        <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const title = details.title || details.name || details.original_title || details.original_name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const inList = isInList(details.id);
  
  const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || 
                  details.videos?.results?.find(v => v.site === 'YouTube');

  const handleListToggle = () => {
    if (inList) {
      removeFromList(details.id);
    } else {
      addToList(details);
    }
  };

  const scrollToPlayer = () => {
    if (playerRef.current) {
      const offset = 100;
      const elementPosition = playerRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handlePlayEpisode = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    scrollToPlayer();
  };

  return (
    <div className="pb-20">
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}

      {/* Backdrop Header */}
      <div className="relative w-full min-h-[85vh] md:min-h-[75vh] flex items-end pb-12 pt-32">
        <div className="absolute inset-0 bg-slate-900">
          {details.backdrop_path && (
            <img
              src={`${IMAGE_W1280_URL}${details.backdrop_path}`}
              alt={title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/40 to-transparent dark:from-slate-950/90 dark:via-slate-950/40 dark:to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full">
            <div className="hidden md:block w-48 lg:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-slate-200 dark:bg-slate-800">
              {details.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${details.poster_path}`}
                  alt={title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex flex-col items-center justify-center text-slate-400 gap-3">
                  <img src="/logo.png" alt="Vidbanda" className="w-16 h-16 opacity-30 grayscale" />
                  <span className="text-sm font-medium uppercase tracking-wider">No Image</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-lg">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-800 dark:text-slate-200 mb-6 drop-shadow-md font-medium">
                <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded backdrop-blur-sm">
                  <Star size={16} className="fill-current" />
                  <span>{details.vote_average ? details.vote_average.toFixed(1) : 'NR'}</span>
                </div>
                {year && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{year}</span>
                  </div>
                )}
                {details.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {details.genres?.map((g) => (
                    <span key={g.id} className="px-2 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-xs backdrop-blur-sm">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 mb-8 leading-relaxed drop-shadow-md font-medium">
                {details.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
                <button
                  onClick={scrollToPlayer}
                  className="flex-1 sm:flex-none justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                >
                  <Play size={20} className="fill-current" /> Play Now
                </button>
                
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex-1 sm:flex-none justify-center px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1"
                  >
                    <Youtube size={20} /> Trailer
                  </button>
                )}

                <button
                  onClick={handleListToggle}
                  className={`flex-1 sm:flex-none justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center gap-2 transition-all ${
                    inList
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 backdrop-blur-sm'
                  }`}
                >
                  {inList ? (
                    <>
                      <Check size={20} /> Added to List
                    </>
                  ) : (
                    <>
                      <Plus size={20} /> Add to List
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Section */}
      <div ref={playerRef} className="container mx-auto px-4 md:px-6 mt-8 md:mt-12 scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Theatre Mode</h2>
        </div>
        
        <div className="relative aspect-video w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-slate-200 dark:border-slate-800">
          <Player 
            mediaId={details.id.toString()} 
            mediaType={type || 'movie'} 
            season={selectedSeason} 
            episode={selectedEpisode} 
          />
        </div>
      </div>

      {/* Cast Section */}
      {details.credits?.cast && details.credits.cast.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Top Cast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {details.credits.cast.slice(0, 6).map((actor) => (
              <div key={actor.id} className="flex flex-col gap-2">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {actor.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <img src="/logo.png" alt="Vidbanda" className="w-8 h-8 opacity-30 grayscale" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-white">{actor.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Episodes Section (TV Only) */}
      {type === 'tv' && details.seasons && details.seasons.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Episodes</h2>
            
            <div className="relative inline-block w-full md:w-64">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {details.seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    {season.name} ({season.episode_count} Episodes)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
            </div>
          </div>

          {seasonDetails && seasonDetails.episodes && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {seasonDetails.episodes.map((episode) => (
                <div 
                  key={episode.id}
                  onClick={() => handlePlayEpisode(episode.episode_number)}
                  className="group flex flex-col gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {episode.still_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${episode.still_path}`}
                        alt={episode.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <img src="/logo.png" alt="Vidbanda" className="w-10 h-10 opacity-30 grayscale" />
                        <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300">
                        <Play size={20} className="fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded">
                      {episode.runtime ? `${episode.runtime}m` : 'TBA'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {episode.episode_number}. {episode.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {episode.overview || 'No description available.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Similar Content Section */}
      {details.similar?.results && details.similar.results.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 mt-16">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Similar {type === 'tv' ? 'TV Shows' : 'Movies'}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {details.similar.results.slice(0, 12).map((item) => (
              <MediaCard key={item.id} item={{ ...item, media_type: type || 'movie' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
