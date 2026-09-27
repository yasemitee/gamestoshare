'use client';

import { useState } from 'react';
import { colors } from '@/lib/colors';
import { useResilientGameImage } from '@/hooks/useResilientGameImage';

interface GameImageProps {
  headerImage?: string | null;
  iconUrl?: string | null;
  appId?: number | null;
  name: string;
}

export function GameImage({ headerImage, iconUrl, appId, name }: GameImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const { src, handleError, imgRef } = useResilientGameImage({
    headerImage,
    iconUrl,
    appId,
  });

  if (!src) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center text-xs text-center p-2"
        style={{ color: colors.gray1 }}
      >
        {name}
      </div>
    );
  }

  return (
    <img
      key={src}
      ref={(el) => imgRef(el, () => setLoadedSrc(src))}
      src={src}
      alt={name}
      className="w-full h-full object-cover transition-opacity duration-200"
      // Hidden until painted, so a failing source never shows the browser's
      // broken-image glyph while the hook swaps to the next candidate.
      style={{ opacity: loadedSrc === src ? 1 : 0 }}
      onLoad={() => setLoadedSrc(src)}
      onError={handleError}
    />
  );
}
