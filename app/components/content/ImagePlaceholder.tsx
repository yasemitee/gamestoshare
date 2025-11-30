import { colors } from '@/lib/colors';

interface ImagePlaceholderProps {
  className?: string;
}

export function ImagePlaceholder({
  className = 'mt-8 mb-16',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`w-full h-64 flex items-center justify-center ${className}`}
      style={{ backgroundColor: colors.gray3 }}
    >
      <span className="text-field" style={{ color: colors.gray1 }}>
        Image placeholder
      </span>
    </div>
  );
}
