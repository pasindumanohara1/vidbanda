import React, { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import logo from '../../assets/logo.png';

interface PlayerProps {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export const Player: React.FC<PlayerProps> = ({ mediaId, mediaType, season = 1, episode = 1 }) => {
  const servers = [
    { id: 'vidlink', name: 'VidLink', url: 'https://vidlink.pro' },
    { id: 'vidlink-net', name: 'VidLink Alt', url: 'https://vidlink.net' },
    { id: 'vidsrc-net', name: 'VidSrc', url: 'https://vidsrc.net/embed' },
    { id: 'vidsrc-in', name: 'VidSrc IN', url: 'https://vidsrc.in/embed' },
    { id: 'vidsrc-pm', name: 'VidSrc PM', url: 'https://vidsrc.pm/embed' },
    { id: 'vidsrc-xyz', name: 'VidSrc XYZ', url: 'https://vidsrc.xyz/embed' },
    { id: 'embed-su', name: 'EmbedSU', url: 'https://embed.su/embed' },
  ];

  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [showServers, setShowServers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (server: typeof servers[0]) => {
    const baseUrl = server.url;
    if (mediaType === 'movie') {
      return `${baseUrl}/movie/${mediaId}?autoPlay=true&theme=3B82F6`;
    }
    return `${baseUrl}/tv/${mediaId}/${season}/${episode}?autoPlay=true&theme=3B82F6`;
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
                src={logo} 
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
