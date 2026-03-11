import React, { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

interface PlayerProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export const Player: React.FC<PlayerProps> = ({ mediaId, mediaType, season = 1, episode = 1 }) => {
  const servers = [
    { id: 'vidlink', name: 'VidLink (Recommended)' },
    { id: 'vidsrc.to', name: 'VidSrc.to' },
    { id: 'vidsrc.me', name: 'VidSrc.me' },
    { id: 'vidsrc.cc', name: 'VidSrc.cc' },
    { id: 'vidsrc.pro', name: 'VidSrc.pro' },
    { id: 'superembed', name: 'SuperEmbed' },
    { id: 'autoembed', name: 'AutoEmbed' },
  ];

  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [showServers, setShowServers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (serverId: string) => {
    switch (serverId) {
      case 'vidlink':
        return mediaType === 'movie'
          ? `https://vidlink.pro/movie/${mediaId}?autoplay=false`
          : `https://vidlink.pro/tv/${mediaId}/${season}/${episode}?autoplay=false`;
      case 'vidsrc.to':
        return mediaType === 'movie'
          ? `https://vidsrc.to/embed/movie/${mediaId}`
          : `https://vidsrc.to/embed/tv/${mediaId}/${season}/${episode}`;
      case 'vidsrc.me':
        return mediaType === 'movie' 
          ? `https://vidsrc.me/embed/movie?tmdb=${mediaId}`
          : `https://vidsrc.me/embed/tv?tmdb=${mediaId}&season=${season}&episode=${episode}`;
      case 'vidsrc.cc':
        return mediaType === 'movie'
          ? `https://vidsrc.cc/v2/embed/movie/${mediaId}`
          : `https://vidsrc.cc/v2/embed/tv/${mediaId}/${season}/${episode}`;
      case 'vidsrc.pro':
        return mediaType === 'movie'
          ? `https://vidsrc.pro/embed/movie/${mediaId}`
          : `https://vidsrc.pro/embed/tv/${mediaId}/${season}/${episode}`;
      case 'superembed':
        return mediaType === 'movie'
          ? `https://multiembed.mov/?video_id=${mediaId}&tmdb=1`
          : `https://multiembed.mov/?video_id=${mediaId}&tmdb=1&s=${season}&e=${episode}`;
      case 'autoembed':
        return mediaType === 'movie'
          ? `https://autoembed.to/movie/tmdb/${mediaId}`
          : `https://autoembed.to/tv/tmdb/${mediaId}-${season}-${episode}`;
      default:
        return mediaType === 'movie'
          ? `https://vidlink.pro/movie/${mediaId}?autoplay=false`
          : `https://vidlink.pro/tv/${mediaId}/${season}/${episode}?autoplay=false`;
    }
  };

  const handleNextServer = () => {
    setIsLoading(true);
    setCurrentServerIndex((prev) => (prev + 1) % servers.length);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300">
            <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-white font-medium text-lg animate-pulse">
              Connecting to {servers[currentServerIndex].name}...
            </p>
          </div>
        )}
        <iframe
          key={servers[currentServerIndex].id}
          src={getEmbedUrl(servers[currentServerIndex].id)}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          title="Video Player"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>

      {/* Player Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleNextServer}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors text-sm font-medium border border-white/10"
          title="Switch to next server if current is not working"
        >
          <RefreshCw size={16} />
          Switch Server
        </button>
        <div className="relative">
          <button
            onClick={() => setShowServers(!showServers)}
            className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors text-sm font-medium border border-white/10"
          >
            <Settings size={16} />
            Servers
          </button>
          
          {showServers && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50">
              {servers.map((server, index) => (
                <button
                  key={server.id}
                  onClick={() => {
                    if (index !== currentServerIndex) {
                      setIsLoading(true);
                      setCurrentServerIndex(index);
                    }
                    setShowServers(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    index === currentServerIndex
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
