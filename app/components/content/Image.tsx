import { colors } from '@/lib/colors';

interface Image {
  src: string;
  alt: string;
}

interface ImageProps {
  className?: string;
  img?: Image;
}

export function Image({ className = 'mt-8 mb-16', img }: ImageProps) {
  return (
    <div
      className={`md:w-2xl ${className} overflow-hidden`}
      style={{ backgroundColor: colors.gray3 }}
    >
      <img
        src={img?.src || ''}
        alt={img?.alt || 'Image '}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
