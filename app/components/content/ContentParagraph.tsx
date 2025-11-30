import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface ContentParagraphProps {
  children: ReactNode;
  className?: string;
}

export function ContentParagraph({
  children,
  className = 'mb-4',
}: ContentParagraphProps) {
  return (
    <p
      className={`text-field leading-relaxed ${className}`}
      style={{ color: colors.gray1 }}
    >
      {children}
    </p>
  );
}
