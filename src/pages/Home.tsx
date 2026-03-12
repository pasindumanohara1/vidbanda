import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { tmdb, IMAGE_W1280_URL } from '../services/tmdb';
import { MediaItem } from '../types';
import { MediaCard } from '../components/common/MediaCard';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ResponsiveBanner } from '../components/ads/ResponsiveBanner';
import { NativeBanner } from '../components/ads/NativeBanner';
import { AdBanner } from '../components/ads/AdBanner';

export const Home: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTv, setPopularTv] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Infinite scroll state for trending
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 1) {
          setLoading(true);
          const [trendingData, moviesData, tvData] = await Promise.all([
            tmdb.getTrending('all', 'day', 1),
            tmdb.getPopular('movie', 1),
            tmdb.getPopular('tv', 1),
          ]);

          setTrending(trendingData.results);
          setPopularMovies(moviesData.results);
          setPopularTv(tvData.results);
          setHasMore(trendingData.page < trendingData.total_pages);
          setLoading(false);
        } else {
          const trendingData = await tmdb.getTrending('all', 'day', page);
          setTrending(prev => {
            const newIds = new Set(prev.map(m => m.id));
            const uniqueNew = trendingData.results.filter((m: MediaItem) => !newIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
          setHasMore(trendingData.page < trendingData.total_pages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

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

  if (loading && page === 1) {
    return <LoadingSpinner />;
  }

  const heroItem = trending[0];
  const heroTitle = heroItem?.title || heroItem?.name || heroItem?.original_title || heroItem?.original_name;

  return (
    <div className="flex flex-col gap-12 pb-12">
      <Helmet>
        <title>Vidbanda - Watch Movies and TV Shows Online</title>
        <meta name="description" content="Discover and watch the latest trending movies and TV shows on Vidbanda. Explore popular content, create your watchlist, and enjoy seamless streaming." />
      </Helmet>
      {/* Hero Section */}
      {heroItem && (
        <section className="relative w-full min-h-[85vh] md:min-h-[75vh] flex items-end pb-20 pt-32">
          <div className="absolute inset-0 bg-slate-900">
            {heroItem.backdrop_path && (
              <img
                src={`${IMAGE_W1280_URL}${heroItem.backdrop_path}`}
                alt={heroTitle}
                className="w-full h-full object-cover"
                loading="eager"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/40 to-transparent dark:from-slate-950/90 dark:via-slate-950/40 dark:to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Trending Now
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 drop-shadow-md">
                  {heroItem.media_type === 'tv' ? 'TV Series' : 'Movie'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight drop-shadow-lg">
                {heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 mb-8 line-clamp-3 max-w-xl drop-shadow-md font-medium">
                {heroItem.overview}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4 w-full">
                <Link
                  to={`/details/${heroItem.media_type || 'movie'}/${heroItem.id}`}
                  className="w-full sm:w-auto flex-1 sm:flex-none justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
                >
                  <Play size={20} className="fill-current" /> Watch Now
                </Link>
                <Link
                  to={`/details/${heroItem.media_type || 'movie'}/${heroItem.id}`}
                  className="w-full sm:w-auto flex-1 sm:flex-none justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-full font-semibold flex items-center gap-2 transition-all backdrop-blur-sm"
                >
                  <Info size={20} /> More Info
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
        <ResponsiveBanner />
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Movies</h2>
            <Link to="/movies" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {popularMovies.slice(0, 12).map((item) => (
              <MediaCard key={item.id} item={{ ...item, media_type: 'movie' }} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdBanner adKey="b7b9503357eacfd5d6a20f48a28440b7" width={300} height={250} />
          <div className="hidden md:block">
            <AdBanner adKey="b7b9503357eacfd5d6a20f48a28440b7" width={300} height={250} />
          </div>
          {/* Mobile only ad */}
          <div className="block md:hidden">
            <AdBanner adKey="5d2edd3ac89c6c1954a1ef6a3db75a0c" width={320} height={50} />
          </div>
        </div>

        <NativeBanner />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular TV Shows</h2>
            <Link to="/tv" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {popularTv.slice(0, 12).map((item) => (
              <MediaCard key={item.id} item={{ ...item, media_type: 'tv' }} />
            ))}
          </div>
          {/* Recommended Ad after Popular TV Shows */}
          <div className="mt-8">
            <NativeBanner />
          </div>
          {/* Mobile only ad at bottom of section */}
          <div className="block sm:hidden mt-6">
            <AdBanner adKey="5d2edd3ac89c6c1954a1ef6a3db75a0c" width={320} height={50} />
          </div>
        </section>

        {/* Infinite Trending Section with Ads every 3 rows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending This Week</h2>
          </div>
          <div className="flex flex-col gap-12">
            {(() => {
              const items = trending.slice(1);
              const rows: MediaItem[][] = [];
              
              // Responsive items per row
              // xl: 8, lg: 6, md: 5, sm: 4, default: 3
              let itemsPerRow = 3;
              if (typeof window !== 'undefined') {
                const width = window.innerWidth;
                if (width >= 1280) itemsPerRow = 8;
                else if (width >= 1024) itemsPerRow = 6;
                else if (width >= 768) itemsPerRow = 5;
                else if (width >= 640) itemsPerRow = 4;
              }
              
              const chunkSize = itemsPerRow * 3; // 3 rows
              
              for (let i = 0; i < items.length; i += chunkSize) {
                rows.push(items.slice(i, i + chunkSize));
              }

              return rows.map((chunk, index) => (
                <React.Fragment key={index}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                    {chunk.map((item) => (
                      <MediaCard key={item.id} item={item} />
                    ))}
                  </div>
                  {/* Place ad after every chunk (which represents 3 rows) */}
                  <div className="flex justify-center py-4">
                    <div className="hidden md:block">
                      <AdBanner adKey="720x90_placeholder" width={720} height={90} />
                    </div>
                    <div className="block md:hidden">
                      <NativeBanner />
                    </div>
                  </div>
                </React.Fragment>
              ));
            })()}
          </div>
          <div ref={observerTarget} className="py-2 flex justify-center min-h-[40px]">
            {page > 1 && hasMore && <LoadingSpinner />}
            {!hasMore && <p className="text-slate-500 dark:text-slate-400 text-sm">No more trending items to load.</p>}
          </div>
        </section>
        
        <div className="flex justify-center mb-8">
          <AdBanner adKey="b7b9503357eacfd5d6a20f48a28440b7" width={300} height={250} />
        </div>
      </div>
    </div>
  );
};
