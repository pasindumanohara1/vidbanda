import React from 'react';
import { AdBanner } from './AdBanner';

export const ResponsiveBanner: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-6">
      {/* Mobile: 320x50 */}
      <div className="block sm:hidden">
        <AdBanner adKey="5d2edd3ac89c6c1954a1ef6a3db75a0c" width={320} height={50} />
      </div>
      {/* Tablet: 468x60 */}
      <div className="hidden sm:block md:hidden">
        <AdBanner adKey="239861832e3b1642e89becae3b0978ff" width={468} height={60} />
      </div>
      {/* Desktop: 728x90 */}
      <div className="hidden md:block">
        <AdBanner adKey="ac236b54f4167ecf7cea58fee5e894e0" width={728} height={90} />
      </div>
    </div>
  );
};
