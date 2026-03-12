import React, { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
interface PlayerProps {
  mediaId: string;
  imdbId?: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export const Player: React.FC<PlayerProps> = ({ mediaId, imdbId, mediaType, season = 1, episode = 1 }) => {
  const servers = [
    { id: 'vidsrc-me', name: 'VidSrc.me', url: 'https://vidsrcme.ru' },
    { id: 'vidlink', name: 'VidLink', url: 'https://vidlink.pro' },
    { id: 'vidsrc-net', name: 'VidSrc.net', url: 'https://vidsrc.net' },
    { id: 'vidsrc-in', name: 'VidSrc.in', url: 'https://vidsrc.in' },
    { id: 'vidsrc-pm', name: 'VidSrc.pm', url: 'https://vidsrc.pm' },
    { id: 'vidsrc-xyz', name: 'VidSrc.xyz', url: 'https://vidsrc.xyz' },
    { id: 'vidsrc-to', name: 'VidSrc.to', url: 'https://vidsrc.to' },
    { id: 'embed-su', name: 'Embed.su', url: 'https://embed.su' },
    { id: '2embed', name: '2Embed', url: 'https://www.2embed.cc' },
    { id: 'vidbinge', name: 'VidBinge', url: 'https://vidbinge.to' },
    { id: 'frembed', name: 'FREMbed', url: 'https://frembed.com' },
  ];

  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [showServers, setShowServers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (server: typeof servers[0]) => {
    const id = imdbId || mediaId;
    
    switch (server.id) {
      case 'vidsrc-me':
        return mediaType === 'movie'
          ? `${server.url}/embed/movie/${id}`
          : `${server.url}/embed/tv/${id}/${season}-${episode}`;
      case 'vidlink':
        return mediaType === 'movie'
          ? `${server.url}/movie/${mediaId}?primaryColor=3B82F6&autoplay=false`
          : `${server.url}/tv/${mediaId}/${season}/${episode}?primaryColor=3B82F6&autoplay=false`;
      
      case 'vidsrc-net':
      case 'vidsrc-in':
      case 'vidsrc-pm':
      case 'vidsrc-xyz':
        return mediaType === 'movie'
          ? `${server.url}/embed/movie/${id}`
          : `${server.url}/embed/tv/${id}/${season}/${episode}`;
      
      case 'vidsrc-to':
        return mediaType === 'movie'
          ? `${server.url}/embed/movie/${mediaId}`
          : `${server.url}/embed/tv/${mediaId}/${season}/${episode}`;
          
      case 'embed-su':
        return mediaType === 'movie'
          ? `${server.url}/embed/movie/${id}`
          : `${server.url}/embed/tv/${id}/${season}/${episode}`;
          
      case '2embed':
        return mediaType === 'movie'
          ? `${server.url}/embed/${id}`
          : `${server.url}/embedtv/${id}&s=${season}&e=${episode}`;
          
      case 'vidbinge':
        return mediaType === 'movie'
          ? `${server.url}/movie/${id}`
          : `${server.url}/tv/${id}/${season}/${episode}`;
          
      case 'frembed':
        return mediaType === 'movie'
          ? `${server.url}/api/film.php?id=${mediaId}`
          : `${server.url}/api/serie.php?id=${mediaId}&sa=${season}&epi=${episode}`;
          
      default:
        return mediaType === 'movie'
          ? `https://vidlink.pro/movie/${mediaId}?primaryColor=3B82F6&autoplay=false`
          : `https://vidlink.pro/tv/${mediaId}/${season}/${episode}?primaryColor=3B82F6&autoplay=false`;
    }
  };

  const handleNextServer = () => {
    setIsLoading(true);
    setCurrentServerIndex((prev) => (prev + 1) % servers.length);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col group">
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin opacity-80"></div>
              <img 
                src="/logo.png" 
                alt="Loading..." 
                className="w-12 h-12 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
            <p className="text-white font-medium text-lg animate-pulse tracking-wide">
              Connecting to {servers[currentServerIndex].name}...
            </p>
          </div>
        )}
        <iframe
          key={servers[currentServerIndex].id}
          src={getEmbedUrl(servers[currentServerIndex])}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          title="Video Player"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => setIsLoading(false)}
        ></iframe>

        {/* Player Controls Overlay - Centered at top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleNextServer}
            className="flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors text-sm font-medium border border-white/20 shadow-lg"
            title="Switch to next server if current is not working"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Switch Server</span>
            <span className="sm:hidden">Switch</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowServers(!showServers)}
              className="flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors text-sm font-medium border border-white/20 shadow-lg"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Server: {servers[currentServerIndex].name.split(' ')[0]}</span>
              <span className="sm:hidden">Servers</span>
            </button>
            
            {showServers && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
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
                        ? 'bg-blue-600/80 text-white font-medium'
                        : 'text-slate-300 hover:bg-white/10'
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
    </div>
  );
};
