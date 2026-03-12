import React, { useEffect, useRef } from 'react';

export const NativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl28345274.effectivegatecpm.com/6abf683ae4f5d2453425d78a7d241690/invoke.js';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center my-8 w-full">
      <div ref={containerRef} className="w-full max-w-4xl">
        <div id="container-6abf683ae4f5d2453425d78a7d241690"></div>
      </div>
    </div>
  );
};
