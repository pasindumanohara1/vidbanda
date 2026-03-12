import React from 'react';
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin opacity-80"></div>
        {/* Inner pulsing logo */}
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="w-20 h-20 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          onError={(e) => { 
            const target = e.currentTarget;
            if (target.src !== window.location.origin + '/logo.png') {
              target.src = window.location.origin + '/logo.png';
            }
          }}
        />
      </div>
      <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
};
