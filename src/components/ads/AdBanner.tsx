import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  format?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ adKey, width, height, format = 'iframe' }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      
      conf.innerHTML = `atOptions = {
        'key' : '${adKey}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };`;

      bannerRef.current.append(conf);
      bannerRef.current.append(script);
    }
  }, [adKey, width, height, format]);

  return (
    <div className="flex justify-center w-full overflow-hidden my-2">
      <div ref={bannerRef} style={{ width, height }} />
    </div>
  );
};
