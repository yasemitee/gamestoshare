'use client';

import { colors } from '@/lib/colors';
import { useResilientGameImage } from '@/hooks/useResilientGameImage';

interface GameImageProps {
  headerImage?: string | null;
  iconUrl?: string | null;
  appId?: number | null;
  name: string;
}

export function GameImage({ headerImage, iconUrl, appId, name }: GameImageProps) {
  const { src, handleError } = useResilientGameImage({
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
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={handleError}
    />
  );
}
