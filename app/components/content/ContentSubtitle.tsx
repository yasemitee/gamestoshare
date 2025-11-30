import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface ContentSubtitleProps {
  children: ReactNode;
  className?: string;
}

export function ContentSubtitle({
  children,
  className = 'mb-4',
}: ContentSubtitleProps) {
  return (
    <p className={`text-field ${className}`} style={{ color: colors.purple }}>
      {children}
    </p>
  );
}
