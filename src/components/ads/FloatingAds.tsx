import React from 'react';
import { AdBanner } from './AdBanner';

export const FloatingAds: React.FC = () => {
  return (
    <>
      {/* Left Floating Ad - Desktop Only (160x600) */}
      <div className="hidden 2xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <AdBanner adKey="f71f875ea4a8542f58b7b99d640aaa34" width={160} height={600} />
      </div>
      
      {/* Right Floating Ad - Desktop Only (160x300) */}
      <div className="hidden 2xl:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <AdBanner adKey="95b97c837f68c1c095b871460c87198a" width={160} height={300} />
      </div>
    </>
  );
};
