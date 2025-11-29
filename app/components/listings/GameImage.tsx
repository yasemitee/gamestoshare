'use client';

import { useState } from 'react';
import { colors } from '@/lib/colors';

interface GameImageProps {
  headerImage?: string | null;
  iconUrl?: string | null;
  name: string;
}

export function GameImage({ headerImage, iconUrl, name }: GameImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(headerImage || iconUrl || '');

  const handleError = () => {
    if (currentSrc === headerImage && iconUrl) {
      setCurrentSrc(iconUrl);
    } else {
      setImageError(true);
    }
  };

  if (!currentSrc || imageError) {
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
      src={currentSrc}
      alt={name}
      className="w-full h-full object-cover"
      onError={handleError}
    />
  );
}
